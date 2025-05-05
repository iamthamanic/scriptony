
import React from 'react';
import { Button } from '@/components/ui/button';
import { PoliticalSystem } from '@/types/worlds';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Pencil, Trash2 } from 'lucide-react';

interface PoliticalSystemListProps {
  systems: PoliticalSystem[];
  expandedSystemId: string | null;
  onToggleExpand: (systemId: string) => void;
  onEditSystem: (system: PoliticalSystem) => void;
  onDeleteSystem: (systemId: string) => void;
}

const PoliticalSystemList: React.FC<PoliticalSystemListProps> = ({
  systems,
  expandedSystemId,
  onToggleExpand,
  onEditSystem,
  onDeleteSystem
}) => {
  return (
    <div className="space-y-3">
      {systems.map(system => (
        <Card key={system.id} className="overflow-hidden">
          <CardHeader className="p-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onToggleExpand(system.id)}
                  className="p-1 h-auto"
                >
                  {expandedSystemId === system.id ? 
                    <ChevronUp className="h-4 w-4" /> : 
                    <ChevronDown className="h-4 w-4" />
                  }
                </Button>
                <span className="font-medium">{system.name}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onEditSystem(system)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onDeleteSystem(system.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          {expandedSystemId === system.id && (
            <CardContent className="px-3 pb-3 pt-0">
              {system.government_type && (
                <div className="mb-2">
                  <span className="text-sm font-medium">Regierungsform: </span>
                  <span className="text-sm">{system.government_type}</span>
                </div>
              )}
              
              {system.description && (
                <p className="text-sm mb-2">{system.description}</p>
              )}
              
              {system.customFields && system.customFields.length > 0 && (
                <div className="mt-2">
                  <h4 className="text-sm font-medium">Eigenschaften:</h4>
                  <div className="grid grid-cols-2 gap-1 mt-1">
                    {system.customFields.map(field => (
                      <div key={field.id} className="text-xs">
                        <span className="font-medium">{field.name}:</span> {field.value}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end mt-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEditSystem(system)}
                >
                  <Pencil className="h-3 w-3 mr-1" /> Bearbeiten
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
};

export default PoliticalSystemList;
