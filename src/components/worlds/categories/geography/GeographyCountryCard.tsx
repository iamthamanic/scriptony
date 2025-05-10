
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Flag, Map, MapPin } from "lucide-react";
import { Country } from "@/types/worlds/geography";

interface GeographyCountryCardProps {
  country: Country;
}

const GeographyCountryCard: React.FC<GeographyCountryCardProps> = ({ country }) => {
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        {country.cover_image_url ? (
          <img 
            src={country.cover_image_url} 
            alt={country.name} 
            className="w-full h-24 object-cover"
          />
        ) : (
          <div className="w-full h-24 bg-muted flex items-center justify-center">
            <Map className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        
        {country.flag_url && (
          <div className="absolute top-2 right-2">
            <img 
              src={country.flag_url} 
              alt="Flagge" 
              className="h-8 w-8 object-cover rounded-full border-2 border-white shadow-md"
            />
          </div>
        )}
      </div>
      
      <CardHeader className="p-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Flag className="h-4 w-4 text-muted-foreground" />
          {country.name}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-3 pt-0">
        {country.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{country.description}</p>
        )}
        
        {country.locations && country.locations.length > 0 && (
          <div className="mt-2">
            <p className="text-xs font-medium flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {country.locations.length} Orte
            </p>
          </div>
        )}
        
        {country.customFields && country.customFields.length > 0 && (
          <div className="mt-2 grid grid-cols-1 gap-1">
            {country.customFields.slice(0, 2).map(field => (
              <p key={field.id} className="text-xs">
                <span className="font-medium">{field.name}:</span> {field.value}
              </p>
            ))}
            {country.customFields.length > 2 && (
              <p className="text-xs text-muted-foreground">
                +{country.customFields.length - 2} weitere
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GeographyCountryCard;
