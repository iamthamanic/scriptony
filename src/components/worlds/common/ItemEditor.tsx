
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CategoryItem, CustomField, FieldType } from '@/types/worlds';
import ImageUploader from '../geography/ImageUploader';
import CustomFieldsEditor from '../geography/CustomFieldsEditor';

interface ItemEditorProps {
  item: CategoryItem;
  onCancel: () => void;
  onSave: (item: CategoryItem) => void;
  coverImageLabel?: string;
  symbolImageLabel?: string;
  children?: React.ReactNode; // For additional category-specific tabs/content
}

const ItemEditor: React.FC<ItemEditorProps> = ({
  item,
  onCancel,
  onSave,
  coverImageLabel = "Titelbild",
  symbolImageLabel = "Symbol/Flagge",
  children
}) => {
  const [editingItem, setEditingItem] = useState<CategoryItem>({...item});

  // Create update handlers that only modify local state without triggering saves
  const handleItemUpdate = (updates: Partial<CategoryItem>) => {
    setEditingItem(prev => ({
      ...prev,
      ...updates
    }));
  };

  const handleSave = () => {
    onSave(editingItem);
  };

  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        size="sm"
        onClick={onCancel}
      >
        Zurück zur Übersicht
      </Button>
      
      <div className="space-y-4 p-4 border rounded-md">
        <h3 className="text-lg font-medium">Element bearbeiten</h3>
        
        <div className="space-y-2">
          <Label htmlFor="item-name">Name</Label>
          <Input 
            id="item-name" 
            value={editingItem.name} 
            onChange={(e) => handleItemUpdate({
              name: e.target.value
            })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="item-description">Beschreibung</Label>
          <Textarea 
            id="item-description" 
            value={editingItem.description || ''} 
            onChange={(e) => handleItemUpdate({
              description: e.target.value
            })}
          />
        </div>
        
        <Tabs defaultValue="images" className="w-full">
          <TabsList>
            <TabsTrigger value="images">Bilder</TabsTrigger>
            <TabsTrigger value="custom-fields">Benutzerdefinierte Felder</TabsTrigger>
            {children && <TabsTrigger value="additional">Weitere Details</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="images" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>{coverImageLabel}</Label>
                <ImageUploader 
                  imageUrl={editingItem.cover_image_url} 
                  onImageChange={(url) => handleItemUpdate({
                    cover_image_url: url
                  })}
                  disableToast={true}
                />
              </div>
              <div>
                <Label>{symbolImageLabel}</Label>
                <ImageUploader 
                  imageUrl={editingItem.symbol_image_url} 
                  onImageChange={(url) => handleItemUpdate({
                    symbol_image_url: url
                  })}
                  disableToast={true}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="custom-fields" className="pt-4">
            <CustomFieldsEditor
              customFields={editingItem.customFields || []}
              onChange={(customFields) => handleItemUpdate({
                customFields
              })}
            />
          </TabsContent>
          
          {children && (
            <TabsContent value="additional" className="pt-4">
              {children}
            </TabsContent>
          )}
        </Tabs>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onCancel}>Abbrechen</Button>
          <Button 
            onClick={handleSave}
            className="bg-anime-purple hover:bg-anime-dark-purple"
          >
            Speichern
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ItemEditor;
