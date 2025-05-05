
import React from 'react';
import { Button } from '@/components/ui/button';
import { EconomicEntity } from '@/types/worlds';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Pencil, Trash2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface EconomicEntityListProps {
  entities: EconomicEntity[];
  expandedEntityId: string | null;
  onToggleExpand: (entityId: string) => void;
  onEditEntity: (entity: EconomicEntity) => void;
  onDeleteEntity: (entityId: string) => void;
}

const EconomicEntityList: React.FC<EconomicEntityListProps> = ({
  entities,
  expandedEntityId,
  onToggleExpand,
  onEditEntity,
  onDeleteEntity
}) => {
  // Helper to get entity type display name
  const getEntityTypeDisplay = (type?: string) => {
    switch(type) {
      case 'currency': return 'Währung';
      case 'resource': return 'Ressource';
      case 'organization': return 'Organisation';
      case 'system': return 'System';
      default: return 'Sonstige';
    }
  };
  
  return (
    <div className="space-y-3">
      {entities.map(entity => (
        <Card key={entity.id} className="overflow-hidden">
          <CardHeader className="p-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onToggleExpand(entity.id)}
                  className="p-1 h-auto"
                >
                  {expandedEntityId === entity.id ? 
                    <ChevronUp className="h-4 w-4" /> : 
                    <ChevronDown className="h-4 w-4" />
                  }
                </Button>
                <span className="font-medium">{entity.name}</span>
                
                {entity.entity_type && (
                  <Badge variant="outline" className="ml-2">
                    {getEntityTypeDisplay(entity.entity_type)}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onEditEntity(entity)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onDeleteEntity(entity.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          {expandedEntityId === entity.id && (
            <CardContent className="px-3 pb-3 pt-0">
              {entity.value && (
                <div className="mb-2">
                  <span className="text-sm font-medium">Wert: </span>
                  <span className="text-sm">{entity.value}</span>
                </div>
              )}
              
              {entity.description && (
                <p className="text-sm mb-2">{entity.description}</p>
              )}
              
              {entity.customFields && entity.customFields.length > 0 && (
                <div className="mt-2">
                  <h4 className="text-sm font-medium">Eigenschaften:</h4>
                  <div className="grid grid-cols-2 gap-1 mt-1">
                    {entity.customFields.map(field => (
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
                  onClick={() => onEditEntity(entity)}
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

export default EconomicEntityList;
