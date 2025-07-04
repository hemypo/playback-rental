
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    
    // Verify the user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    const { type } = await req.json()
    
    if (!['database', 'storage', 'full'].includes(type)) {
      throw new Error('Invalid backup type')
    }

    // Create backup log entry
    const { data: logEntry, error: logError } = await supabaseClient
      .from('backup_logs')
      .insert({
        user_id: user.id,
        backup_type: type,
        status: 'in_progress'
      })
      .select()
      .single()

    if (logError) {
      throw logError
    }

    let backupBlob: Blob
    let filename: string

    try {
      if (type === 'database') {
        const dbBackup = await createDatabaseBackup(supabaseClient)
        backupBlob = new Blob([dbBackup], { type: 'application/sql' })
        filename = `database-backup-${Date.now()}.sql`
      } else if (type === 'storage') {
        backupBlob = await createStorageBackup(supabaseClient)
        filename = `storage-backup-${Date.now()}.zip`
      } else if (type === 'full') {
        const dbBackup = await createDatabaseBackup(supabaseClient)
        const storageBackup = await createStorageBackup(supabaseClient)
        backupBlob = await createFullBackup(dbBackup, storageBackup)
        filename = `full-backup-${Date.now()}.zip`
      }

      // Update backup log with success
      await supabaseClient
        .from('backup_logs')
        .update({
          status: 'completed',
          file_size: backupBlob!.size,
          completed_at: new Date().toISOString()
        })
        .eq('id', logEntry.id)

      // Return file as direct download
      return new Response(backupBlob, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Content-Length': backupBlob!.size.toString(),
        }
      })

    } catch (error) {
      console.error('Error creating backup:', error)
      
      // Update backup log with error
      await supabaseClient
        .from('backup_logs')
        .update({
          status: 'failed',
          error_message: error.message,
          completed_at: new Date().toISOString()
        })
        .eq('id', logEntry.id)

      throw error
    }

  } catch (error) {
    console.error('Error in create-backup function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred while creating backup' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})

async function createDatabaseBackup(supabaseClient: any): Promise<string> {
  const tables = ['products', 'categories', 'bookings', 'promotions', 'settings', 'backup_logs']
  let sqlDump = '-- Database Backup\n-- Generated: ' + new Date().toISOString() + '\n\n'
  
  for (const table of tables) {
    try {
      const { data, error } = await supabaseClient
        .from(table)
        .select('*')
      
      if (error) {
        console.warn(`Could not backup table ${table}:`, error)
        continue
      }
      
      if (data && data.length > 0) {
        sqlDump += `-- Table: ${table}\n`
        sqlDump += `TRUNCATE TABLE ${table} CASCADE;\n`
        
        // Generate INSERT statements
        for (const row of data) {
          const columns = Object.keys(row).join(', ')
          const values = Object.values(row).map(val => {
            if (val === null) return 'NULL'
            if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`
            if (val instanceof Date) return `'${val.toISOString()}'`
            return val
          }).join(', ')
          
          sqlDump += `INSERT INTO ${table} (${columns}) VALUES (${values});\n`
        }
        sqlDump += '\n'
      }
    } catch (error) {
      console.warn(`Error backing up table ${table}:`, error)
    }
  }
  
  return sqlDump
}

async function createStorageBackup(supabaseClient: any): Promise<Blob> {
  const buckets = ['products', 'categories', 'promotions']
  
  // Import JSZip from CDN
  const JSZip = (await import('https://esm.sh/jszip@3.10.1')).default
  const zip = new JSZip()
  
  const backupMetadata = {
    timestamp: new Date().toISOString(),
    type: 'storage_backup_with_files',
    buckets: {}
  }
  
  for (const bucket of buckets) {
    try {
      console.log(`Backing up bucket: ${bucket}`)
      const { data: files, error } = await supabaseClient.storage
        .from(bucket)
        .list()
      
      if (!error && files && files.length > 0) {
        backupMetadata.buckets[bucket] = []
        const bucketFolder = zip.folder(bucket)
        
        for (const file of files) {
          try {
            // Download the actual file
            const { data: fileData, error: downloadError } = await supabaseClient.storage
              .from(bucket)
              .download(file.name)
            
            if (!downloadError && fileData) {
              // Add file to ZIP
              const arrayBuffer = await fileData.arrayBuffer()
              bucketFolder.file(file.name, arrayBuffer)
              
              // Add metadata
              backupMetadata.buckets[bucket].push({
                name: file.name,
                size: file.metadata?.size || fileData.size,
                lastModified: file.updated_at,
                id: file.id,
                contentType: fileData.type
              })
              
              console.log(`Added file to backup: ${bucket}/${file.name}`)
            } else {
              console.warn(`Could not download file ${file.name} from ${bucket}:`, downloadError)
            }
          } catch (fileError) {
            console.warn(`Error processing file ${file.name} in bucket ${bucket}:`, fileError)
          }
        }
      } else {
        console.log(`No files found in bucket ${bucket} or error:`, error)
        backupMetadata.buckets[bucket] = { error: error?.message || 'No files found' }
      }
    } catch (error) {
      console.warn(`Could not process bucket ${bucket}:`, error)
      backupMetadata.buckets[bucket] = { error: error.message }
    }
  }
  
  // Add metadata file to ZIP
  zip.file('backup_metadata.json', JSON.stringify(backupMetadata, null, 2))
  
  // Generate ZIP file
  const zipBlob = await zip.generateAsync({ type: 'blob' })
  console.log(`Storage backup created: ${zipBlob.size} bytes`)
  
  return zipBlob
}

async function createFullBackup(dbBackup: string, storageBackup: Blob): Promise<Blob> {
  // Import JSZip from CDN
  const JSZip = (await import('https://esm.sh/jszip@3.10.1')).default
  const zip = new JSZip()
  
  // Add database backup
  zip.file('database_backup.sql', dbBackup)
  
  // Add storage backup (which is already a ZIP)
  const storageArrayBuffer = await storageBackup.arrayBuffer()
  zip.file('storage_backup.zip', storageArrayBuffer)
  
  // Add full backup manifest
  const manifest = {
    timestamp: new Date().toISOString(),
    type: 'full_backup',
    contents: {
      database: {
        filename: 'database_backup.sql',
        size: new Blob([dbBackup]).size,
        description: 'Complete database backup in SQL format'
      },
      storage: {
        filename: 'storage_backup.zip',
        size: storageBackup.size,
        description: 'Complete storage backup including all files and metadata'
      }
    },
    instructions: 'This is a complete backup. Extract database_backup.sql for database restoration and storage_backup.zip for file restoration.'
  }
  
  zip.file('backup_manifest.json', JSON.stringify(manifest, null, 2))
  
  // Generate final ZIP
  const fullBackupBlob = await zip.generateAsync({ type: 'blob' })
  console.log(`Full backup created: ${fullBackupBlob.size} bytes`)
  
  return fullBackupBlob
}
