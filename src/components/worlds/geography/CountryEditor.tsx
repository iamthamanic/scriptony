import React, { useState } from 'react';
import { Country, GeographyContent, Location } from '@/types/worlds';
import { v4 as uuidv4 } from 'uuid';
import CountryForm from './CountryForm';
import CountryList from './CountryList';
import { toast } from "sonner";

interface CountryEditorProps {
  content: any;
  onChange: (content: GeographyContent) => void;
}

const CountryEditor: React.FC<CountryEditorProps> = ({ content, onChange }) => {
  const [expandedCountryId, setExpandedCountryId] = useState<string | null>(null);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  // Add a working copy of the content to prevent immediate saves
  const [workingContent, setWorkingContent] = useState<GeographyContent>(
    content && content.countries 
      ? content as GeographyContent 
      : { countries: [] }
  );

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
    
    // Add to working copy only, not to the actual saved content
    setWorkingContent(prev => ({
      ...prev,
      countries: [...prev.countries, newCountry]
    }));
    
    setEditingCountry(newCountry);
  };

  const handleUpdateCountry = (updatedCountry: Country) => {
    // Save the country update to the actual content
    const updatedContent: GeographyContent = {
      ...geographyContent,
      countries: geographyContent.countries.map(country => 
        country.id === updatedCountry.id ? updatedCountry : country
      )
    };
    
    // Only now do we call onChange to persist the changes
    onChange(updatedContent);
    setEditingCountry(null);
    
    toast.success("Land erfolgreich aktualisiert");
  };

  const handleCancelEdit = () => {
    // If cancelling, discard changes and reset to original content
    setEditingCountry(null);
    // Reset working copy to match the actual content
    setWorkingContent(
      content && content.countries 
        ? content as GeographyContent 
        : { countries: [] }
    );
  };

  const handleDeleteCountry = (countryId: string) => {
    if (window.confirm('Sind Sie sicher, dass Sie dieses Land löschen möchten?')) {
      const updatedContent: GeographyContent = {
        ...geographyContent,
        countries: geographyContent.countries.filter(country => country.id !== countryId)
      };
      
      // Persist the deletion immediately
      onChange(updatedContent);
      
      if (expandedCountryId === countryId) {
        setExpandedCountryId(null);
      }
      
      if (editingCountry?.id === countryId) {
        setEditingCountry(null);
      }
    }
  };

  const handleAddLocation = () => {
    if (!editingCountry) return;
    
    const newLocation: Location = {
      id: uuidv4(),
      name: 'Neuer Ort',
      description: '',
      customFields: []
    };
    
    // Update the editing country with the new location without saving to backend
    setEditingCountry({
      ...editingCountry,
      locations: [...(editingCountry.locations || []), newLocation]
    });
  };

  const handleUpdateLocation = (updatedLocation: Location) => {
    if (!editingCountry) return;
    
    // Update in the currently editing country only
    setEditingCountry({
      ...editingCountry,
      locations: (editingCountry.locations || []).map(location => 
        location.id === updatedLocation.id ? updatedLocation : location
      )
    });
  };

  const handleDeleteLocation = (locationId: string) => {
    if (!editingCountry) return;
    
    if (window.confirm('Sind Sie sicher, dass Sie diesen Ort löschen möchten?')) {
      setEditingCountry({
        ...editingCountry,
        locations: (editingCountry.locations || []).filter(location => location.id !== locationId)
      });
    }
  };

  const toggleExpand = (countryId: string) => {
    setExpandedCountryId(expandedCountryId === countryId ? null : countryId);
  };

  // If editing a country, show the edit form
  if (editingCountry) {
    return (
      <CountryForm
        country={editingCountry}
        onCancel={handleCancelEdit}
        onSave={handleUpdateCountry}
        onAddLocation={handleAddLocation}
        onUpdateLocation={handleUpdateLocation}
        onDeleteLocation={handleDeleteLocation}
      />
    );
  }

  // Otherwise show the list of countries
  return (
    <CountryList
      countries={geographyContent.countries || []}
      expandedCountryId={expandedCountryId}
      onToggleExpand={toggleExpand}
      onAddCountry={handleAddCountry}
      onEditCountry={(country) => {
        // Set the editing country to a new object to avoid reference issues
        setEditingCountry({...country});
      }}
      onDeleteCountry={handleDeleteCountry}
    />
  );
};

export default CountryEditor;
