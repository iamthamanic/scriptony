
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Country } from '@/types/worlds';
import ImageUploader from './ImageUploader';
import CustomFieldsEditor from './CustomFieldsEditor';
import LocationEditor from './LocationEditor';

interface CountryFormProps {
  country: Country;
  onCancel: () => void;
  onSave: (country: Country) => void;
  onAddLocation: () => void;
  onUpdateLocation: (location: any) => void;
  onDeleteLocation: (locationId: string) => void;
}

const CountryForm: React.FC<CountryFormProps> = ({
  country,
  onCancel,
  onSave,
  onAddLocation,
  onUpdateLocation,
  onDeleteLocation
}) => {
  const [editingCountry, setEditingCountry] = React.useState<Country>(country);

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
              customFields={editingCountry.customFields || []}
              onChange={(customFields) => setEditingCountry({
                ...editingCountry,
                customFields
              })}
            />
          </TabsContent>
          
          <TabsContent value="locations" className="pt-4">
            <LocationEditor
              locations={editingCountry.locations || []}
              onAddLocation={onAddLocation}
              onUpdateLocation={onUpdateLocation}
              onDeleteLocation={onDeleteLocation}
            />
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onCancel}>Abbrechen</Button>
          <Button 
            onClick={() => onSave(editingCountry)}
            className="bg-anime-purple hover:bg-anime-dark-purple"
          >
            Speichern
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CountryForm;
