
import React, { useState, useEffect } from 'react';
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

  // Clean up state when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      // Reset state with a small delay to ensure animations complete
      const timer = setTimeout(() => {
        setIsDeleting(false);
        setDeletionError(null);
      }, 300);
      
      // Cleanup timeout on unmount or when deps change
      return () => clearTimeout(timer);
    } else {
      // Reset error when dialog opens
      setDeletionError(null);
    }
  }, [isOpen]);

  const handleDelete = async () => {
    if (isDeleting) return; // Prevent multiple clicks
    
    setIsDeleting(true);
    setDeletionError(null);
    
    try {
      console.log(`Starting deletion of world: ${worldName}`);
      
      // Let parent component handle the actual deletion
      await onDelete();
      
      // Don't call onClose() here - it's now handled by the parent component
      // after the state updates are applied
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
        variant: 'destructive'
      });
      
      // Set isDeleting to false to allow retry
      setIsDeleting(false);
    }
  };

  // Controlled closing of dialog to prevent issues with React's state updates
  const handleDialogChange = (open: boolean) => {
    // Only allow closing if not in the middle of deletion
    if (!open && !isDeleting) {
      onClose();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleDialogChange}>
      <AlertDialogContent>
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
          <AlertDialogCancel disabled={isDeleting}>Abbrechen</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete} 
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteWorldDialog;
