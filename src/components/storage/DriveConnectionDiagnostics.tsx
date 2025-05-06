
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Code, AlertCircle, Terminal, Copy, CheckCircle, Globe, Link } from 'lucide-react';
import { CLIENT_ID, getRedirectURI } from '@/services/storage/googleDrive/utils';
import { getEnvironmentInfo } from '@/services/auth/redirects';

interface DriveConnectionDiagnosticsProps {
  isOpen: boolean;
  onClose: () => void;
  lastError?: {
    code: string;
    details: string;
  };
}

const DriveConnectionDiagnostics: React.FC<DriveConnectionDiagnosticsProps> = ({
  isOpen,
  onClose,
  lastError
}) => {
  const [copied, setCopied] = useState<string | null>(null);
  const envInfo = getEnvironmentInfo();
  
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Terminal className="h-5 w-5" /> Drive-Verbindungsdiagnose
          </DialogTitle>
          <DialogDescription>
            Diese Informationen helfen dir, Probleme mit der Google Drive-Verbindung zu diagnostizieren.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="rounded-md bg-muted p-4">
            <h3 className="text-sm font-medium mb-2">Umgebungsinformationen</h3>
            <div className="grid gap-2">
              <div className="flex justify-between items-center">
                <span className="text-xs">Umgebungstyp:</span>
                <code className="text-xs bg-background px-2 py-1 rounded">{envInfo.type}</code>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs">Hostname:</span>
                <code className="text-xs bg-background px-2 py-1 rounded">{envInfo.hostname}</code>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs">Feste Redirects aktiviert:</span>
                <code className="text-xs bg-background px-2 py-1 rounded">{envInfo.fixedRedirects ? 'Ja' : 'Nein'}</code>
              </div>
            </div>
          </div>
        
          <div className="rounded-md bg-muted p-4">
            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Link className="h-4 w-4" /> URL-Konfiguration für Google Cloud Console
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium mb-1">Authorized JavaScript origins:</p>
                <div className="flex items-center gap-2 bg-background px-3 py-2 rounded border">
                  <code className="text-xs flex-1 overflow-x-auto">{envInfo.originUrl}</code>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => copyToClipboard(envInfo.originUrl, 'origin')}
                  >
                    {copied === 'origin' ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
                {envInfo.isLocal && (
                  <div className="flex items-center gap-2 mt-1 bg-background px-3 py-2 rounded border">
                    <code className="text-xs flex-1 overflow-x-auto">http://localhost:5173</code>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard('http://localhost:5173', 'localhost')}
                    >
                      {copied === 'localhost' ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                )}
              </div>
              
              <div>
                <p className="text-xs font-medium mb-1">Authorized redirect URIs:</p>
                <div className="flex items-center gap-2 bg-background px-3 py-2 rounded border">
                  <code className="text-xs flex-1 overflow-x-auto">{envInfo.driveRedirectUrl}</code>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => copyToClipboard(envInfo.driveRedirectUrl, 'drive-redirect')}
                  >
                    {copied === 'drive-redirect' ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
                
                <div className="flex items-center gap-2 mt-1 bg-background px-3 py-2 rounded border">
                  <code className="text-xs flex-1 overflow-x-auto">{envInfo.authRedirectUrl}</code>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => copyToClipboard(envInfo.authRedirectUrl, 'auth-redirect')}
                  >
                    {copied === 'auth-redirect' ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        
          <div className="rounded-md bg-muted p-4">
            <h3 className="text-sm font-medium mb-2">Verbindungsinformationen</h3>
            <div className="grid gap-2">
              <div className="flex justify-between items-center">
                <span className="text-xs">Client ID:</span>
                <code className="text-xs bg-background px-2 py-1 rounded">{CLIENT_ID}</code>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs">Aktuelle Drive Redirect URI:</span>
                <code className="text-xs bg-background px-2 py-1 rounded">{envInfo.driveRedirectUrl}</code>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs">Aktuelle Auth Redirect URI:</span>
                <code className="text-xs bg-background px-2 py-1 rounded">{envInfo.authRedirectUrl}</code>
              </div>
            </div>
          </div>
          
          {lastError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p><strong>Fehlercode:</strong> {lastError.code}</p>
                  <p><strong>Details:</strong> {lastError.details}</p>
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Google Cloud Console Einstellungen prüfen</h3>
            <p className="text-sm text-muted-foreground">
              Stelle sicher, dass die folgenden Einstellungen in der Google Cloud Console korrekt sind:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 pl-2">
              <li>Der OAuth consent screen ist konfiguriert</li>
              <li>Die OAuth-Client-ID ist korrekt</li>
              <li>Authorized JavaScript origins enthält: <code className="text-xs bg-muted px-1">{envInfo.originUrl}</code></li>
              <li>Authorized redirect URIs enthält: 
                <ul className="list-disc list-inside ml-4">
                  <li><code className="text-xs bg-muted px-1">{envInfo.driveRedirectUrl}</code></li>
                  <li><code className="text-xs bg-muted px-1">{envInfo.authRedirectUrl}</code></li>
                </ul>
              </li>
            </ul>
          </div>
          
          <div className="bg-muted rounded-md p-4">
            <h3 className="text-sm font-medium flex items-center mb-2">
              <Code className="h-4 w-4 mr-2" /> Google OAuth-Konfiguration
            </h3>
            <p className="text-xs mb-2">Diese Einstellungen sollten in deinem Google Cloud Project konfiguriert sein:</p>
            <pre className="bg-background p-3 rounded-md text-xs overflow-x-auto whitespace-pre-wrap">
{`OAuth consent screen:
- User Type: External
- Application name: Scriptony
- Authorized domains: ${envInfo.hostname}

Credentials > OAuth Client ID:
- Application type: Web application
- Authorized JavaScript origins:
  * ${envInfo.originUrl}
  ${envInfo.isLocal ? '  * http://localhost:5173' : ''}
- Authorized redirect URIs:
  * ${envInfo.driveRedirectUrl}
  * ${envInfo.authRedirectUrl}`}
            </pre>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button onClick={onClose}>Schließen</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DriveConnectionDiagnostics;
