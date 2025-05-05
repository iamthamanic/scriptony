import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Upload, Download, FileText, Cloud, Link, Unlink } from 'lucide-react';
import { 
  getUserStorageSettings, 
  updateStorageProvider, 
  disconnectGoogleDrive, 
  UserStorageSettings,
  connectToGoogleDrive,
  handleDriveOAuthCallback
} from '@/services/storage';

const StorageTab = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [settings, setSettings] = useState<UserStorageSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [connectingDrive, setConnectingDrive] = useState(false);

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

  // Handle provider change
  const handleProviderChange = async (value: string) => {
    try {
      setUpdating(true);
      const provider = value as 'scriptony' | 'googleDrive';
      
      // If user selected Google Drive, start OAuth flow
      if (provider === 'googleDrive' && settings?.storage_provider !== 'googleDrive') {
        connectToGoogleDrive();
        return; // OAuth redirection will happen
      }
      
      // Otherwise just update the provider
      const updated = await updateStorageProvider(provider);
      if (updated) {
        setSettings(updated);
        toast({
          title: 'Speicherort aktualisiert',
          description: `Deine Dateien werden jetzt ${provider === 'scriptony' ? 'bei Scriptony' : 'in Google Drive'} gespeichert`,
        });
      }
    } catch (error) {
      console.error('Error updating storage provider:', error);
      toast({
        title: 'Fehler',
        description: 'Der Speicherort konnte nicht aktualisiert werden',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  // Handle Google Drive OAuth callback
  const handleOAuthCallback = async () => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    
    if (code && state) {
      try {
        setConnectingDrive(true);
        const result = await handleDriveOAuthCallback(code, state);
        
        if (result.success) {
          toast({
            title: 'Erfolgreich verbunden',
            description: `Google Drive wurde verknüpft (${result.email})`,
          });
          
          // Update provider to Google Drive
          await updateStorageProvider('googleDrive');
          
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
        setConnectingDrive(false);
        
        // Clear URL parameters
        const newUrl = window.location.pathname + window.location.search.split('&code')[0].split('?code')[0] + '?tab=storage';
        window.history.replaceState({}, '', newUrl);
      }
    }
  };

  // Handle Drive disconnect
  const handleDisconnectDrive = async () => {
    try {
      setUpdating(true);
      const updated = await disconnectGoogleDrive();
      if (updated) {
        setSettings(updated);
        toast({
          title: 'Verbindung getrennt',
          description: 'Die Verbindung zu Google Drive wurde getrennt',
        });
      }
    } catch (error) {
      console.error('Error disconnecting Google Drive:', error);
      toast({
        title: 'Fehler',
        description: 'Die Verbindung konnte nicht getrennt werden',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  // Toggle upload to Drive setting
  const toggleUploadToDrive = async () => {
    if (!settings) return;
    
    try {
      setUpdating(true);
      const updated = await updateStorageProvider(
        settings.upload_to_drive ? 'scriptony' : 'googleDrive'
      );
      if (updated) {
        setSettings(updated);
        toast({
          title: 'Einstellung aktualisiert',
          description: updated.upload_to_drive 
            ? 'Neue Dateien werden in Google Drive gespeichert' 
            : 'Neue Dateien werden bei Scriptony gespeichert',
        });
      }
    } catch (error) {
      console.error('Error updating upload setting:', error);
      toast({
        title: 'Fehler',
        description: 'Die Einstellung konnte nicht aktualisiert werden',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Cloud className="h-5 w-5" />
        <h3 className="text-lg font-medium">Speicherort</h3>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Dateispeicherung</CardTitle>
          <CardDescription>
            Lege fest, wo deine Dateien (Skripte, Bilder, Audio) gespeichert werden sollen
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup 
            value={settings?.storage_provider || 'scriptony'} 
            onValueChange={handleProviderChange}
            className="space-y-4"
            disabled={updating || connectingDrive}
          >
            <div className="flex items-start space-x-3 space-y-0">
              <RadioGroupItem value="scriptony" id="scriptony" />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="scriptony" className="text-base font-medium">
                  Standard (Scriptony-Server)
                </Label>
                <p className="text-sm text-muted-foreground">
                  Dateien werden sicher auf unseren Servern gespeichert
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 space-y-0">
              <RadioGroupItem value="googleDrive" id="googleDrive" />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="googleDrive" className="text-base font-medium">
                  Google Drive
                </Label>
                <p className="text-sm text-muted-foreground">
                  Dateien werden in deinem Google Drive-Konto gespeichert
                </p>
              </div>
            </div>
          </RadioGroup>
          
          {settings?.storage_provider === 'googleDrive' && settings?.drive_account_email && (
            <Alert className="mt-4">
              <Cloud className="h-4 w-4" />
              <AlertTitle>Google Drive verbunden</AlertTitle>
              <AlertDescription className="space-y-4">
                <div>
                  <p className="text-sm">
                    <strong>Konto:</strong> {settings.drive_account_email}
                  </p>
                  <p className="text-sm">
                    <strong>Ordner:</strong> {settings.drive_folder_name || 'Scriptony'}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="upload-to-drive" 
                      checked={settings.upload_to_drive} 
                      onCheckedChange={toggleUploadToDrive}
                      disabled={updating}
                    />
                    <Label htmlFor="upload-to-drive">
                      Alle neuen Uploads in Drive speichern
                    </Label>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleDisconnectDrive}
                    disabled={updating}
                  >
                    <Unlink className="h-4 w-4 mr-2" />
                    Verbindung trennen
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          {settings?.storage_provider === 'googleDrive' && !settings?.drive_account_email && (
            <Button 
              variant="outline" 
              onClick={() => connectToGoogleDrive()}
              disabled={updating || connectingDrive}
              className="mt-4"
            >
              <Link className="h-4 w-4 mr-2" />
              Mit Google Drive verbinden
              {connectingDrive && <span className="ml-2 animate-spin">⟳</span>}
            </Button>
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
                  Automatischer Upload aller Projektdateien
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 border rounded-md">
              <div className="p-2 bg-muted rounded-full">
                <Download className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <h4 className="font-medium">Download</h4>
                <p className="text-sm text-muted-foreground">
                  Herunterladen von Projektdateien bei Bedarf
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
                <h4 className="font-medium">Eigene Kontrolle</h4>
                <p className="text-sm text-muted-foreground">
                  Volle Kontrolle über Speicherort und Zugriff
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
