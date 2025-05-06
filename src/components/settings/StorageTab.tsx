
import React, { useEffect, useState } from 'react';
import { Cloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getUserStorageSettings, disconnectGoogleDrive, UserStorageSettings } from '@/services/storage';
import { useOAuthCallback } from '@/hooks/useOAuthCallback';
import StorageLoading from './storage/StorageLoading';
import GoogleDriveConnection from './storage/GoogleDriveConnection';
import FileAccessInfo from './storage/FileAccessInfo';

const StorageTab = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<UserStorageSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState<{code: string, details: string} | undefined>(undefined);
  const { hasCallback, connecting, processOAuthCallback } = useOAuthCallback();

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
      
      await disconnectGoogleDrive();
      toast({
        title: 'Verbindung getrennt',
        description: 'Die Verbindung zu Google Drive wurde getrennt. Einige Funktionen sind eingeschränkt.',
        variant: 'destructive'
      });
      loadSettings();
      setConnectionError(undefined);
    } catch (error) {
      console.error('Error disconnecting Google Drive:', error);
      toast({
        title: 'Fehler',
        description: 'Die Verbindung konnte nicht getrennt werden',
        variant: 'destructive',
      });
    }
  };

  // Handle OAuth callback result
  const handleOAuthResult = (result: any) => {
    if (!result.success && result.error) {
      setConnectionError(result.error);
    } else {
      setConnectionError(undefined);
    }
  };

  // Check for OAuth callback on mount and load settings
  useEffect(() => {
    loadSettings();
    
    // Check if we have an OAuth callback
    if (hasCallback) {
      processOAuthCallback(loadSettings).then(handleOAuthResult);
    }
  }, [hasCallback]);

  // Look for error info in URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorCode = params.get('error');
    const errorMessage = params.get('error_description');
    
    if (errorCode) {
      setConnectionError({
        code: errorCode,
        details: errorMessage || 'Unbekannter Fehler'
      });
      
      // Clean URL
      const baseUrl = window.location.pathname + '?tab=storage';
      window.history.replaceState({}, '', baseUrl);
    }
  }, []);

  if (loading) {
    return <StorageLoading />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Cloud className="h-5 w-5" />
        <h3 className="text-lg font-medium">Speicherort</h3>
      </div>
      
      <GoogleDriveConnection 
        settings={settings}
        connecting={connecting}
        onDisconnect={handleDisconnectDrive}
        connectionError={connectionError}
      />
      
      <FileAccessInfo />
    </div>
  );
};

export default StorageTab;
