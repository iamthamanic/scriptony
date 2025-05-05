
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Location } from '@/types/worlds';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  const [editingLocation, setEditingLocation] = useState<Location>(location);

  const handleSaveLocation = () => {
    onSave(editingLocation);
  };

  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        size="sm"
        onClick={onCancel}
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
              customFields={editingLocation.customFields || []}
              onChange={(customFields) => setEditingLocation({
                ...editingLocation,
                customFields
              })}
            />
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onCancel}>Abbrechen</Button>
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
};

export default LocationForm;
