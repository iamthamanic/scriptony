
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Cloud, Link, Unlink } from 'lucide-react';
import { connectToGoogleDrive } from '@/services/storage';
import { UserStorageSettings } from '@/services/storage/types';

interface GoogleDriveConnectionProps {
  settings: UserStorageSettings | null;
  connecting: boolean;
  onDisconnect: () => Promise<void>;
}

const GoogleDriveConnection = ({ 
  settings, 
  connecting, 
  onDisconnect 
}: GoogleDriveConnectionProps) => {
  const isConnected = settings?.drive_account_email && settings?.drive_folder_id;
  
  const handleConnectDrive = () => {
    try {
      connectToGoogleDrive();
    } catch (error) {
      console.error('Error connecting to Google Drive:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Google Drive Verbindung</CardTitle>
        <CardDescription>
          Scriptony speichert deine Inhalte direkt in deinem eigenen Google Drive.
          So behältst du volle Datenhoheit über deine kreativen Inhalte.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isConnected ? (
          <Alert>
            <Cloud className="h-4 w-4" />
            <AlertTitle>Google Drive verbunden ✅</AlertTitle>
            <AlertDescription className="space-y-4">
              <div>
                <p className="text-sm">
                  <strong>Konto:</strong> {settings?.drive_account_email}
                </p>
                <p className="text-sm">
                  <strong>Ordner:</strong> {settings?.drive_folder_name || 'Scriptony'}
                </p>
              </div>
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onDisconnect}
                  disabled={connecting}
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
              <Button 
                onClick={handleConnectDrive}
                disabled={connecting}
                className="flex items-center gap-2"
              >
                <Link className="h-4 w-4" />
                {connecting ? 'Verbindung wird hergestellt...' : 'Google Drive verbinden'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoogleDriveConnection;
