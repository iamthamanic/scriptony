import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Map, ChevronDown, ChevronUp } from 'lucide-react';
import { Country, Location, CustomField, GeographyContent } from '@/types/worlds';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageUploader from './ImageUploader';
import CustomFieldsEditor from './CustomFieldsEditor';
import LocationEditor from './LocationEditor';
import { v4 as uuidv4 } from 'uuid';

interface CountryEditorProps {
  content: any;
  onChange: (content: GeographyContent) => void;
}

const CountryEditor: React.FC<CountryEditorProps> = ({ content, onChange }) => {
  const [activeTab, setActiveTab] = useState<string>('countries');
  const [expandedCountry, setExpandedCountry] = useState<string | null>(null);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);

  // Initialize content structure if it doesn't exist
  const geographyContent: GeographyContent = content && content.countries 
    ? content as GeographyContent 
    : { countries: [] };

  const handleAddCountry = () => {
    const newCountry: Country = {
      id: uuidv4(),
      name: 'Neues Land',
      description: '',
      customFields: [],
      locations: []
    };
    
    const updatedContent: GeographyContent = {
      ...geographyContent,
      countries: [...geographyContent.countries, newCountry]
    };
    
    onChange(updatedContent);
    setEditingCountry(newCountry);
  };

  const handleUpdateCountry = (updatedCountry: Country) => {
    const updatedContent: GeographyContent = {
      ...geographyContent,
      countries: geographyContent.countries.map(country => 
        country.id === updatedCountry.id ? updatedCountry : country
      )
    };
    
    onChange(updatedContent);
    setEditingCountry(null);
  };

  const handleDeleteCountry = (countryId: string) => {
    if (window.confirm('Sind Sie sicher, dass Sie dieses Land löschen möchten?')) {
      const updatedContent: GeographyContent = {
        ...geographyContent,
        countries: geographyContent.countries.filter(country => country.id !== countryId)
      };
      
      onChange(updatedContent);
      
      if (expandedCountry === countryId) {
        setExpandedCountry(null);
      }
      
      if (editingCountry?.id === countryId) {
        setEditingCountry(null);
      }
    }
  };

  const handleAddLocation = (countryId: string) => {
    const country = geographyContent.countries.find(c => c.id === countryId);
    
    if (country) {
      const newLocation: Location = {
        id: uuidv4(),
        name: 'Neuer Ort',
        description: '',
        customFields: []
      };
      
      const updatedCountry: Country = {
        ...country,
        locations: [...country.locations, newLocation]
      };
      
      handleUpdateCountry(updatedCountry);
    }
  };

  const handleUpdateLocation = (countryId: string, updatedLocation: Location) => {
    const country = geographyContent.countries.find(c => c.id === countryId);
    
    if (country) {
      const updatedCountry: Country = {
        ...country,
        locations: country.locations.map(location => 
          location.id === updatedLocation.id ? updatedLocation : location
        )
      };
      
      handleUpdateCountry(updatedCountry);
    }
  };

  const handleDeleteLocation = (countryId: string, locationId: string) => {
    if (window.confirm('Sind Sie sicher, dass Sie diesen Ort löschen möchten?')) {
      const country = geographyContent.countries.find(c => c.id === countryId);
      
      if (country) {
        const updatedCountry: Country = {
          ...country,
          locations: country.locations.filter(location => location.id !== locationId)
        };
        
        handleUpdateCountry(updatedCountry);
      }
    }
  };

  const toggleExpand = (countryId: string) => {
    setExpandedCountry(expandedCountry === countryId ? null : countryId);
  };

  // If editing a country, show the edit form
  if (editingCountry) {
    return (
      <div className="space-y-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setEditingCountry(null)}
        >
          Zurück zur Übersicht
        </Button>
        
        <div className="space-y-4 p-4 border rounded-md">
          <h3 className="text-lg font-medium">Land bearbeiten</h3>
          
          <div className="space-y-2">
            <Label htmlFor="country-name">Name</Label>
            <Input 
              id="country-name" 
              value={editingCountry.name} 
              onChange={(e) => setEditingCountry({
                ...editingCountry,
                name: e.target.value
              })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="country-description">Beschreibung</Label>
            <Textarea 
              id="country-description" 
              value={editingCountry.description || ''} 
              onChange={(e) => setEditingCountry({
                ...editingCountry,
                description: e.target.value
              })}
            />
          </div>
          
          <Tabs defaultValue="images" className="w-full">
            <TabsList>
              <TabsTrigger value="images">Bilder</TabsTrigger>
              <TabsTrigger value="custom-fields">Benutzerdefinierte Felder</TabsTrigger>
              <TabsTrigger value="locations">Orte</TabsTrigger>
            </TabsList>
            
            <TabsContent value="images" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Flagge</Label>
                  <ImageUploader 
                    imageUrl={editingCountry.flag_url} 
                    onImageChange={(url) => setEditingCountry({
                      ...editingCountry,
                      flag_url: url
                    })}
                  />
                </div>
                <div>
                  <Label>Titelbild</Label>
                  <ImageUploader 
                    imageUrl={editingCountry.cover_image_url} 
                    onImageChange={(url) => setEditingCountry({
                      ...editingCountry,
                      cover_image_url: url
                    })}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="custom-fields" className="pt-4">
              <CustomFieldsEditor
                customFields={editingCountry.customFields}
                onChange={(customFields) => setEditingCountry({
                  ...editingCountry,
                  customFields
                })}
              />
            </TabsContent>
            
            <TabsContent value="locations" className="pt-4">
              <LocationEditor
                locations={editingCountry.locations}
                onAddLocation={() => handleAddLocation(editingCountry.id)}
                onUpdateLocation={(location) => handleUpdateLocation(editingCountry.id, location)}
                onDeleteLocation={(locationId) => handleDeleteLocation(editingCountry.id, locationId)}
              />
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setEditingCountry(null)}>Abbrechen</Button>
            <Button 
              onClick={() => handleUpdateCountry(editingCountry)}
              className="bg-anime-purple hover:bg-anime-dark-purple"
            >
              Speichern
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Otherwise show the list of countries
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Länder</h3>
        <Button 
          onClick={handleAddCountry}
          size="sm"
          className="bg-anime-purple hover:bg-anime-dark-purple"
        >
          <Plus className="h-4 w-4 mr-2" /> Land hinzufügen
        </Button>
      </div>
      
      {geographyContent.countries.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-lg">
          <Map className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">
            Keine Länder vorhanden. Fügen Sie ein neues Land hinzu.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {geographyContent.countries.map((country) => (
            <Card key={country.id} className="overflow-hidden">
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
                      onClick={() => setEditingCountry(country)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Bearbeiten</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteCountry(country.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Löschen</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => toggleExpand(country.id)}
                    >
                      {expandedCountry === country.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                      <span className="sr-only">Erweitern</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              {expandedCountry === country.id && (
                <CardContent className="pt-2 px-4 pb-4">
                  <div className="space-y-4">
                    {country.description && (
                      <div>
                        <p className="text-sm text-muted-foreground">{country.description}</p>
                      </div>
                    )}
                    
                    {country.customFields.length > 0 && (
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
                    
                    {country.locations.length > 0 && (
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
                        onClick={() => setEditingCountry(country)}
                      >
                        <Edit className="h-4 w-4 mr-2" /> Bearbeiten
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CountryEditor;
