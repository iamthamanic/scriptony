
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WorldCategoryType } from '@/types';

interface TypeSelectorProps {
  value: WorldCategoryType;
  onValueChange: (value: string) => void;
  categoryTypes: Array<{ value: string; label: string }>;
}

const TypeSelector: React.FC<TypeSelectorProps> = ({ value, onValueChange, categoryTypes }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="type">Typ</Label>
      <Select
        value={value}
        onValueChange={onValueChange}
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
  );
};

export default TypeSelector;
