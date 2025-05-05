
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, MapPin } from 'lucide-react';
import { Location } from '@/types/worlds';
import LocationCard from './LocationCard';
import LocationForm from './LocationForm';

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

  const handleSaveLocation = (location: Location) => {
    onUpdateLocation(location);
    setEditingLocation(null);
  };

  // If editing a location, show the edit form
  if (editingLocation) {
    return (
      <LocationForm
        location={editingLocation}
        onCancel={() => setEditingLocation(null)}
        onSave={handleSaveLocation}
      />
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
            <LocationCard 
              key={location.id}
              location={location}
              isExpanded={expandedLocation === location.id}
              onToggleExpand={() => toggleExpand(location.id)}
              onEdit={() => handleEditLocation(location)}
              onDelete={() => onDeleteLocation(location.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationEditor;
