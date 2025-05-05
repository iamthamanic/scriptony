import React, { useState } from 'react';
import { Country, GeographyContent, Location } from '@/types/worlds';
import { v4 as uuidv4 } from 'uuid';
import CountryForm from './CountryForm';
import CountryList from './CountryList';

interface CountryEditorProps {
  content: any;
  onChange: (content: GeographyContent) => void;
}

const CountryEditor: React.FC<CountryEditorProps> = ({ content, onChange }) => {
  const [expandedCountryId, setExpandedCountryId] = useState<string | null>(null);
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
      
      if (expandedCountryId === countryId) {
        setExpandedCountryId(null);
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
        locations: [...(country.locations || []), newLocation]
      };
      
      handleUpdateCountry(updatedCountry);
    }
  };

  const handleUpdateLocation = (countryId: string, updatedLocation: Location) => {
    const country = geographyContent.countries.find(c => c.id === countryId);
    
    if (country && country.locations) {
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
      
      if (country && country.locations) {
        const updatedCountry: Country = {
          ...country,
          locations: country.locations.filter(location => location.id !== locationId)
        };
        
        handleUpdateCountry(updatedCountry);
      }
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
        onCancel={() => setEditingCountry(null)}
        onSave={handleUpdateCountry}
        onAddLocation={() => handleAddLocation(editingCountry.id)}
        onUpdateLocation={(location) => handleUpdateLocation(editingCountry.id, location)}
        onDeleteLocation={(locationId) => handleDeleteLocation(editingCountry.id, locationId)}
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
      onEditCountry={setEditingCountry}
      onDeleteCountry={handleDeleteCountry}
    />
  );
};

export default CountryEditor;
