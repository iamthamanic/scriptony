
import React, { useState, useCallback } from 'react';
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
import { useToast } from "@/hooks/use-toast";

interface DeleteWorldDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => Promise<void>;
  worldName: string;
}

const DeleteWorldDialog = ({ isOpen, onClose, onDelete, worldName }: DeleteWorldDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletionError, setDeletionError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Handle clean dialog close
  const handleCloseDialog = useCallback(() => {
    // Only allow closing if not in the middle of deletion
    if (!isDeleting) {
      // Reset error state when closing
      setDeletionError(null);
      onClose();
    }
  }, [isDeleting, onClose]);
  
  // Handle deletion with improved cleanup
  const handleDelete = useCallback(async () => {
    if (isDeleting) return; // Prevent multiple clicks
    
    setIsDeleting(true);
    setDeletionError(null);
    
    try {
      console.log(`Starting deletion of world: ${worldName}`);
      
      // First close the dialog UI to prevent animation issues
      onClose();
      
      // Short delay to ensure dialog closing animation completes
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Then perform the actual deletion
      await onDelete();
      
    } catch (error) {
      console.error("Error during world deletion:", error);
      
      let errorMessage = 'Die Welt konnte nicht gelöscht werden.';
      if (error instanceof Error) {
        errorMessage = `Fehler: ${error.message}`;
        setDeletionError(errorMessage);
      }
      
      toast({
        title: 'Fehler beim Löschen',
        description: errorMessage,
        variant: 'destructive',
        duration: 3000 // Shorter duration
      });
      
      // Reset deletion state
      setIsDeleting(false);
    }
  }, [isDeleting, onDelete, worldName, toast, onClose]);

  // Return null when dialog is closed
  if (!isOpen) {
    return null;
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        handleCloseDialog();
      }
    }}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Welt löschen</AlertDialogTitle>
          <AlertDialogDescription>
            Bist du sicher, dass du die Welt &quot;{worldName}&quot; löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        {deletionError && (
          <div className="bg-destructive/20 p-3 rounded-md text-sm text-destructive">
            {deletionError}
          </div>
        )}
        
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting} onClick={handleCloseDialog}>Abbrechen</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button 
              onClick={handleDelete}
              variant="destructive"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Löschen...
                </>
              ) : (
                'Löschen'
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteWorldDialog;
