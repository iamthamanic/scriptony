
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface CategoryNameFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CategoryNameField: React.FC<CategoryNameFieldProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="name">Name</Label>
      <Input
        id="name"
        name="name"
        value={value}
        onChange={onChange}
        placeholder="z.B. Geografie"
        required
      />
    </div>
  );
};

export default CategoryNameField;
