
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { handleDriveOAuthCallback } from '@/services/storage';

export const useOAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [connecting, setConnecting] = useState(false);

  const processOAuthCallback = async (
    onSuccess: () => Promise<void>
  ) => {
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
          await onSuccess();
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

  return {
    hasCallback: !!(searchParams.get('code') && searchParams.get('state')),
    connecting,
    processOAuthCallback,
  };
};
