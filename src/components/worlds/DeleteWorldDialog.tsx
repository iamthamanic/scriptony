
import React, { useState, useCallback, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';

interface DeleteWorldDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => Promise<void>;
  worldName: string;
}

const DeleteWorldDialog = ({ isOpen, onClose, onDelete, worldName }: DeleteWorldDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletionError, setDeletionError] = useState<string | null>(null);
  
  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setIsDeleting(false);
      setDeletionError(null);
    }
  }, [isOpen]);
  
  const handleDelete = useCallback(async () => {
    if (isDeleting) {
      console.log('Deletion already in progress, ignoring click');
      return;
    }
    
    setIsDeleting(true);
    setDeletionError(null);
    
    try {
      console.log(`Starting deletion of world "${worldName}"...`);
      await onDelete();
      console.log("Deletion completed successfully");
      
      // Do not close the dialog here, let the parent component handle it
      // based on the deletion state from useWorldDeletion hook
    } catch (error) {
      console.error("Error during world deletion:", error);
      
      const errorMessage = error instanceof Error 
        ? `Error: ${error.message}` 
        : 'An unexpected error occurred during deletion';
        
      setDeletionError(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  }, [isDeleting, onDelete, worldName]);

  const handleCloseDialog = useCallback(() => {
    // Only allow closing if not in progress
    if (!isDeleting) {
      onClose();
    } else {
      console.log('Cannot close dialog while deletion is in progress');
    }
  }, [isDeleting, onClose]);

  if (!isOpen) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => {
      if (!open && !isDeleting) {
        handleCloseDialog();
      }
    }}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Dünyayı Sil</AlertDialogTitle>
          <AlertDialogDescription>
            "{worldName}" dünyasını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        {deletionError && (
          <div className="bg-destructive/20 p-3 rounded-md text-sm text-destructive">
            {deletionError}
          </div>
        )}
        
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>İptal</AlertDialogCancel>
          <Button 
            onClick={handleDelete}
            variant="destructive"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Siliniyor...
              </>
            ) : (
              'Sil'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteWorldDialog;
