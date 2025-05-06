
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getEnvironmentInfo } from '@/services/auth/redirects';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { getClientId } from '@/services/storage/googleDrive/utils';

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
  const [envInfo, setEnvInfo] = useState(getEnvironmentInfo());
  const [clientIdFirstChars, setClientIdFirstChars] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [testResults, setTestResults] = useState<{[key: string]: boolean | string}>({});
  
  useEffect(() => {
    if (isOpen) {
      setEnvInfo(getEnvironmentInfo());
      runTests();
    }
  }, [isOpen]);
  
  const runTests = async () => {
    setLoading(true);
    const tests: {[key: string]: boolean | string} = {};
    
    // Test client ID
    try {
      const clientId = await getClientId();
      setClientIdFirstChars(clientId.substring(0, 8) + '...');
      tests.clientId = true;
    } catch (error) {
      console.error('Error getting client ID:', error);
      tests.clientId = false;
    }
    
    // Test Google connectivity
    try {
      const response = await fetch('https://accounts.google.com/favicon.ico', { 
        mode: 'no-cors' 
      });
      tests.googleConnectivity = true;
    } catch (error) {
      tests.googleConnectivity = false;
    }
    
    // Check domain recognition
    tests.domainRecognition = envInfo.isScriptony ? 'Scriptony Domain' : 
                             envInfo.isLovable ? 'Lovable Domain' : 
                             envInfo.isLocal ? 'Local Development' : 
                             'Unknown Domain';
    
    setTestResults(tests);
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Google Drive Verbindungsdiagnose</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <div>
                <h3 className="text-lg font-medium">Umgebungsinformationen</h3>
                <div className="mt-2 space-y-1 text-sm">
                  <p><strong>Hostname:</strong> {envInfo.hostname}</p>
                  <p><strong>Umgebungstyp:</strong> {envInfo.type}</p>
                  <p><strong>Domain-Erkennung:</strong> {testResults.domainRecognition}</p>
                  <p><strong>Origin URL:</strong> {envInfo.originUrl}</p>
                  <p><strong>Drive Redirect URL:</strong> {envInfo.driveRedirectUrl}</p>
                  <p><strong>Auth Redirect URL:</strong> {envInfo.authRedirectUrl}</p>
                  <p><strong>Client ID prüfen:</strong> {clientIdFirstChars ? 
                    `Verfügbar (${clientIdFirstChars})` : 
                    'Nicht verfügbar'}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Verbindungstests</h3>
                <div className="mt-2 space-y-1 text-sm">
                  <p><strong>Google-Verbindung:</strong> {
                    testResults.googleConnectivity === true ? '✅ Erfolgreich' : 
                    testResults.googleConnectivity === false ? '❌ Fehlgeschlagen' : 
                    '⏳ Nicht getestet'
                  }</p>
                  <p><strong>Client ID:</strong> {
                    testResults.clientId === true ? '✅ Verfügbar' : 
                    testResults.clientId === false ? '❌ Fehlt' : 
                    '⏳ Nicht getestet'
                  }</p>
                </div>
              </div>
              
              {lastError && (
                <div>
                  <h3 className="text-lg font-medium text-destructive">Letzter Fehler</h3>
                  <div className="mt-2 p-3 bg-destructive/10 rounded-md border border-destructive/20">
                    <p className="font-medium">Fehlercode: {lastError.code}</p>
                    <p className="text-sm mt-1 break-words">{lastError.details}</p>
                  </div>
                </div>
              )}
              
              <div className="pt-4 flex justify-end">
                <Button onClick={runTests}>Tests erneut ausführen</Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DriveConnectionDiagnostics;
