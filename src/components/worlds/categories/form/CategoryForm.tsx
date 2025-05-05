
import React from 'react';
import { WorldCategoryFormData } from '@/types';
import CategoryNameField from './CategoryNameField';
import TypeSelector from '../TypeSelector';
import ContentEditorLoader from '../ContentEditorLoader';
import ModalFooter from './ModalFooter';

interface CategoryFormProps {
  formData: WorldCategoryFormData;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTypeChange: (value: string) => void;
  onContentChange: (content: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  isEditing: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  formData,
  onNameChange,
  onTypeChange,
  onContentChange,
  onSubmit,
  onClose,
  isEditing
}) => {
  // Category types for the selector
  const categoryTypes = [
    { value: 'geography', label: 'Geografie' },
    { value: 'politics', label: 'Politik' },
    { value: 'economy', label: 'Wirtschaft' },
    { value: 'society', label: 'Gesellschaft' },
    { value: 'religion', label: 'Religion' },
    { value: 'history', label: 'Geschichte' },
    { value: 'technology', label: 'Technologie' },
    { value: 'nature', label: 'Natur & Tiere' },
    { value: 'language', label: 'Sprache & Schrift' },
    { value: 'culture', label: 'Kultur & Kunst' },
    { value: 'custom', label: 'Benutzerdefiniert' },
  ];

  return (
    <form onSubmit={onSubmit} className="space-y-4 pt-2">
      <CategoryNameField 
        value={formData.name} 
        onChange={onNameChange} 
      />
      
      <TypeSelector 
        value={formData.type} 
        onValueChange={onTypeChange}
        categoryTypes={categoryTypes}
      />
      
      <ContentEditorLoader
        type={formData.type}
        content={formData.content}
        onChange={onContentChange}
      />
      
      <ModalFooter 
        onClose={onClose} 
        isEditing={isEditing} 
        isValid={!!formData.name} 
      />
    </form>
  );
};

export default CategoryForm;
