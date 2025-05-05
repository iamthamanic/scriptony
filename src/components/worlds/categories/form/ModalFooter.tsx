
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';

interface ModalFooterProps {
  onClose: () => void;
  isEditing: boolean;
  isValid: boolean;
}

const ModalFooter: React.FC<ModalFooterProps> = ({ onClose, isEditing, isValid }) => {
  return (
    <DialogFooter className="pt-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onClose}
      >
        Abbrechen
      </Button>
      <Button 
        type="submit" 
        className="bg-anime-purple hover:bg-anime-dark-purple"
        disabled={!isValid}
      >
        {isEditing ? 'Aktualisieren' : 'Erstellen'}
      </Button>
    </DialogFooter>
  );
};

export default ModalFooter;
