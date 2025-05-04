
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Character } from '../types';

interface DeleteCharacterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  character: Character;
}

const DeleteCharacterDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  character 
}: DeleteCharacterDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Character</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {character.name}? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
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

export default DeleteCharacterDialog;
