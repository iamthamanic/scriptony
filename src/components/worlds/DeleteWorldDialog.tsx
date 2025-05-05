
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
import { useToast } from "@/hooks/use-toast";

interface DeleteWorldDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => Promise<void>;
  worldName: string;
}

const DeleteWorldDialog = ({ isOpen, onClose, onDelete, worldName }: DeleteWorldDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (isDeleting) return; // Prevent multiple clicks
    
    setIsDeleting(true);
    try {
      console.log(`Starting deletion of world: ${worldName}`);
      await onDelete();
      toast({
        title: 'Welt gelöscht',
        description: `"${worldName}" wurde erfolgreich gelöscht.`
      });
    } catch (error) {
      console.error("Error during world deletion:", error);
      
      let errorMessage = 'Die Welt konnte nicht gelöscht werden.';
      if (error instanceof Error) {
        errorMessage = `Fehler: ${error.message}`;
      }
      
      toast({
        title: 'Fehler beim Löschen',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsDeleting(false);
      onClose(); // Always close the dialog when done, even if there was an error
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !isDeleting && !open && onClose()}>
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
