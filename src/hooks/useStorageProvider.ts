
import { useContext, useCallback, useState } from 'react';
import { StorageContext } from '@/contexts/StorageContext';
import { StorageProviderType } from '@/lib/storage/StorageProvider';

export function useStorageProvider() {
  const context = useContext(StorageContext);
  const [lastSyncElapsed, setLastSyncElapsed] = useState<number | null>(null);
  
  if (!context) {
    throw new Error('useStorageProvider must be used within a StorageProvider');
  }
  
  // Calculate time since last sync in seconds
  const updateSyncElapsed = useCallback(() => {
    const lastSync = context.status.lastSync;
    if (!lastSync) {
      setLastSyncElapsed(null);
      return null;
    }
    
    const elapsed = Math.floor((Date.now() - lastSync.getTime()) / 1000);
    setLastSyncElapsed(elapsed);
    return elapsed;
  }, [context.status.lastSync]);
  
  // Setup polling for elapsed time updates
  useState(() => {
    if (!context.status.lastSync) return;
    
    const interval = setInterval(updateSyncElapsed, 1000);
    
    return () => clearInterval(interval);
  });
  
  return {
    ...context,
    lastSyncElapsed,
    formattedSyncAge: lastSyncElapsed !== null 
      ? lastSyncElapsed < 60 
        ? `${lastSyncElapsed}s ago`
        : `${Math.floor(lastSyncElapsed / 60)}m ago`
      : null
  };
}
