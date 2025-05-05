
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Location } from '@/types/worlds';
import ImageUploader from './ImageUploader';
import CustomFieldsEditor from './CustomFieldsEditor';

interface LocationFormProps {
  location: Location;
  onCancel: () => void;
  onSave: (location: Location) => void;
}

const LocationForm: React.FC<LocationFormProps> = ({
  location,
  onCancel,
  onSave
}) => {
  const [editingLocation, setEditingLocation] = useState<Location>({...location});

  useEffect(() => {
    console.log('Location form initialized with:', location);
    console.log('Location cover_image_url:', location.cover_image_url);
  }, [location]);

  const handleLocationUpdate = (updates: Partial<Location>) => {
    console.log('Updating location with:', updates);
    setEditingLocation(prev => {
      const updated = {
        ...prev,
        ...updates
      };
      console.log('Updated location state:', updated);
      return updated;
    });
  };

  const handleSave = () => {
    console.log('Saving location with cover_image_url:', editingLocation.cover_image_url);
    onSave(editingLocation);
  };

  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        size="sm"
        onClick={onCancel}
      >
        Zurück zur Liste
      </Button>
      
      <div className="space-y-4 p-4 border rounded-md">
        <h3 className="text-lg font-medium">Ort bearbeiten</h3>
        
        <div className="space-y-2">
          <Label htmlFor="location-name">Name</Label>
          <Input 
            id="location-name" 
            value={editingLocation.name} 
            onChange={(e) => handleLocationUpdate({
              name: e.target.value
            })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location-description">Beschreibung</Label>
          <Textarea 
            id="location-description" 
            value={editingLocation.description || ''} 
            onChange={(e) => handleLocationUpdate({
              description: e.target.value
            })}
          />
        </div>
        
        <Tabs defaultValue="image" className="w-full">
          <TabsList>
            <TabsTrigger value="image">Bild</TabsTrigger>
            <TabsTrigger value="coordinates">Koordinaten</TabsTrigger>
            <TabsTrigger value="custom-fields">Benutzerdefinierte Felder</TabsTrigger>
          </TabsList>
          
          <TabsContent value="image" className="pt-4">
            <Label>Titelbild</Label>
            <ImageUploader 
              imageUrl={editingLocation.cover_image_url} 
              onImageChange={(url) => {
                console.log('Location cover image changed to:', url);
                handleLocationUpdate({
                  cover_image_url: url
                });
              }}
              disableToast={true}
              category="location"
            />
          </TabsContent>
          
          <TabsContent value="coordinates" className="pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="coord-x">X-Koordinate</Label>
                <Input 
                  id="coord-x"
                  type="number"
                  value={editingLocation.coordinates?.x || 0}
                  onChange={(e) => handleLocationUpdate({
                    coordinates: {
                      ...editingLocation.coordinates,
                      x: parseInt(e.target.value) || 0
                    }
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="coord-y">Y-Koordinate</Label>
                <Input 
                  id="coord-y"
                  type="number"
                  value={editingLocation.coordinates?.y || 0}
                  onChange={(e) => handleLocationUpdate({
                    coordinates: {
                      ...editingLocation.coordinates,
                      y: parseInt(e.target.value) || 0
                    }
                  })}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="custom-fields" className="pt-4">
            <CustomFieldsEditor
              customFields={editingLocation.customFields || []}
              onChange={(customFields) => handleLocationUpdate({
                customFields
              })}
            />
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onCancel}>Abbrechen</Button>
          <Button 
            onClick={handleSave}
            className="bg-anime-purple hover:bg-anime-dark-purple"
          >
            Speichern
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LocationForm;
