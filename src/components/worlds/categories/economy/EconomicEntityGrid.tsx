
import React from 'react';
import { EconomicEntity } from "@/types/worlds";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EconomicEntityGridProps {
  entities: EconomicEntity[];
}

const EconomicEntityGrid: React.FC<EconomicEntityGridProps> = ({ entities }) => {
  // Helper to get badge variant based on entity type
  const getBadgeVariant = (type?: string) => {
    switch(type) {
      case 'currency': return 'default';
      case 'resource': return 'outline';
      case 'organization': return 'secondary';
      case 'system': return 'destructive';
      default: return 'outline';
    }
  };
  
  // Helper to get display name for entity type
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {entities.map(entity => (
        <Card key={entity.id} className="overflow-hidden">
          <div 
            className="h-32 bg-muted bg-cover bg-center" 
            style={{ backgroundImage: entity.cover_image_url ? `url(${entity.cover_image_url})` : undefined }}
          />
          <CardContent className="p-4">
            <div className="flex items-start">
              {entity.symbol_image_url && (
                <div className="mr-3 mt-1">
                  <img 
                    src={entity.symbol_image_url} 
                    alt={`${entity.name} Symbol`} 
                    className="w-10 h-10 object-contain"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium">{entity.name}</h3>
                  {entity.entity_type && (
                    <Badge variant={getBadgeVariant(entity.entity_type)}>
                      {getEntityTypeDisplay(entity.entity_type)}
                    </Badge>
                  )}
                </div>
                {entity.description && (
                  <p className="text-sm mt-2 line-clamp-3">{entity.description}</p>
                )}
              </div>
            </div>
            
            {entity.customFields && entity.customFields.length > 0 && (
              <div className="mt-3 border-t pt-3">
                <h4 className="text-xs font-medium text-muted-foreground mb-1">Details</h4>
                <dl className="text-sm">
                  {entity.customFields.slice(0, 3).map(field => (
                    <div key={field.id} className="flex justify-between mb-1">
                      <dt className="font-medium">{field.name}:</dt>
                      <dd className="text-right">{field.value}</dd>
                    </div>
                  ))}
                  {entity.customFields.length > 3 && (
                    <p className="text-xs text-muted-foreground text-right">
                      +{entity.customFields.length - 3} weitere
                    </p>
                  )}
                </dl>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EconomicEntityGrid;
