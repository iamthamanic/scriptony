
import React from 'react';
import { Cloud } from 'lucide-react';
import GoogleDriveConnection from './storage/GoogleDriveConnection';
import FileAccessInfo from './storage/FileAccessInfo';
import { StorageProviderComponent } from '@/contexts/StorageContext';
import StorageStatus from '@/components/storage/StorageStatus';

const StorageTab = () => {
  const [connectionError, setConnectionError] = React.useState<{code: string, details: string} | undefined>(undefined);

  return (
    <StorageProviderComponent>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Cloud className="h-5 w-5" />
          <h3 className="text-lg font-medium">Speicherort</h3>
        </div>
        
        <div className="mb-4">
          <StorageStatus variant="full" />
        </div>
        
        <GoogleDriveConnection connectionError={connectionError} />
        
        <FileAccessInfo />
      </div>
    </StorageProviderComponent>
  );
};

export default StorageTab;
