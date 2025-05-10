
import { useState, useEffect } from 'react';
import { WorldCategory, WorldCategoryFormData, WorldCategoryType } from '@/types';
import { getEmptyCategoryContent } from '@/types/worlds/utils';

interface UseWorldCategoryFormProps {
  category?: WorldCategory | null;
  isOpen: boolean;
}

export const useWorldCategoryForm = ({ category, isOpen }: UseWorldCategoryFormProps) => {
  const [formData, setFormData] = useState<WorldCategoryFormData>({
    name: '',
    type: 'custom' as WorldCategoryType,
    icon: 'map',
    content: {}
  });

  // Initialize content based on category type
  useEffect(() => {
    if (category) {
      setFormData({
        id: category.id,
        name: category.name,
        type: category.type,
        icon: category.icon || 'map',
        content: category.content || getEmptyCategoryContent(category.type)
      });
    } else {
      setFormData({
        name: '',
        type: 'custom' as WorldCategoryType,
        icon: 'map',
        content: {}
      });
    }
  }, [category, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value: string) => {
    // Ensure the value is a valid WorldCategoryType
    const newType = value as WorldCategoryType;
    
    // Initialize appropriate content structure based on type
    const content = getEmptyCategoryContent(newType);
    
    setFormData(prev => ({
      ...prev,
      type: newType,
      content
    }));
  };

  const handleContentChange = (newContent: any) => {
    setFormData(prev => ({
      ...prev,
      content: newContent
    }));
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleTypeChange,
    handleContentChange
  };
};
