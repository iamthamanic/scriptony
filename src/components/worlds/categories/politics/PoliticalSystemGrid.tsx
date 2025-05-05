
import React from 'react';
import { PoliticalSystem } from "@/types/worlds";
import { Card, CardContent } from "@/components/ui/card";

interface PoliticalSystemGridProps {
  systems: PoliticalSystem[];
}

const PoliticalSystemGrid: React.FC<PoliticalSystemGridProps> = ({ systems }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {systems.map(system => (
        <Card key={system.id} className="overflow-hidden">
          <div 
            className="h-32 bg-muted bg-cover bg-center" 
            style={{ backgroundImage: system.cover_image_url ? `url(${system.cover_image_url})` : undefined }}
          />
          <CardContent className="p-4">
            <div className="flex items-start">
              {system.symbol_image_url && (
                <div className="mr-3 mt-1">
                  <img 
                    src={system.symbol_image_url} 
                    alt={`${system.name} Symbol`} 
                    className="w-10 h-10 object-contain"
                  />
                </div>
              )}
              <div>
                <h3 className="text-lg font-medium">{system.name}</h3>
                {system.government_type && (
                  <p className="text-sm text-muted-foreground">{system.government_type}</p>
                )}
                {system.description && (
                  <p className="text-sm mt-2 line-clamp-3">{system.description}</p>
                )}
              </div>
            </div>
            
            {system.customFields && system.customFields.length > 0 && (
              <div className="mt-3 border-t pt-3">
                <h4 className="text-xs font-medium text-muted-foreground mb-1">Details</h4>
                <dl className="text-sm">
                  {system.customFields.slice(0, 3).map(field => (
                    <div key={field.id} className="flex justify-between mb-1">
                      <dt className="font-medium">{field.name}:</dt>
                      <dd className="text-right">{field.value}</dd>
                    </div>
                  ))}
                  {system.customFields.length > 3 && (
                    <p className="text-xs text-muted-foreground text-right">
                      +{system.customFields.length - 3} weitere
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

export default PoliticalSystemGrid;
