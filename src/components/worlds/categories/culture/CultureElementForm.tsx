
import React from 'react';
import { CultureElement } from '@/types/worlds';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ItemEditor from '../../common/ItemEditor';

interface CultureElementFormProps {
  element: CultureElement;
  onCancel: () => void;
  onSave: (element: CultureElement) => void;
}

const CultureElementForm: React.FC<CultureElementFormProps> = ({
  element,
  onCancel,
  onSave
}) => {
  const [editingElement, setEditingElement] = React.useState<CultureElement>({...element});
  
  const additionalContent = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="element-type">Typ</Label>
        <Select
          value={editingElement.element_type}
          onValueChange={(value: any) => setEditingElement({
            ...editingElement,
            element_type: value
          })}
        >
          <SelectTrigger id="element-type">
            <SelectValue placeholder="Typ auswählen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="art">Kunst</SelectItem>
            <SelectItem value="tradition">Tradition</SelectItem>
            <SelectItem value="festival">Fest/Feier</SelectItem>
            <SelectItem value="belief">Glaube/Religion</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
  
  return (
    <ItemEditor
      item={editingElement}
      onCancel={onCancel}
      onSave={onSave}
      coverImageLabel="Titelbild"
      symbolImageLabel="Symbol/Emblem"
    >
      {additionalContent}
    </ItemEditor>
  );
};

export default CultureElementForm;
