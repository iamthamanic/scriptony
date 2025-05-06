
import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, X } from 'lucide-react';
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
  
  // Reset state when dialog opens/closes with a longer timeout
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setIsDeleting(false);
        setDeletionError(null);
      }, 1000); // Increased timeout for better cleanup
      
      return () => clearTimeout(timer);
    }
    
    // Reset error when dialog opens
    setDeletionError(null);
    
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
      
      // Explicitly close the dialog after deletion completes successfully
      setTimeout(() => {
        onClose();
      }, 300);
      
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
      
      // Reset deletion state with delay
      setTimeout(() => {
        setIsDeleting(false);
      }, 500);
    }
  }, [isDeleting, onDelete, worldName, toast, onClose]);

  // Return null when dialog is closed to ensure complete DOM cleanup
  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      // Only handle closing if not in the middle of deletion
      if (!open && !isDeleting) {
        onClose();
      }
    }}>
      <DialogContent 
        className="sm:max-w-md"
        onEscapeKeyDown={(e) => {
          // Prevent escape key from closing dialog during deletion
          if (isDeleting) {
            e.preventDefault();
          }
        }}
        // Force cleanup of DOM elements on close
        forceMount={isOpen}
      >
        <DialogHeader>
          <DialogTitle>Welt löschen</DialogTitle>
          <DialogDescription>
            Bist du sicher, dass du die Welt &quot;{worldName}&quot; löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.
          </DialogDescription>
        </DialogHeader>
        
        {deletionError && (
          <div className="bg-destructive/20 p-3 rounded-md text-sm text-destructive">
            {deletionError}
          </div>
        )}
        
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="mt-2 sm:mt-0"
          >
            Abbrechen
          </Button>
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteWorldDialog;
