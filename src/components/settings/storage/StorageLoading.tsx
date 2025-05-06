
import React from 'react';
import { Cloud } from 'lucide-react';

const StorageLoading = () => {
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
};

export default StorageLoading;
