
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import BitrixService from '@/services/bitrixService';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BitrixConfigFormProps {
  onSaved?: () => void;
}

const BitrixConfigForm = ({ onSaved }: BitrixConfigFormProps) => {
  const [domain, setDomain] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [usingEnvVars, setUsingEnvVars] = useState(false);
  
  useEffect(() => {
    // Check if environment variables are being used
    const isUsingEnvVars = Boolean(import.meta.env.VITE_BITRIX_DOMAIN);
    setUsingEnvVars(isUsingEnvVars);
    
    // If not using env vars, populate form with saved values
    if (!isUsingEnvVars) {
      const savedConfig = localStorage.getItem('bitrixConfig');
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        setDomain(config.domain || '');
        setToken(config.token || '');
      }
    } else {
      // If using env vars, show masked values
      setDomain(import.meta.env.VITE_BITRIX_DOMAIN || '');
      setToken(import.meta.env.VITE_BITRIX_TOKEN ? '••••••••' : '');
    }
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (usingEnvVars) {
      toast({
        title: 'Environment Variables Used',
        description: 'Configuration is managed via environment variables and cannot be changed here.',
      });
      return;
    }
    
    setLoading(true);
    setTestResult(null);
    
    try {
      // Update configuration
      BitrixService.configure({ 
        domain: domain.trim(),
        token: token.trim() || undefined
      });
      
      // Test the connection
      try {
        await BitrixService.getCategories();
        setTestResult({ 
          success: true, 
          message: 'Successfully connected to Bitrix24!' 
        });
      } catch (error) {
        setTestResult({ 
          success: false, 
          message: error instanceof Error ? error.message : 'Failed to connect to Bitrix24' 
        });
      }
      
      toast({
        title: 'Configuration Saved',
        description: 'Bitrix24 integration settings have been saved.',
      });
      
      if (onSaved) onSaved();
    } catch (error) {
      console.error('Failed to save Bitrix24 configuration:', error);
      toast({
        title: 'Configuration Error',
        description: 'Could not save Bitrix24 configuration.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Bitrix24 Integration</CardTitle>
        <CardDescription>
          Connect your Bitrix24 account to sync products, categories, and bookings
        </CardDescription>
      </CardHeader>
      <CardContent>
        {usingEnvVars && (
          <Alert className="mb-6 bg-blue-50">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Configuration is managed via environment variables (VITE_BITRIX_DOMAIN and VITE_BITRIX_TOKEN). 
              To change the configuration, update these variables in your deployment environment.
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="domain">Bitrix24 Domain</Label>
            <Input
              id="domain"
              placeholder="yourcompany.bitrix24.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              required
              disabled={usingEnvVars}
            />
            <p className="text-sm text-muted-foreground">
              Enter your Bitrix24 domain without https://
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="token">Bitrix24 API Token (Optional)</Label>
            <Input
              id="token"
              type="password"
              placeholder="Enter your REST API token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              disabled={usingEnvVars}
            />
            <p className="text-sm text-muted-foreground">
              If you're using a REST API application, enter your authentication token here
            </p>
          </div>
          
          {testResult && (
            <div className={`p-3 rounded-md flex items-start gap-2 ${
              testResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {testResult.success ? (
                <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              )}
              <div>
                <p className="font-medium">{testResult.success ? 'Connection Successful' : 'Connection Failed'}</p>
                <p className="text-sm">{testResult.message}</p>
              </div>
            </div>
          )}
          
          <Button type="submit" className="w-full" disabled={loading || usingEnvVars}>
            {loading ? 'Testing Connection...' : 'Save and Test Connection'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-between flex-wrap text-sm text-muted-foreground">
        <div>Need help? <a href="https://www.bitrix24.com/rest-api/" className="underline" target="_blank" rel="noreferrer">Bitrix24 API Docs</a></div>
      </CardFooter>
    </Card>
  );
};

export default BitrixConfigForm;
