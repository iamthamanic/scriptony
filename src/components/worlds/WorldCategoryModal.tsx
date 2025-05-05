
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { WorldCategory, WorldCategoryFormData } from '@/types';
import { useWorldCategoryForm } from '@/hooks/worlds/categories/useWorldCategoryForm';
import ModalForm from './categories/ModalForm';

interface WorldCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: WorldCategoryFormData) => void;
  category?: WorldCategory;
}

const WorldCategoryModal = ({ isOpen, onClose, onSubmit, category }: WorldCategoryModalProps) => {
  const {
    formData,
    handleChange,
    handleTypeChange,
    handleContentChange
  } = useWorldCategoryForm({ category, isOpen });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-anime-purple">
            {category ? 'Kategorie bearbeiten' : 'Neue Kategorie'}
          </DialogTitle>
        </DialogHeader>
        
        <ModalForm
          formData={formData}
          onNameChange={handleChange}
          onTypeChange={handleTypeChange}
          onContentChange={handleContentChange}
          onSubmit={handleSubmit}
          onClose={onClose}
          isEditing={!!category}
        />
      </DialogContent>
    </Dialog>
  );
};

export default WorldCategoryModal;
