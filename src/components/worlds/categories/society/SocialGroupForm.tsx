
import React, { useState } from 'react';
import { SocialGroup } from '@/types/worlds';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import ItemEditor from '../../common/ItemEditor';

interface SocialGroupFormProps {
  group: SocialGroup;
  onCancel: () => void;
  onSave: (group: SocialGroup) => void;
}

const SocialGroupForm: React.FC<SocialGroupFormProps> = ({
  group,
  onCancel,
  onSave
}) => {
  const [editingGroup, setEditingGroup] = useState<SocialGroup>({...group});
  const [newCharacteristic, setNewCharacteristic] = useState('');
  
  const handleAddCharacteristic = () => {
    if (!newCharacteristic.trim()) return;
    
    setEditingGroup({
      ...editingGroup,
      characteristics: [
        ...(editingGroup.characteristics || []),
        newCharacteristic.trim()
      ]
    });
    
    setNewCharacteristic('');
  };
  
  const handleRemoveCharacteristic = (index: number) => {
    setEditingGroup({
      ...editingGroup,
      characteristics: (editingGroup.characteristics || []).filter((_, i) => i !== index)
    });
  };
  
  const additionalContent = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="population">Bevölkerungsgröße</Label>
        <Input
          id="population"
          value={editingGroup.population || ''}
          onChange={(e) => setEditingGroup({
            ...editingGroup,
            population: e.target.value
          })}
          placeholder="z.B. 10.000.000 oder 25% der Weltbevölkerung"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Merkmale</Label>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {(editingGroup.characteristics || []).map((characteristic, index) => (
            <div 
              key={index}
              className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full"
            >
              <span className="text-sm">{characteristic}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-5 w-5 p-0"
                onClick={() => handleRemoveCharacteristic(index)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Input
            placeholder="Neues Merkmal"
            value={newCharacteristic}
            onChange={(e) => setNewCharacteristic(e.target.value)}
            className="flex-1"
          />
          <Button 
            variant="outline" 
            onClick={handleAddCharacteristic}
            disabled={!newCharacteristic.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
  
  return (
    <ItemEditor
      item={editingGroup}
      onCancel={onCancel}
      onSave={onSave}
      coverImageLabel="Titelbild"
      symbolImageLabel="Symbol/Flagge"
    >
      {additionalContent}
    </ItemEditor>
  );
};

export default SocialGroupForm;
