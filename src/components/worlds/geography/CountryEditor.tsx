import React, { useState } from 'react';
import { Country, GeographyContent, Location } from '@/types/worlds';
import { v4 as uuidv4 } from 'uuid';
import CountryForm from './CountryForm';
import CountryList from './CountryList';
import { toast } from "sonner";
import { Json } from '@/integrations/supabase/types';

interface CountryEditorProps {
  content: any;
  onChange: (content: GeographyContent) => void;
}

const CountryEditor: React.FC<CountryEditorProps> = ({ content, onChange }) => {
  const [expandedCountryId, setExpandedCountryId] = useState<string | null>(null);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  
  // Initialize content structure safely
  const geographyContent: GeographyContent = content && content.countries 
    ? content as GeographyContent 
    : { countries: [] as Array<Country & Record<string, Json>> };
  
  // Create a working copy for local edits
  const [workingContent, setWorkingContent] = useState<GeographyContent>({
    countries: [...(geographyContent.countries || [])]
  });

  const handleAddCountry = () => {
    const newCountry: Country = {
      id: uuidv4(),
      name: 'Neues Land',
      description: '',
      customFields: [],
      locations: []
    };
    
    // Add to working copy only
    const updatedCountries = [...workingContent.countries, newCountry as Country & Record<string, Json>];
    setWorkingContent({
      ...workingContent,
      countries: updatedCountries
    });
    
    // Start editing the new country
    setEditingCountry({...newCountry});
  };

  const handleUpdateCountry = (updatedCountry: Country) => {
    try {
      // Update the working copy first
      const updatedCountries = workingContent.countries.map(country => 
        country.id === updatedCountry.id ? updatedCountry as Country & Record<string, Json> : country
      );
      
      // Create a new content object to trigger a proper update
      const updatedContent: GeographyContent = {
        ...workingContent,
        countries: updatedCountries
      };
      
      // Save to the actual content via onChange
      onChange(updatedContent);
      setEditingCountry(null);
      
      // Update our working copy too
      setWorkingContent(updatedContent);
      
      toast.success("Land erfolgreich aktualisiert");
    } catch (error) {
      console.error("Error updating country:", error);
      toast.error("Fehler beim Aktualisieren des Landes");
    }
  };

  const handleCancelEdit = () => {
    // If cancelling, discard changes and reset to original content
    setEditingCountry(null);
    
    // Reset working copy to match the actual content
    setWorkingContent({
      countries: [...(geographyContent.countries || [])]
    });
  };

  const handleDeleteCountry = (countryId: string) => {
    if (window.confirm('Sind Sie sicher, dass Sie dieses Land löschen möchten?')) {
      try {
        const updatedContent: GeographyContent = {
          ...workingContent,
          countries: workingContent.countries.filter(country => country.id !== countryId)
        };
        
        // Persist the deletion
        onChange(updatedContent);
        
        // Update working copy
        setWorkingContent(updatedContent);
        
        if (expandedCountryId === countryId) {
          setExpandedCountryId(null);
        }
        
        if (editingCountry?.id === countryId) {
          setEditingCountry(null);
        }
      } catch (error) {
        console.error("Error deleting country:", error);
        toast.error("Fehler beim Löschen des Landes");
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
      locations: [...(editingCountry.locations || []), newLocation as Location & Record<string, Json>]
    });
  };

  const handleUpdateLocation = (updatedLocation: Location) => {
    if (!editingCountry) return;
    
    // Update in the currently editing country only
    setEditingCountry({
      ...editingCountry,
      locations: (editingCountry.locations || []).map(location => 
        location.id === updatedLocation.id ? updatedLocation as Location & Record<string, Json> : location
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
      countries={workingContent.countries || []}
      expandedCountryId={expandedCountryId}
      onToggleExpand={toggleExpand}
      onAddCountry={handleAddCountry}
      onEditCountry={(country) => {
        // Set the editing country to a deep copy to avoid reference issues
        setEditingCountry(JSON.parse(JSON.stringify(country)));
      }}
      onDeleteCountry={handleDeleteCountry}
    />
  );
};

export default CountryEditor;
