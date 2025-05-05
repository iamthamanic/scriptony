
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Plus, Trash2, PlusCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { CustomField, FieldType, FieldOption, createCustomField } from '@/types/worlds';
import { v4 as uuidv4 } from 'uuid';

interface EnhancedCustomFieldsEditorProps {
  customFields: CustomField[];
  onChange: (fields: CustomField[]) => void;
}

const EnhancedCustomFieldsEditor: React.FC<EnhancedCustomFieldsEditorProps> = ({ customFields, onChange }) => {
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState<FieldType>(FieldType.TEXT);
  const [newFieldValue, setNewFieldValue] = useState('');
  const [editingOptionsForFieldId, setEditingOptionsForFieldId] = useState<string | null>(null);
  const [newOptionLabel, setNewOptionLabel] = useState('');

  const handleAddField = () => {
    if (!newFieldName.trim()) return;
    
    const newField = createCustomField(newFieldName, newFieldType, newFieldValue);
    
    if (newFieldType === FieldType.DROPDOWN) {
      newField.options = [];
    }
    
    onChange([...customFields, newField]);
    setNewFieldName('');
    setNewFieldValue('');
    setNewFieldType(FieldType.TEXT);
  };

  const handleUpdateField = (id: string, key: keyof CustomField, value: any) => {
    const updatedFields = customFields.map(field => {
      if (field.id === id) {
        const updatedField = { ...field, [key]: value };
        
        // If changing from dropdown to another type, remove options
        if (key === 'type' && value !== FieldType.DROPDOWN) {
          delete updatedField.options;
        }
        
        // If changing to dropdown, initialize empty options array
        if (key === 'type' && value === FieldType.DROPDOWN) {
          updatedField.options = updatedField.options || [];
        }
        
        return updatedField;
      }
      return field;
    });
    
    onChange(updatedFields);
  };

  const handleDeleteField = (id: string) => {
    const updatedFields = customFields.filter(field => field.id !== id);
    onChange(updatedFields);
  };

  const handleAddOption = (fieldId: string) => {
    if (!newOptionLabel.trim()) return;
    
    const updatedFields = customFields.map(field => {
      if (field.id === fieldId) {
        const newOption: FieldOption = {
          id: uuidv4(),
          label: newOptionLabel,
          value: newOptionLabel.toLowerCase().replace(/\s+/g, '_')
        };
        
        const options = field.options || [];
        return {
          ...field,
          options: [...options, newOption]
        };
      }
      return field;
    });
    
    onChange(updatedFields);
    setNewOptionLabel('');
  };

  const handleDeleteOption = (fieldId: string, optionId: string) => {
    const updatedFields = customFields.map(field => {
      if (field.id === fieldId && field.options) {
        return {
          ...field,
          options: field.options.filter(option => option.id !== optionId)
        };
      }
      return field;
    });
    
    onChange(updatedFields);
  };

  const renderFieldValueInput = (field: CustomField) => {
    switch (field.type) {
      case FieldType.TEXT:
        return (
          <Input
            placeholder="Textwert"
            value={field.value}
            onChange={(e) => handleUpdateField(field.id, 'value', e.target.value)}
          />
        );
        
      case FieldType.NUMBER:
        return (
          <Input
            type="number"
            placeholder="0"
            value={field.value}
            onChange={(e) => handleUpdateField(field.id, 'value', e.target.value)}
          />
        );
        
      case FieldType.DATE:
        return (
          <Input
            type="date"
            value={field.value}
            onChange={(e) => handleUpdateField(field.id, 'value', e.target.value)}
          />
        );
        
      case FieldType.DROPDOWN:
        return (
          <div className="space-y-2">
            <Select 
              value={field.value} 
              onValueChange={(value) => handleUpdateField(field.id, 'value', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Option auswählen" />
              </SelectTrigger>
              <SelectContent>
                {field.options && field.options.map(option => (
                  <SelectItem key={option.id} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setEditingOptionsForFieldId(
                editingOptionsForFieldId === field.id ? null : field.id
              )}
            >
              {editingOptionsForFieldId === field.id ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" /> Optionen ausblenden
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" /> Optionen bearbeiten
                </>
              )}
            </Button>
            
            {editingOptionsForFieldId === field.id && (
              <div className="border rounded-md p-3 space-y-2 mt-2">
                <Label className="text-xs">Optionen</Label>
                
                {field.options && field.options.length > 0 ? (
                  <div className="space-y-2 mb-3">
                    {field.options.map(option => (
                      <div key={option.id} className="flex items-center gap-2">
                        <Input 
                          value={option.label} 
                          onChange={(e) => {
                            const updatedFields = customFields.map(f => {
                              if (f.id === field.id && f.options) {
                                return {
                                  ...f,
                                  options: f.options.map(o => 
                                    o.id === option.id 
                                      ? { ...o, label: e.target.value, value: e.target.value.toLowerCase().replace(/\s+/g, '_') }
                                      : o
                                  )
                                };
                              }
                              return f;
                            });
                            onChange(updatedFields);
                          }}
                          className="flex-1" 
                        />
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteOption(field.id, option.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Keine Optionen vorhanden</p>
                )}
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Neue Option"
                    value={newOptionLabel}
                    onChange={(e) => setNewOptionLabel(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddOption(field.id)}
                    disabled={!newOptionLabel.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
        
      default:
        return (
          <Input
            placeholder="Wert"
            value={field.value}
            onChange={(e) => handleUpdateField(field.id, 'value', e.target.value)}
          />
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>Benutzerdefinierte Felder</Label>
      </div>
      
      <div className="space-y-3">
        {customFields.map(field => (
          <div key={field.id} className="space-y-2 border p-3 rounded-md">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium">{field.name}</Label>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleDeleteField(field.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-start">
              <div>
                <Label htmlFor={`field-name-${field.id}`} className="text-xs mb-1">Feldname</Label>
                <Input
                  id={`field-name-${field.id}`}
                  value={field.name}
                  onChange={(e) => handleUpdateField(field.id, 'name', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor={`field-type-${field.id}`} className="text-xs mb-1">Feldtyp</Label>
                <Select 
                  value={field.type} 
                  onValueChange={(value) => handleUpdateField(field.id, 'type', value)}
                >
                  <SelectTrigger id={`field-type-${field.id}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={FieldType.TEXT}>Text</SelectItem>
                    <SelectItem value={FieldType.NUMBER}>Zahl</SelectItem>
                    <SelectItem value={FieldType.DATE}>Datum</SelectItem>
                    <SelectItem value={FieldType.DROPDOWN}>Auswahl</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor={`field-value-${field.id}`} className="text-xs mb-1">Wert</Label>
                {renderFieldValueInput(field)}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end border-t pt-3">
        <div>
          <Label htmlFor="new-field-name" className="text-xs mb-1">Neues Feld (Name)</Label>
          <Input
            id="new-field-name"
            placeholder="z.B. Einwohnerzahl"
            value={newFieldName}
            onChange={(e) => setNewFieldName(e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="new-field-type" className="text-xs mb-1">Feldtyp</Label>
          <Select value={newFieldType} onValueChange={(value) => setNewFieldType(value as FieldType)}>
            <SelectTrigger id="new-field-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={FieldType.TEXT}>Text</SelectItem>
              <SelectItem value={FieldType.NUMBER}>Zahl</SelectItem>
              <SelectItem value={FieldType.DATE}>Datum</SelectItem>
              <SelectItem value={FieldType.DROPDOWN}>Auswahl</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={handleAddField}
            disabled={!newFieldName.trim()}
          >
            <PlusCircle className="h-4 w-4 mr-1" /> Feld hinzufügen
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedCustomFieldsEditor;
