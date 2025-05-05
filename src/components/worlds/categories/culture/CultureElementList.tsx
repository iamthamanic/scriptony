
import React from 'react';
import { Button } from '@/components/ui/button';
import { CultureElement } from '@/types/worlds';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Pencil, Trash2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface CultureElementListProps {
  elements: CultureElement[];
  expandedElementId: string | null;
  onToggleExpand: (elementId: string) => void;
  onEditElement: (element: CultureElement) => void;
  onDeleteElement: (elementId: string) => void;
}

const CultureElementList: React.FC<CultureElementListProps> = ({
  elements,
  expandedElementId,
  onToggleExpand,
  onEditElement,
  onDeleteElement
}) => {
  // Helper to get element type display name
  const getElementTypeDisplay = (type?: string) => {
    switch(type) {
      case 'art': return 'Kunst';
      case 'tradition': return 'Tradition';
      case 'festival': return 'Fest/Feier';
      case 'belief': return 'Glaube';
      default: return 'Sonstige';
    }
  };
  
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
  
  return (
    <div className="space-y-3">
      {elements.map(element => (
        <Card key={element.id} className="overflow-hidden">
          <CardHeader className="p-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onToggleExpand(element.id)}
                  className="p-1 h-auto"
                >
                  {expandedElementId === element.id ? 
                    <ChevronUp className="h-4 w-4" /> : 
                    <ChevronDown className="h-4 w-4" />
                  }
                </Button>
                <span className="font-medium">{element.name}</span>
                
                {element.element_type && (
                  <Badge variant={getBadgeVariant(element.element_type)} className="ml-2">
                    {getElementTypeDisplay(element.element_type)}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onEditElement(element)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onDeleteElement(element.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          {expandedElementId === element.id && (
            <CardContent className="px-3 pb-3 pt-0">
              {element.description && (
                <p className="text-sm mb-2">{element.description}</p>
              )}
              
              {element.customFields && element.customFields.length > 0 && (
                <div className="mt-2">
                  <h4 className="text-sm font-medium">Eigenschaften:</h4>
                  <div className="grid grid-cols-2 gap-1 mt-1">
                    {element.customFields.map(field => (
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
                  onClick={() => onEditElement(element)}
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

export default CultureElementList;
