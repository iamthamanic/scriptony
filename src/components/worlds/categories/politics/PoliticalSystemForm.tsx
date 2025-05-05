
import React from 'react';
import { PoliticalSystem, Leader } from '@/types/worlds';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2 } from 'lucide-react';
import ItemEditor from '../../common/ItemEditor';

interface PoliticalSystemFormProps {
  system: PoliticalSystem;
  onCancel: () => void;
  onSave: (system: PoliticalSystem) => void;
}

const PoliticalSystemForm: React.FC<PoliticalSystemFormProps> = ({
  system,
  onCancel,
  onSave
}) => {
  const [editingSystem, setEditingSystem] = React.useState<PoliticalSystem>({...system});
  
  const handleAddLeader = () => {
    const newLeader: Leader = {
      id: uuidv4(),
      name: 'Neue Führungsperson',
      title: 'Titel',
      description: ''
    };
    
    setEditingSystem({
      ...editingSystem,
      leaders: [...(editingSystem.leaders || []), newLeader]
    });
  };
  
  const handleUpdateLeader = (id: string, updates: Partial<Leader>) => {
    setEditingSystem({
      ...editingSystem,
      leaders: (editingSystem.leaders || []).map(leader => 
        leader.id === id ? { ...leader, ...updates } : leader
      )
    });
  };
  
  const handleDeleteLeader = (id: string) => {
    setEditingSystem({
      ...editingSystem,
      leaders: (editingSystem.leaders || []).filter(leader => leader.id !== id)
    });
  };
  
  const additionalContent = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="government-type">Regierungsform</Label>
        <Input
          id="government-type"
          value={editingSystem.government_type || ''}
          onChange={(e) => setEditingSystem({
            ...editingSystem,
            government_type: e.target.value
          })}
          placeholder="z.B. Monarchie, Demokratie, etc."
        />
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label>Führungspersonen</Label>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAddLeader}
          >
            <Plus className="h-4 w-4 mr-1" /> Hinzufügen
          </Button>
        </div>
        
        {editingSystem.leaders && editingSystem.leaders.length > 0 ? (
          <div className="space-y-3">
            {editingSystem.leaders.map(leader => (
              <div key={leader.id} className="border rounded-md p-3 space-y-2">
                <div className="flex justify-between">
                  <h4 className="font-medium text-sm">{leader.name}</h4>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDeleteLeader(leader.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor={`leader-name-${leader.id}`} className="text-xs">Name</Label>
                    <Input
                      id={`leader-name-${leader.id}`}
                      value={leader.name}
                      onChange={(e) => handleUpdateLeader(leader.id, { name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`leader-title-${leader.id}`} className="text-xs">Titel</Label>
                    <Input
                      id={`leader-title-${leader.id}`}
                      value={leader.title}
                      onChange={(e) => handleUpdateLeader(leader.id, { title: e.target.value })}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor={`leader-desc-${leader.id}`} className="text-xs">Beschreibung</Label>
                  <Input
                    id={`leader-desc-${leader.id}`}
                    value={leader.description || ''}
                    onChange={(e) => handleUpdateLeader(leader.id, { description: e.target.value })}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-sm text-muted-foreground border border-dashed rounded-md">
            Keine Führungspersonen vorhanden
          </div>
        )}
      </div>
    </div>
  );
  
  return (
    <ItemEditor
      item={editingSystem}
      onCancel={onCancel}
      onSave={onSave}
      coverImageLabel="Titelbild"
      symbolImageLabel="Wappen/Symbol"
    >
      {additionalContent}
    </ItemEditor>
  );
};

export default PoliticalSystemForm;
