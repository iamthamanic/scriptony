
import { useState, useEffect } from 'react';
import { WorldCategory, WorldCategoryFormData, WorldCategoryType, getEmptyCategoryContent } from '@/types';

interface UseWorldCategoryFormProps {
  category?: WorldCategory;
  isOpen: boolean;
}

export function useWorldCategoryForm({ category, isOpen }: UseWorldCategoryFormProps) {
  const [formData, setFormData] = useState<WorldCategoryFormData>({
    name: '',
    type: 'custom',
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
        type: 'custom',
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
    setFormData(prev => {
      // Initialize appropriate content structure based on type
      const newType = value as WorldCategoryType;
      const content = getEmptyCategoryContent(newType);
      
      return { 
        ...prev, 
        type: newType,
        content
      };
    });
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
}
