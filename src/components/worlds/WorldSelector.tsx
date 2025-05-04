
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { World } from "@/types";
import { Plus, Globe } from 'lucide-react';

interface WorldSelectorProps {
  worlds: World[];
  selectedWorldId?: string | null;
  onSelectWorld: (worldId: string | null) => void;
  onCreateWorld: () => void;
}

const WorldSelector = ({ worlds, selectedWorldId, onSelectWorld, onCreateWorld }: WorldSelectorProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-grow">
        <Select
          value={selectedWorldId || ''}
          onValueChange={(value) => onSelectWorld(value === '' ? null : value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Keine Welt verknüpft" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Keine Welt verknüpfen</SelectItem>
            {worlds.map(world => (
              <SelectItem key={world.id} value={world.id}>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  {world.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Button variant="outline" size="icon" onClick={onCreateWorld}>
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default WorldSelector;
