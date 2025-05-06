import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { handleDriveOAuthCallback } from '@/services/storage';
import { DriveConnectionResponse } from '@/services/storage/googleDrive/oauthFlow';

export const useOAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [connecting, setConnecting] = useState(false);

  const processOAuthCallback = async (
    onSuccess: () => Promise<void>
  ): Promise<DriveConnectionResponse> => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    let result: DriveConnectionResponse = { 
      success: false, 
      message: 'No callback parameters found' 
    };
    
    if (code && state) {
      try {
        console.log("Processing OAuth callback with code and state");
        setConnecting(true);
        result = await handleDriveOAuthCallback(code, state);
        
        if (result.success) {
          toast({
            title: 'Erfolgreich verbunden',
            description: `Google Drive wurde verknüpft ${result.email ? `(${result.email})` : ''}`,
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
        
        result = {
          success: false,
          message: error instanceof Error ? error.message : 'Unbekannter Fehler',
          error: {
            code: 'CALLBACK_EXCEPTION',
            details: error instanceof Error ? error.message : 'Unknown error'
          }
        };
      } finally {
        setConnecting(false);
        
        // Check if we have an original URL to return to
        const originalUrl = localStorage.getItem('driveOAuthOriginUrl');
        localStorage.removeItem('driveOAuthOriginUrl');
        
        // Clean URL parameters - keep the tab parameter
        if (originalUrl) {
          // Try to go back to the original URL if possible
          navigate(originalUrl);
        } else {
          // Default fallback - just clear the auth parameters
          const newUrl = window.location.pathname + '?tab=storage';
          window.history.replaceState({}, '', newUrl);
        }
      }
    }
    
    return result;
  };

  return {
    hasCallback: !!(searchParams.get('code') && searchParams.get('state')),
    connecting,
    processOAuthCallback,
  };
};
