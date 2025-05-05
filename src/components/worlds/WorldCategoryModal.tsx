import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WorldCategory, WorldCategoryType, WorldCategoryFormData } from '@/types';
import CountryEditor from './geography/CountryEditor';

interface WorldCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: WorldCategoryFormData) => void;
  category?: WorldCategory;
}

const WorldCategoryModal = ({ isOpen, onClose, onSubmit, category }: WorldCategoryModalProps) => {
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
        content: category.content || {}
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
      let content = prev.content || {};
      
      if (value === 'geography' && (!prev.content || Object.keys(prev.content).length === 0)) {
        content = { countries: [] };
      }
      
      return { 
        ...prev, 
        type: value as WorldCategoryType,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

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

  const renderContentEditor = () => {
    switch (formData.type) {
      case 'geography':
        return (
          <CountryEditor 
            content={formData.content} 
            onChange={handleContentChange}
          />
        );
      default:
        return (
          <div className="space-y-2">
            <Label htmlFor="content">Inhalt (JSON Format)</Label>
            <Textarea
              id="content"
              name="content"
              value={JSON.stringify(formData.content || {}, null, 2)}
              onChange={e => {
                try {
                  handleContentChange(JSON.parse(e.target.value));
                } catch (error) {
                  // Invalid JSON, but we still keep the text
                }
              }}
              placeholder="{ }"
              className="font-mono h-40"
            />
            <p className="text-xs text-muted-foreground">
              Der Inhalt muss im JSON-Format eingegeben werden.
            </p>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-anime-purple">
            {category ? 'Kategorie bearbeiten' : 'Neue Kategorie'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="z.B. Geografie"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Typ</Label>
            <Select
              value={formData.type}
              onValueChange={handleTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Typ auswählen" />
              </SelectTrigger>
              <SelectContent>
                {categoryTypes.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {renderContentEditor()}
          
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
              {category ? 'Aktualisieren' : 'Erstellen'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WorldCategoryModal;
