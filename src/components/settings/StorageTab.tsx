
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Upload, Download, FileText, Cloud, Link, Unlink } from 'lucide-react';
import { 
  getUserStorageSettings, 
  connectToGoogleDrive,
  handleDriveOAuthCallback,
  disconnectGoogleDrive,
  UserStorageSettings
} from '@/services/storage';

const StorageTab = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [settings, setSettings] = useState<UserStorageSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);

  // Load user storage settings
  const loadSettings = async () => {
    try {
      setLoading(true);
      const userSettings = await getUserStorageSettings();
      setSettings(userSettings);
    } catch (error) {
      console.error('Error loading storage settings:', error);
      toast({
        title: 'Fehler',
        description: 'Die Speichereinstellungen konnten nicht geladen werden',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Drive disconnection
  const handleDisconnectDrive = async () => {
    try {
      const confirmed = window.confirm(
        'Wenn du die Verbindung zu Google Drive trennst, kannst du keine Dateien mehr hochladen oder exportieren. ' +
        'Bestehende Dateien in deinem Google Drive bleiben erhalten. Bist du sicher?'
      );
      
      if (!confirmed) return;
      
      setConnecting(true);
      await disconnectGoogleDrive();
      toast({
        title: 'Verbindung getrennt',
        description: 'Die Verbindung zu Google Drive wurde getrennt. Einige Funktionen sind eingeschränkt.',
        variant: 'destructive'
      });
      loadSettings();
    } catch (error) {
      console.error('Error disconnecting Google Drive:', error);
      toast({
        title: 'Fehler',
        description: 'Die Verbindung konnte nicht getrennt werden',
        variant: 'destructive',
      });
    } finally {
      setConnecting(false);
    }
  };

  // Handle Google Drive OAuth callback
  const handleOAuthCallback = async () => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    
    if (code && state) {
      try {
        setConnecting(true);
        const result = await handleDriveOAuthCallback(code, state);
        
        if (result.success) {
          toast({
            title: 'Erfolgreich verbunden',
            description: `Google Drive wurde verknüpft (${result.email})`,
          });
          
          // Reload settings
          await loadSettings();
        } else {
          toast({
            title: 'Fehler bei der Verbindung',
            description: result.message,
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error handling OAuth callback:', error);
        toast({
          title: 'Verbindungsfehler',
          description: 'Fehler bei der Verbindung mit Google Drive',
          variant: 'destructive',
        });
      } finally {
        setConnecting(false);
        
        // Clear URL parameters
        const newUrl = window.location.pathname + window.location.search.split('&code')[0].split('?code')[0] + '?tab=storage';
        window.history.replaceState({}, '', newUrl);
      }
    }
  };

  // Check for OAuth callback on mount
  useEffect(() => {
    loadSettings();
    
    // Check if we have an OAuth callback
    if (searchParams.has('code') && searchParams.has('state')) {
      handleOAuthCallback();
    }
  }, []);

  // Handle connection to Google Drive
  const handleConnectDrive = () => {
    try {
      setConnecting(true);
      connectToGoogleDrive();
    } catch (error) {
      console.error('Error connecting to Google Drive:', error);
      setConnecting(false);
      toast({
        title: 'Verbindungsfehler',
        description: 'Fehler bei der Verbindung mit Google Drive',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Cloud className="h-5 w-5" />
          <h3 className="text-lg font-medium">Speicherort</h3>
        </div>
        <p className="text-muted-foreground animate-pulse">
          Speichereinstellungen werden geladen...
        </p>
      </div>
    );
  }

  const isConnected = settings?.drive_account_email && settings?.drive_folder_id;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Cloud className="h-5 w-5" />
        <h3 className="text-lg font-medium">Speicherort</h3>
      </div>
      
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
                    <strong>Konto:</strong> {settings.drive_account_email}
                  </p>
                  <p className="text-sm">
                    <strong>Ordner:</strong> {settings.drive_folder_name || 'Scriptony'}
                  </p>
                </div>
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleDisconnectDrive}
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
      
      <Card>
        <CardHeader>
          <CardTitle>Datei-Zugriff</CardTitle>
          <CardDescription>
            Informationen über den Zugriff auf deine gespeicherten Dateien
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 border rounded-md">
              <div className="p-2 bg-muted rounded-full">
                <Upload className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <h4 className="font-medium">Upload</h4>
                <p className="text-sm text-muted-foreground">
                  Automatischer Upload aller Projektdateien nach Google Drive
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 border rounded-md">
              <div className="p-2 bg-muted rounded-full">
                <Download className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <h4 className="font-medium">Direktzugriff</h4>
                <p className="text-sm text-muted-foreground">
                  Zugriff auf deine Dateien direkt über Google Drive
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 border rounded-md">
              <div className="p-2 bg-muted rounded-full">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <h4 className="font-medium">Dateiformate</h4>
                <p className="text-sm text-muted-foreground">
                  PDF, Bilder, Audio und andere Medien
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 border rounded-md">
              <div className="p-2 bg-muted rounded-full">
                <Cloud className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <h4 className="font-medium">Datenhoheit</h4>
                <p className="text-sm text-muted-foreground">
                  Volle Kontrolle über deine Dateien auch nach Scriptony-Nutzung
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StorageTab;
