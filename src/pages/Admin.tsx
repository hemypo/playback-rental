
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import BitrixConfigForm from '@/components/BitrixConfigForm';
import BitrixService from '@/services/bitrixService';

const Admin = () => {
  const [isConfigured, setIsConfigured] = useState(BitrixService.isConfigured());
  
  const handleConfigSaved = () => {
    setIsConfigured(BitrixService.isConfigured());
  };
  
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <Tabs defaultValue="integration" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="integration">Bitrix24 Integration</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="integration" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Bitrix24 Integration</CardTitle>
              <CardDescription>
                Configure your Bitrix24 connection to sync products, bookings, and customer data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-2">Connection Status</h3>
                  <div className={`px-4 py-3 rounded-md ${
                    isConfigured ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {isConfigured ? 
                      'Bitrix24 integration is configured' : 
                      'Bitrix24 integration is not configured yet'
                    }
                  </div>
                </div>
                
                <BitrixConfigForm onSaved={handleConfigSaved} />
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Integration Guide</h3>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Enter your Bitrix24 domain (e.g., yourcompany.bitrix24.com)</li>
                    <li>If required, provide an API token from your Bitrix24 account</li>
                    <li>Click "Save and Test Connection" to verify the integration</li>
                    <li>Once connected, your products and categories will be synced automatically</li>
                    <li>Bookings created on the website will appear in your Bitrix24 CRM</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="bookings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Booking Management</CardTitle>
              <CardDescription>
                View and manage equipment bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-16 text-muted-foreground">
                <p className="mb-4">Booking management interface will appear here</p>
                <p className="text-sm">
                  {isConfigured ? 
                    'Your Bitrix24 bookings will sync automatically' : 
                    'Please configure Bitrix24 integration first'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                Configure general application settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-16 text-muted-foreground">
                <p>Settings interface will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
