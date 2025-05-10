
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { StorageProviderType } from '@/lib/storage/StorageProvider';
import { Cloud, FileDown, FileUp } from 'lucide-react';

interface StorageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: StorageProviderType) => Promise<boolean>;
}

const StorageSelectorModal: React.FC<StorageSelectorModalProps> = ({ 
  isOpen, 
  onClose, 
  onSelect 
}) => {
  const [connecting, setConnecting] = React.useState(false);
  const [selectedProvider, setSelectedProvider] = React.useState<StorageProviderType | null>(null);
  
  const handleSelectProvider = async (type: StorageProviderType) => {
    try {
      setConnecting(true);
      setSelectedProvider(type);
      
      const connected = await onSelect(type);
      
      // If connected successfully or started OAuth flow, we can close
      // Google Drive will redirect to OAuth screen, so this won't matter
      if (connected === true || type === StorageProviderType.GOOGLE_DRIVE) {
        onClose();
      }
    } catch (error) {
      console.error('Error selecting provider:', error);
    } finally {
      setConnecting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Connect Storage</DialogTitle>
          <DialogDescription>
            Choose where to store your project files
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <Button
            variant="outline"
            className="flex justify-start items-center gap-2 h-auto py-3"
            onClick={() => handleSelectProvider(StorageProviderType.GOOGLE_DRIVE)}
            disabled={connecting && selectedProvider !== StorageProviderType.GOOGLE_DRIVE}
          >
            {connecting && selectedProvider === StorageProviderType.GOOGLE_DRIVE ? (
              <Cloud className="h-5 w-5 text-blue-500 animate-pulse" />
            ) : (
              <Cloud className="h-5 w-5 text-blue-500" />
            )}
            <div className="flex flex-col items-start">
              <span className="font-medium">Google Drive</span>
              <span className="text-xs text-muted-foreground">
                Store files in your Google Drive account
              </span>
            </div>
          </Button>
          
          <Button
            variant="outline"
            className="flex justify-start items-center gap-2 h-auto py-3"
            disabled={true}
          >
            <FileDown className="h-5 w-5 text-purple-500" />
            <div className="flex flex-col items-start">
              <span className="font-medium">Dropbox</span>
              <span className="text-xs text-muted-foreground">
                Coming soon
              </span>
            </div>
          </Button>
          
          <Button
            variant="outline"
            className="flex justify-start items-center gap-2 h-auto py-3"
            onClick={() => handleSelectProvider(StorageProviderType.LOCAL)}
            disabled={connecting}
          >
            <FileUp className="h-5 w-5 text-green-500" />
            <div className="flex flex-col items-start">
              <span className="font-medium">Download</span>
              <span className="text-xs text-muted-foreground">
                Export files directly to your device
              </span>
            </div>
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground mt-2">
          You can change your storage provider at any time in the settings
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default StorageSelectorModal;
