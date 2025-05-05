
import React, { useState } from 'react';
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

interface DeleteWorldDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  worldName: string;
}

const DeleteWorldDialog = ({ isOpen, onClose, onDelete, worldName }: DeleteWorldDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
    } catch (error) {
      console.error("Error during world deletion:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !isDeleting && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Welt löschen</AlertDialogTitle>
          <AlertDialogDescription>
            Bist du sicher, dass du die Welt &quot;{worldName}&quot; löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.
          </AlertDialogDescription>
        </AlertDialogHeader>
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
