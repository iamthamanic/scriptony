
import React from 'react';
import { useStorageProvider } from '@/hooks/useStorageProvider';
import { StorageProviderType } from '@/lib/storage/StorageProvider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Cloud, Check, Loader2, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import StorageSelectorModal from './StorageSelectorModal';

interface StorageStatusProps {
  variant?: 'badge' | 'compact' | 'full';
}

const StorageStatus: React.FC<StorageStatusProps> = ({ variant = 'compact' }) => {
  const { status, isInitializing, formattedSyncAge, connectProvider, disconnectProvider } = useStorageProvider();
  const [showStorageSelector, setShowStorageSelector] = React.useState(false);
  
  // Render just the sync status badge
  if (variant === 'badge') {
    if (!status.connected) {
      return (
        <Badge variant="outline" className="cursor-pointer" onClick={() => setShowStorageSelector(true)}>
          Not connected
        </Badge>
      );
    }
    
    if (status.isSyncing) {
      return (
        <Badge variant="outline" className="animate-pulse">
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          Syncing...
        </Badge>
      );
    }
    
    if (status.lastSync) {
      return (
        <Badge variant="success" className="cursor-default">
          <Check className="h-3 w-3 mr-1" />
          Saved {formattedSyncAge}
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline">
        <Check className="h-3 w-3 mr-1" />
        Connected
      </Badge>
    );
  }
  
  // Render compact version
  if (variant === 'compact') {
    if (isInitializing) {
      return (
        <div className="flex items-center">
          <Loader2 className="h-4 w-4 mr-2 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Initializing storage...</span>
        </div>
      );
    }
    
    if (!status.connected) {
      return (
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={() => setShowStorageSelector(true)}
          >
            <Cloud className="h-4 w-4" />
            Connect storage
          </Button>
          <StorageSelectorModal 
            isOpen={showStorageSelector} 
            onClose={() => setShowStorageSelector(false)} 
            onSelect={(type) => connectProvider(type)} 
          />
        </div>
      );
    }
    
    return (
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1 text-sm text-muted-foreground cursor-default">
              <Cloud className="h-4 w-4" />
              {status.accountInfo?.email || 'Connected'}
              {status.isSyncing && <Loader2 className="h-3 w-3 ml-1 animate-spin" />}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {status.isSyncing ? 'Syncing...' : status.lastSync ? `Last saved ${formattedSyncAge}` : 'Connected to storage'}
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }
  
  // Full version
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Storage</h3>
        {!isInitializing && !status.connected && (
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={() => setShowStorageSelector(true)}
          >
            <Cloud className="h-4 w-4" />
            Connect
          </Button>
        )}
        {!isInitializing && status.connected && (
          <div className="flex items-center gap-2">
            {status.isSyncing ? (
              <Badge variant="outline" className="animate-pulse">
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Syncing
              </Badge>
            ) : status.lastSync ? (
              <Badge variant="success">
                <Check className="h-3 w-3 mr-1" />
                Saved {formattedSyncAge}
              </Badge>
            ) : null}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={disconnectProvider}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      
      {isInitializing ? (
        <div className="flex items-center justify-center py-2">
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          <span className="text-sm text-muted-foreground">Initializing...</span>
        </div>
      ) : status.connected ? (
        <div className="text-sm">
          <p className="text-muted-foreground">
            Connected to {status.accountInfo?.email || 'storage'}
          </p>
          {status.storagePath && (
            <p className="text-xs text-muted-foreground mt-1">
              Path: {status.storagePath}
            </p>
          )}
          {status.error && (
            <p className="text-xs text-destructive mt-1">
              Error: {status.error}
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Not connected to any storage provider
        </p>
      )}
      
      <StorageSelectorModal 
        isOpen={showStorageSelector} 
        onClose={() => setShowStorageSelector(false)} 
        onSelect={(type) => connectProvider(type)} 
      />
    </div>
  );
};

export default StorageStatus;
