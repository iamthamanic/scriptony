
import React from "react";
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
import { Episode } from "../types";

interface DeleteEpisodeDialogProps {
  isOpen?: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  onDelete?: () => void; // Added for compatibility
  episode: Episode | null;
  trigger?: React.ReactNode;
}

const DeleteEpisodeDialog = ({
  isOpen,
  onClose,
  onConfirm,
  onDelete, // Handle both naming conventions
  episode,
  trigger
}: DeleteEpisodeDialogProps) => {
  // For triggered dialogs without isOpen/onClose props
  const [open, setOpen] = React.useState(false);
  
  // Use provided props or local state
  const handleOpenChange = (newOpen: boolean) => {
    if (onClose && !newOpen) {
      onClose();
    } else {
      setOpen(newOpen);
    }
  };
  
  const handleConfirm = () => {
    // Support both callback naming conventions
    if (onConfirm) {
      onConfirm();
    } else if (onDelete) {
      onDelete();
    }
    
    // Close the dialog if using internal state
    if (!onClose) {
      setOpen(false);
    }
  };
  
  if (!episode) return null;

  // Use external isOpen state if provided, otherwise use local state
  const dialogOpen = isOpen !== undefined ? isOpen : open;
  
  return (
    <AlertDialog open={dialogOpen} onOpenChange={handleOpenChange}>
      {trigger && (
        <AlertDialog.Trigger asChild>
          {trigger}
        </AlertDialog.Trigger>
      )}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Episode</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete Episode {episode.number}: {episode.title}? 
            This action cannot be undone and will also affect any scenes associated with this episode.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteEpisodeDialog;
