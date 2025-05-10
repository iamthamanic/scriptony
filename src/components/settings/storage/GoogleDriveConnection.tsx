
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Cloud, Link, Unlink, Bug } from 'lucide-react';
import { useStorageProvider } from '@/hooks/useStorageProvider';
import { StorageProviderType } from '@/lib/storage/StorageProvider';
import DriveConnectionDiagnostics from '@/components/storage/DriveConnectionDiagnostics';

interface GoogleDriveConnectionProps {
  connectionError?: {
    code: string;
    details: string;
  };
}

const GoogleDriveConnection = ({ connectionError }: GoogleDriveConnectionProps) => {
  const { status, connectProvider, disconnectProvider, isInitializing } = useStorageProvider();
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  
  const isConnected = status.connected && status.accountInfo?.email;

  const handleConnectDrive = async () => {
    try {
      await connectProvider(StorageProviderType.GOOGLE_DRIVE);
    } catch (error) {
      console.error('Error connecting to Google Drive:', error);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Google Drive Verbindung</CardTitle>
          <CardDescription>
            Scriptony speichert deine Inhalte direkt in deinem eigenen Google Drive.
            So behältst du volle Datenhoheit über deine kreativen Inhalte.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isInitializing ? (
            <div className="p-4 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : isConnected ? (
            <Alert>
              <Cloud className="h-4 w-4" />
              <AlertTitle>Google Drive verbunden ✅</AlertTitle>
              <AlertDescription className="space-y-4">
                <div>
                  <p className="text-sm">
                    <strong>Konto:</strong> {status.accountInfo?.email}
                  </p>
                  <p className="text-sm">
                    <strong>Ordner:</strong> {status.storagePath?.split('/')[0] || 'Scriptony'}
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowDiagnostics(true)}
                  >
                    <Bug className="h-4 w-4 mr-2" />
                    Diagnose
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={disconnectProvider}
                    disabled={isInitializing}
                  >
                    <Unlink className="h-4 w-4 mr-2" />
                    Verbindung trennen
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Deine Dateien werden in deinem Google Drive gespeichert. 
                  Du behältst die volle Kontrolle über deine Daten.
                </p>
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertTitle>Google Drive nicht verbunden ❌</AlertTitle>
                <AlertDescription>
                  Scriptony speichert alle Dateien (Bilder, PDFs, Audio) in deinem Google Drive.
                  Eine Verbindung ist für das Hochladen und Exportieren von Dateien erforderlich.
                </AlertDescription>
              </Alert>
              
              <div className="flex flex-col items-center justify-center py-8 space-y-4 border-2 border-dashed rounded-lg">
                <Cloud className="h-12 w-12 text-muted-foreground" />
                <div className="text-center">
                  <h3 className="text-lg font-semibold">Google Drive verbinden</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
                    Scriptony benötigt deine Erlaubnis, um Dateien in einem speziellen
                    Ordner in deinem Google Drive zu speichern und zu verwalten.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    onClick={handleConnectDrive}
                    disabled={isInitializing}
                    className="flex items-center gap-2"
                  >
                    <Link className="h-4 w-4" />
                    {isInitializing ? 'Verbindung wird hergestellt...' : 'Google Drive verbinden'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowDiagnostics(true)}
                    className="flex items-center gap-2"
                  >
                    <Bug className="h-4 w-4" />
                    Diagnose starten
                  </Button>
                </div>
              </div>
              
              {connectionError && (
                <Alert variant="destructive" className="mt-4">
                  <AlertTitle>Verbindungsfehler</AlertTitle>
                  <AlertDescription className="space-y-2">
                    <p>Es gab einen Fehler bei der Verbindung mit Google Drive:</p>
                    <p className="text-sm"><strong>Fehlercode:</strong> {connectionError.code}</p>
                    <p className="text-sm font-mono text-xs break-all">{connectionError.details}</p>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      <DriveConnectionDiagnostics
        isOpen={showDiagnostics}
        onClose={() => setShowDiagnostics(false)}
        lastError={connectionError}
      />
    </>
  );
};

export default GoogleDriveConnection;
