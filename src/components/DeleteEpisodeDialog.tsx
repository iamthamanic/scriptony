
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
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  episode: Episode | null;
}

const DeleteEpisodeDialog = ({
  isOpen,
  onClose,
  onConfirm,
  episode
}: DeleteEpisodeDialogProps) => {
  if (!episode) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
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
            onClick={onConfirm}
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
