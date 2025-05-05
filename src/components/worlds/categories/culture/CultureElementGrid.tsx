
import React from 'react';
import { CultureElement } from "@/types/worlds";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CultureElementGridProps {
  elements: CultureElement[];
}

const CultureElementGrid: React.FC<CultureElementGridProps> = ({ elements }) => {
  // Helper to get badge variant based on element type
  const getBadgeVariant = (type?: string) => {
    switch(type) {
      case 'art': return 'default';
      case 'tradition': return 'outline';
      case 'festival': return 'secondary';
      case 'belief': return 'destructive';
      default: return 'outline';
    }
  };
  
  // Helper to get display name for element type
  const getElementTypeDisplay = (type?: string) => {
    switch(type) {
      case 'art': return 'Kunst';
      case 'tradition': return 'Tradition';
      case 'festival': return 'Fest/Feier';
      case 'belief': return 'Glaube';
      default: return 'Sonstige';
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {elements.map(element => (
        <Card key={element.id} className="overflow-hidden">
          <div 
            className="h-32 bg-muted bg-cover bg-center" 
            style={{ backgroundImage: element.cover_image_url ? `url(${element.cover_image_url})` : undefined }}
          />
          <CardContent className="p-4">
            <div className="flex items-start">
              {element.symbol_image_url && (
                <div className="mr-3 mt-1">
                  <img 
                    src={element.symbol_image_url} 
                    alt={`${element.name} Symbol`} 
                    className="w-10 h-10 object-contain"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium">{element.name}</h3>
                  {element.element_type && (
                    <Badge variant={getBadgeVariant(element.element_type)}>
                      {getElementTypeDisplay(element.element_type)}
                    </Badge>
                  )}
                </div>
                {element.description && (
                  <p className="text-sm mt-2 line-clamp-3">{element.description}</p>
                )}
              </div>
            </div>
            
            {element.customFields && element.customFields.length > 0 && (
              <div className="mt-3 border-t pt-3">
                <h4 className="text-xs font-medium text-muted-foreground mb-1">Details</h4>
                <dl className="text-sm">
                  {element.customFields.slice(0, 3).map(field => (
                    <div key={field.id} className="flex justify-between mb-1">
                      <dt className="font-medium">{field.name}:</dt>
                      <dd className="text-right">{field.value}</dd>
                    </div>
                  ))}
                  {element.customFields.length > 3 && (
                    <p className="text-xs text-muted-foreground text-right">
                      +{element.customFields.length - 3} weitere
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

export default CultureElementGrid;
