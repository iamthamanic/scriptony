
import { useState, useEffect } from 'react';
import { WorldCategory, WorldCategoryFormData } from '@/types';

interface UseWorldCategoryFormProps {
  category?: WorldCategory;
  isOpen: boolean;
}

export const useWorldCategoryForm = ({ category, isOpen }: UseWorldCategoryFormProps) => {
  const [formData, setFormData] = useState<WorldCategoryFormData>({
    name: '',
    type: 'text',
    icon: '',
    content: {}
  });

  // Reset form when opening modal or changing category
  useEffect(() => {
    if (isOpen) {
      if (category) {
        setFormData({
          name: category.name,
          type: category.type,
          icon: category.icon || '',
          content: category.content || {}
        });
      } else {
        // Reset form for new category
        setFormData({
          name: '',
          type: 'text',
          icon: '',
          content: {}
        });
      }
    }
  }, [category, isOpen]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle type change
  const handleTypeChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      type: value,
      // Reset content when changing type
      content: {} 
    }));
  };

  // Handle content change based on type
  const handleContentChange = (content: any) => {
    setFormData(prev => ({ ...prev, content }));
  };

  return {
    formData,
    handleChange,
    handleTypeChange,
    handleContentChange
  };
};
