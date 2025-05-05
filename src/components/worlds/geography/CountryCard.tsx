
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { Country } from '@/types/worlds';

interface CountryCardProps {
  country: Country;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const CountryCard: React.FC<CountryCardProps> = ({
  country,
  isExpanded,
  onToggleExpand,
  onEdit,
  onDelete
}) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="py-2 px-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base flex items-center gap-2">
            {country.flag_url && (
              <img 
                src={country.flag_url} 
                alt="Flagge" 
                className="h-6 w-6 object-cover rounded"
              />
            )}
            {country.name}
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
            {country.description && (
              <div>
                <p className="text-sm text-muted-foreground">{country.description}</p>
              </div>
            )}
            
            {country.customFields && country.customFields.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-1">Eigenschaften</h4>
                <div className="grid grid-cols-2 gap-2">
                  {country.customFields.map((field) => (
                    <div key={field.id} className="text-sm">
                      <span className="font-medium">{field.name}: </span>
                      <span className="text-muted-foreground">{field.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {country.locations && country.locations.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-1">Orte ({country.locations.length})</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {country.locations.map((location) => (
                    <div key={location.id} className="text-sm p-2 bg-muted/50 rounded">
                      {location.name}
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

export default CountryCard;
