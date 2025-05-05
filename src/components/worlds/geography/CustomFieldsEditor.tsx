
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { CustomField, FieldType } from '@/types/worlds';
import { v4 as uuidv4 } from 'uuid';

interface CustomFieldsEditorProps {
  customFields: CustomField[];
  onChange: (fields: CustomField[]) => void;
}

const CustomFieldsEditor: React.FC<CustomFieldsEditorProps> = ({ customFields, onChange }) => {
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldValue, setNewFieldValue] = useState('');

  const handleAddField = () => {
    if (!newFieldName.trim()) return;
    
    const newField: CustomField = {
      id: uuidv4(),
      name: newFieldName,
      value: newFieldValue,
      type: FieldType.TEXT // Default to TEXT type
    };
    
    onChange([...customFields, newField]);
    setNewFieldName('');
    setNewFieldValue('');
  };

  const handleUpdateField = (id: string, key: 'name' | 'value', value: string) => {
    const updatedFields = customFields.map(field => 
      field.id === id ? { ...field, [key]: value } : field
    );
    onChange(updatedFields);
  };

  const handleDeleteField = (id: string) => {
    const updatedFields = customFields.filter(field => field.id !== id);
    onChange(updatedFields);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>Benutzerdefinierte Felder</Label>
      </div>
      
      <div className="space-y-3">
        {customFields.map(field => (
          <div key={field.id} className="grid grid-cols-5 gap-2 items-center">
            <div className="col-span-2">
              <Input
                placeholder="Name"
                value={field.name}
                onChange={(e) => handleUpdateField(field.id, 'name', e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <Input
                placeholder="Wert"
                value={field.value}
                onChange={(e) => handleUpdateField(field.id, 'value', e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleDeleteField(field.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-5 gap-2 items-end border-t pt-3">
        <div className="col-span-2">
          <Label htmlFor="new-field-name" className="text-xs mb-1">Neues Feld (Name)</Label>
          <Input
            id="new-field-name"
            placeholder="z.B. Einwohnerzahl"
            value={newFieldName}
            onChange={(e) => setNewFieldName(e.target.value)}
          />
        </div>
        <div className="col-span-2">
          <Label htmlFor="new-field-value" className="text-xs mb-1">Wert</Label>
          <Input
            id="new-field-value"
            placeholder="z.B. 10.000.000"
            value={newFieldValue}
            onChange={(e) => setNewFieldValue(e.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAddField}
            disabled={!newFieldName.trim()}
          >
            <Plus className="h-4 w-4 mr-1" /> Hinzufügen
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomFieldsEditor;
