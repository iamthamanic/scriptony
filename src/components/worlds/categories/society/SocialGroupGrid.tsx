
import React from 'react';
import { SocialGroup } from "@/types/worlds";
import { Card, CardContent } from "@/components/ui/card";

interface SocialGroupGridProps {
  groups: SocialGroup[];
}

const SocialGroupGrid: React.FC<SocialGroupGridProps> = ({ groups }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {groups.map(group => (
        <Card key={group.id} className="overflow-hidden">
          <div 
            className="h-32 bg-muted bg-cover bg-center" 
            style={{ backgroundImage: group.cover_image_url ? `url(${group.cover_image_url})` : undefined }}
          />
          <CardContent className="p-4">
            <div className="flex items-start">
              {group.symbol_image_url && (
                <div className="mr-3 mt-1">
                  <img 
                    src={group.symbol_image_url} 
                    alt={`${group.name} Symbol`} 
                    className="w-10 h-10 object-contain"
                  />
                </div>
              )}
              <div>
                <h3 className="text-lg font-medium">{group.name}</h3>
                {group.population && (
                  <p className="text-sm text-muted-foreground">Bevölkerung: {group.population}</p>
                )}
                {group.description && (
                  <p className="text-sm mt-2 line-clamp-3">{group.description}</p>
                )}
              </div>
            </div>
            
            {group.characteristics && group.characteristics.length > 0 && (
              <div className="mt-3 pt-2">
                <h4 className="text-xs font-medium text-muted-foreground mb-1">Merkmale</h4>
                <div className="flex flex-wrap gap-1">
                  {group.characteristics.map((characteristic, index) => (
                    <span 
                      key={index}
                      className="inline-block px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full"
                    >
                      {characteristic}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {group.customFields && group.customFields.length > 0 && (
              <div className="mt-3 border-t pt-3">
                <h4 className="text-xs font-medium text-muted-foreground mb-1">Details</h4>
                <dl className="text-sm">
                  {group.customFields.slice(0, 3).map(field => (
                    <div key={field.id} className="flex justify-between mb-1">
                      <dt className="font-medium">{field.name}:</dt>
                      <dd className="text-right">{field.value}</dd>
                    </div>
                  ))}
                  {group.customFields.length > 3 && (
                    <p className="text-xs text-muted-foreground text-right">
                      +{group.customFields.length - 3} weitere
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

export default SocialGroupGrid;
