
import React from 'react';
import { EconomicEntity } from '@/types/worlds';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ItemEditor from '../../common/ItemEditor';

interface EconomicEntityFormProps {
  entity: EconomicEntity;
  onCancel: () => void;
  onSave: (entity: EconomicEntity) => void;
}

const EconomicEntityForm: React.FC<EconomicEntityFormProps> = ({
  entity,
  onCancel,
  onSave
}) => {
  const [editingEntity, setEditingEntity] = React.useState<EconomicEntity>({...entity});
  
  const additionalContent = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="entity-type">Typ</Label>
        <Select
          value={editingEntity.entity_type}
          onValueChange={(value: any) => setEditingEntity({
            ...editingEntity,
            entity_type: value
          })}
        >
          <SelectTrigger id="entity-type">
            <SelectValue placeholder="Typ auswählen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="currency">Währung</SelectItem>
            <SelectItem value="resource">Ressource</SelectItem>
            <SelectItem value="organization">Organisation</SelectItem>
            <SelectItem value="system">Wirtschaftssystem</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="entity-value">Wert/Bedeutung</Label>
        <Input
          id="entity-value"
          value={editingEntity.value || ''}
          onChange={(e) => setEditingEntity({
            ...editingEntity,
            value: e.target.value
          })}
          placeholder="z.B. Umtauschkurs, Vorkommen, etc."
        />
      </div>
    </div>
  );
  
  return (
    <ItemEditor
      item={editingEntity}
      onCancel={onCancel}
      onSave={onSave}
      coverImageLabel="Titelbild"
      symbolImageLabel="Symbol/Logo"
    >
      {additionalContent}
    </ItemEditor>
  );
};

export default EconomicEntityForm;
