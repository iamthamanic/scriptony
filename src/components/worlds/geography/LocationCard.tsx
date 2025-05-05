
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { Location } from '@/types/worlds';

interface LocationCardProps {
  location: Location;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const LocationCard: React.FC<LocationCardProps> = ({
  location,
  isExpanded,
  onToggleExpand,
  onEdit,
  onDelete
}) => {
  return (
    <Card key={location.id} className="overflow-hidden">
      <CardHeader className="py-2 px-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            {location.name}
          </CardTitle>
          
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onEdit}
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Bearbeiten</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Löschen</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onToggleExpand}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              <span className="sr-only">Erweitern</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-2 px-4 pb-4">
          <div className="space-y-4">
            {location.description && (
              <div>
                <p className="text-sm text-muted-foreground">{location.description}</p>
              </div>
            )}
            
            {location.cover_image_url && (
              <div>
                <img 
                  src={location.cover_image_url} 
                  alt={location.name} 
                  className="h-32 w-full object-cover rounded-md" 
                />
              </div>
            )}
            
            {location.customFields && location.customFields.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-1">Eigenschaften</h4>
                <div className="grid grid-cols-2 gap-2">
                  {location.customFields.map((field) => (
                    <div key={field.id} className="text-sm">
                      <span className="font-medium">{field.name}: </span>
                      <span className="text-muted-foreground">{field.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onEdit}
              >
                <Edit className="h-4 w-4 mr-2" /> Bearbeiten
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default LocationCard;
