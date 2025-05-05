
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogFooter } from '@/components/ui/dialog';
import { WorldCategoryFormData, WorldCategoryType } from '@/types';
import TypeSelector from './TypeSelector';
import ContentEditorLoader from './ContentEditorLoader';

interface ModalFormProps {
  formData: WorldCategoryFormData;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTypeChange: (value: string) => void;
  onContentChange: (content: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  isEditing: boolean;
}

const ModalForm: React.FC<ModalFormProps> = ({
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
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={onNameChange}
          placeholder="z.B. Geografie"
          required
        />
      </div>
      
      <TypeSelector 
        value={formData.type} 
        onValueChange={onTypeChange}
        categoryTypes={categoryTypes}
      />
      
      <ContentEditorLoader
        type={formData.type as WorldCategoryType}
        content={formData.content}
        onChange={onContentChange}
      />
      
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
          disabled={!formData.name}
        >
          {isEditing ? 'Aktualisieren' : 'Erstellen'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default ModalForm;
