
import { useState, useEffect } from 'react';
import { 
  isDriveConnected, 
  getDriveConnectionStatus 
} from '@/services/storage/googleDrive';

export function useDriveConnection() {
  const [connected, setConnected] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectionDetails, setConnectionDetails] = useState<{
    email?: string;
    folderName?: string;
  } | null>(null);

  const checkConnection = async () => {
    try {
      setLoading(true);
      const isConnected = await isDriveConnected();
      setConnected(isConnected);
      
      if (isConnected) {
        const details = await getDriveConnectionStatus();
        setConnectionDetails({
          email: details.email,
          folderName: details.folderName
        });
      } else {
        setConnectionDetails(null);
      }
    } catch (error) {
      console.error('Error checking Drive connection:', error);
      setConnected(false);
      setConnectionDetails(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return {
    connected,
    loading,
    connectionDetails,
    refreshConnection: checkConnection
  };
}
