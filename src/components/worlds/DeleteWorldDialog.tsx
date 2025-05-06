
import React, { useState, useEffect, useCallback } from 'react';
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
  
  // Force cleanup when unmounting or when dialog opens/closes
  useEffect(() => {
    // Reset state when dialog opens or closes
    if (!isOpen) {
      const timer = setTimeout(() => {
        setIsDeleting(false);
        setDeletionError(null);
      }, 800); // Increased timeout for better cleanup
      
      return () => clearTimeout(timer);
    } else {
      // Reset error when dialog opens
      setDeletionError(null);
    }
    
    // Complete cleanup when component unmounts
    return () => {
      setIsDeleting(false);
      setDeletionError(null);
    };
  }, [isOpen]);

  // Handle deletion with improved error handling
  const handleDelete = useCallback(async () => {
    if (isDeleting) return; // Prevent multiple clicks
    
    setIsDeleting(true);
    setDeletionError(null);
    
    try {
      console.log(`Starting deletion of world: ${worldName}`);
      
      // Let parent component handle the actual deletion
      await onDelete();
      
      // Don't call onClose() here - it's handled by the parent
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
      
      // Reset deletion state
      setIsDeleting(false);
    }
  }, [isDeleting, onDelete, worldName, toast]);

  // Improved dialog change handler to prevent issues with React's state updates
  const handleDialogChange = useCallback((open: boolean) => {
    // Only allow closing if not in the middle of deletion
    if (!open && !isDeleting) {
      // Call onClose with slight delay to ensure cleanup
      setTimeout(() => {
        onClose();
      }, 50);
    }
  }, [isDeleting, onClose]);

  // Return null when dialog is closed to ensure complete DOM cleanup
  if (!isOpen) {
    return null;
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={handleDialogChange}>
      <AlertDialogContent className="z-50" onEscapeKeyDown={(e) => {
        // Prevent escape key from closing dialog during deletion
        if (isDeleting) {
          e.preventDefault();
        }
      }}>
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
            onClick={(e) => {
              e.preventDefault(); // Prevent default to have full control
              handleDelete();
            }} 
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
