
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WorldCategory, GeographyContent, Country } from "@/types";
import { ChevronDown, ChevronUp, Edit, Trash2, Globe, Map, Flag, MapPin } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WorldCategoryCardProps {
  category: WorldCategory;
  onEdit: () => void;
  onDelete: () => void;
}

const WorldCategoryCard = ({ category, onEdit, onDelete }: WorldCategoryCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getIconComponent = () => {
    switch (category.type) {
      case 'geography':
        return <Map className="h-5 w-5" />;
      default:
        return <Globe className="h-5 w-5" />;
    }
  };

  const renderGeographyContent = () => {
    if (!category.content) return <div className="text-center py-8 text-muted-foreground">Keine Inhalte vorhanden</div>;
    
    // Safely check if content matches the expected GeographyContent structure
    const content = category.content;
    const isValidGeographyContent = (
      typeof content === 'object' && 
      content !== null && 
      !Array.isArray(content) &&
      'countries' in content && 
      Array.isArray((content as any).countries)
    );
    
    // Create a properly typed geography content object with safe type assertion
    const geographyContent = isValidGeographyContent 
      ? { countries: (content as any).countries } as GeographyContent
      : { countries: [] } as GeographyContent;
      
    const countries = geographyContent.countries || [];
    
    if (countries.length === 0) {
      return <div className="text-center py-8 text-muted-foreground">Keine Länder vorhanden</div>;
    }
    
    return (
      <Tabs defaultValue="countries">
        <TabsList>
          <TabsTrigger value="countries">Länder ({countries.length})</TabsTrigger>
          <TabsTrigger value="json">JSON</TabsTrigger>
        </TabsList>
        
        <TabsContent value="countries" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {countries.map((country: Country) => (
              <Card key={country.id} className="overflow-hidden">
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
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="json">
          <Textarea 
            value={JSON.stringify(category.content, null, 2)}
            readOnly
            className="min-h-[200px] font-mono text-sm"
          />
        </TabsContent>
      </Tabs>
    );
  };

  const renderCategoryContent = () => {
    switch (category.type) {
      case 'geography':
        return renderGeographyContent();
      default:
        // For other category types, just show JSON
        return (
          <div className="bg-muted/50 rounded-md p-2">
            {category.content && Object.keys(category.content).length > 0 ? (
              <Textarea 
                value={JSON.stringify(category.content, null, 2)}
                readOnly
                className="min-h-[200px] font-mono text-sm"
              />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Keine Inhalte vorhanden
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <Card className="transition-all">
      <CardHeader className="py-3 px-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="h-7 w-7 rounded bg-muted/50 flex items-center justify-center">
              {getIconComponent()}
            </div>
            {category.name}
          </CardTitle>
          
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4" />
              <span className="sr-only">Bearbeiten</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Löschen</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              <span className="sr-only">Erweitern</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0 pb-3 px-4">
          {renderCategoryContent()}
          
          <div className="mt-3 flex justify-end">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Bearbeiten
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default WorldCategoryCard;
