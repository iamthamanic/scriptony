
import React, { createContext, useContext, useState, useEffect } from 'react';
import { StorageProvider as IStorageProvider, StorageProviderStatus, StorageProviderType } from '@/lib/storage/StorageProvider';
import { GoogleDriveProvider } from '@/lib/storage/GoogleDriveProvider';
import { useOAuthCallback } from '@/hooks/useOAuthCallback';
import { useToast } from '@/hooks/use-toast';

interface StorageContextType {
  provider: IStorageProvider | null;
  status: StorageProviderStatus;
  isInitializing: boolean;
  connectProvider: (type: StorageProviderType) => Promise<boolean>;
  disconnectProvider: () => Promise<void>;
  setProjectContext: (projectId: string, projectName: string) => void;
  setupAutoSync: (
    getContentFn: () => Promise<Blob | string>, 
    getPathFn: () => string, 
    intervalMs?: number
  ) => void;
  stopAutoSync: () => void;
}

const DefaultStorageContextValue: StorageContextType = {
  provider: null,
  status: { connected: false },
  isInitializing: true,
  connectProvider: async () => false,
  disconnectProvider: async () => {},
  setProjectContext: () => {},
  setupAutoSync: () => {},
  stopAutoSync: () => {}
};

export const StorageContext = createContext<StorageContextType>(DefaultStorageContextValue);

export const useStorage = () => useContext(StorageContext);

interface StorageProviderProps {
  children: React.ReactNode;
  defaultProviderType?: StorageProviderType;
}

// Renamed from StorageProvider to StorageProviderComponent
export const StorageProviderComponent: React.FC<StorageProviderProps> = ({ 
  children, 
  defaultProviderType = StorageProviderType.GOOGLE_DRIVE 
}) => {
  const [currentProvider, setCurrentProvider] = useState<StorageProvider | null>(null);
  const [status, setStatus] = useState<StorageProviderStatus>({ connected: false });
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [projectInfo, setProjectInfo] = useState<{ id?: string, name?: string }>({});
  const { hasCallback, processOAuthCallback } = useOAuthCallback();
  const { toast } = useToast();
  
  // Initialize provider based on default type
  useEffect(() => {
    if (defaultProviderType === StorageProviderType.NONE) {
      setIsInitializing(false);
      return;
    }
    
    initializeProvider(defaultProviderType);
  }, [defaultProviderType]);
  
  // Handle OAuth callback if present
  useEffect(() => {
    if (hasCallback && currentProvider instanceof GoogleDriveProvider) {
      handleOAuthCallback();
    }
  }, [hasCallback, currentProvider]);
  
  const initializeProvider = async (type: StorageProviderType) => {
    try {
      setIsInitializing(true);
      
      let provider: StorageProvider;
      
      switch (type) {
        case StorageProviderType.GOOGLE_DRIVE:
          provider = new GoogleDriveProvider(projectInfo.id, projectInfo.name);
          break;
        default:
          setIsInitializing(false);
          return;
      }
      
      setCurrentProvider(provider);
      
      // Check if already connected
      const connected = await provider.isConnected();
      if (connected) {
        setStatus(provider.getStatus());
      }
      
    } catch (error) {
      console.error('Error initializing storage provider:', error);
    } finally {
      setIsInitializing(false);
    }
  };
  
  // Handle OAuth callback after redirect
  const handleOAuthCallback = async () => {
    if (!currentProvider || !(currentProvider instanceof GoogleDriveProvider)) return;
    
    try {
      setIsInitializing(true);
      
      await processOAuthCallback(async () => {
        // No operation needed
      });
      
      // Update status after processing callback
      const connected = await currentProvider.isConnected();
      if (connected) {
        setStatus(currentProvider.getStatus());
        toast({
          title: 'Storage connected',
          description: `Connected to ${currentProvider.getStatus().accountInfo?.email || 'storage provider'}`
        });
      }
    } catch (error) {
      console.error('Error handling OAuth callback:', error);
      toast({
        title: 'Connection failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setIsInitializing(false);
    }
  };
  
  // Connect to a storage provider
  const connectProvider = async (type: StorageProviderType): Promise<boolean> => {
    try {
      if (currentProvider?.getType() !== type) {
        await initializeProvider(type);
      }
      
      if (!currentProvider) {
        throw new Error('Provider not initialized');
      }
      
      const connected = await currentProvider.connect();
      setStatus(currentProvider.getStatus());
      
      return connected;
    } catch (error) {
      console.error('Error connecting provider:', error);
      toast({
        title: 'Connection error',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
      return false;
    }
  };
  
  // Disconnect from current provider
  const disconnectProvider = async (): Promise<void> => {
    try {
      if (currentProvider) {
        await currentProvider.disconnect();
        setStatus(currentProvider.getStatus());
      }
    } catch (error) {
      console.error('Error disconnecting provider:', error);
      toast({
        title: 'Disconnection error',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    }
  };
  
  // Set project context for the provider
  const setProjectContext = (projectId: string, projectName: string) => {
    setProjectInfo({ id: projectId, name: projectName });
    
    if (currentProvider instanceof GoogleDriveProvider) {
      currentProvider.setProjectInfo(projectId, projectName);
    }
  };
  
  // Setup auto-sync for the current provider
  const setupAutoSync = (
    getContentFn: () => Promise<Blob | string>, 
    getPathFn: () => string, 
    intervalMs?: number
  ) => {
    if (!currentProvider || !currentProvider.setupAutoSync) return;
    currentProvider.setupAutoSync(getContentFn, getPathFn, intervalMs);
  };
  
  // Stop auto-sync for the current provider
  const stopAutoSync = () => {
    if (!currentProvider || !currentProvider.stopAutoSync) return;
    currentProvider.stopAutoSync();
  };
  
  // Update status whenever provider's status changes
  useEffect(() => {
    if (!currentProvider) return;
    
    const checkStatus = () => {
      const providerStatus = currentProvider.getStatus();
      setStatus(providerStatus);
    };
    
    // Poll for status updates every 5 seconds
    const interval = setInterval(checkStatus, 5000);
    
    return () => clearInterval(interval);
  }, [currentProvider]);
  
  const value: StorageContextType = {
    provider: currentProvider,
    status,
    isInitializing,
    connectProvider,
    disconnectProvider,
    setProjectContext,
    setupAutoSync,
    stopAutoSync
  };
  
  return (
    <StorageContext.Provider value={value}>
      {children}
    </StorageContext.Provider>
  );
};

