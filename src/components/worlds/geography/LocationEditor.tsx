
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { Location, CustomField } from '@/types/worlds';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageUploader from './ImageUploader';
import CustomFieldsEditor from './CustomFieldsEditor';

interface LocationEditorProps {
  locations: Location[];
  onAddLocation: () => void;
  onUpdateLocation: (location: Location) => void;
  onDeleteLocation: (locationId: string) => void;
}

const LocationEditor: React.FC<LocationEditorProps> = ({ 
  locations, 
  onAddLocation,
  onUpdateLocation,
  onDeleteLocation
}) => {
  const [expandedLocation, setExpandedLocation] = useState<string | null>(null);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);

  const toggleExpand = (locationId: string) => {
    setExpandedLocation(expandedLocation === locationId ? null : locationId);
  };

  const handleEditLocation = (location: Location) => {
    setEditingLocation(location);
  };

  const handleSaveLocation = () => {
    if (editingLocation) {
      onUpdateLocation(editingLocation);
      setEditingLocation(null);
    }
  };

  // If editing a location, show the edit form
  if (editingLocation) {
    return (
      <div className="space-y-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setEditingLocation(null)}
        >
          Zurück zur Übersicht
        </Button>
        
        <div className="space-y-4 p-4 border rounded-md">
          <h3 className="text-lg font-medium">Ort bearbeiten</h3>
          
          <div className="space-y-2">
            <Label htmlFor="location-name">Name</Label>
            <Input 
              id="location-name" 
              value={editingLocation.name} 
              onChange={(e) => setEditingLocation({
                ...editingLocation,
                name: e.target.value
              })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location-description">Beschreibung</Label>
            <Textarea 
              id="location-description" 
              value={editingLocation.description || ''} 
              onChange={(e) => setEditingLocation({
                ...editingLocation,
                description: e.target.value
              })}
            />
          </div>
          
          <Tabs defaultValue="images" className="w-full">
            <TabsList>
              <TabsTrigger value="images">Bilder</TabsTrigger>
              <TabsTrigger value="custom-fields">Benutzerdefinierte Felder</TabsTrigger>
            </TabsList>
            
            <TabsContent value="images" className="space-y-4 pt-4">
              <div>
                <Label>Titelbild</Label>
                <ImageUploader 
                  imageUrl={editingLocation.cover_image_url} 
                  onImageChange={(url) => setEditingLocation({
                    ...editingLocation,
                    cover_image_url: url
                  })}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="custom-fields" className="pt-4">
              <CustomFieldsEditor
                customFields={editingLocation.customFields}
                onChange={(customFields) => setEditingLocation({
                  ...editingLocation,
                  customFields
                })}
              />
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setEditingLocation(null)}>Abbrechen</Button>
            <Button 
              onClick={handleSaveLocation}
              className="bg-anime-purple hover:bg-anime-dark-purple"
            >
              Speichern
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Orte</h3>
        <Button 
          onClick={onAddLocation}
          size="sm"
          className="bg-anime-purple hover:bg-anime-dark-purple"
        >
          <Plus className="h-4 w-4 mr-2" /> Ort hinzufügen
        </Button>
      </div>
      
      {locations.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-lg">
          <MapPin className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">
            Keine Orte vorhanden. Fügen Sie einen neuen Ort hinzu.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {locations.map((location) => (
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
                      onClick={() => handleEditLocation(location)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Bearbeiten</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onDeleteLocation(location.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Löschen</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => toggleExpand(location.id)}
                    >
                      {expandedLocation === location.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                      <span className="sr-only">Erweitern</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              {expandedLocation === location.id && (
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
                    
                    {location.customFields.length > 0 && (
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
                        onClick={() => handleEditLocation(location)}
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

export default LocationEditor;
