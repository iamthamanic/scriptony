import React from 'react';
import { GeographyContent } from '@/types/worlds';
import CountryForm from './CountryForm';
import CountryList from './CountryList';
import { useCountryEditor } from '@/hooks/worlds/useCountryEditor';

interface CountryEditorProps {
  content: any;
  onChange: (content: GeographyContent) => void;
}

const CountryEditor: React.FC<CountryEditorProps> = ({ content, onChange }) => {
  const {
    editingCountry,
    workingContent,
    expandedCountryId,
    handleAddCountry,
    handleUpdateCountry,
    handleCancelEdit,
    handleDeleteCountry,
    handleAddLocation,
    handleUpdateLocation,
    handleDeleteLocation,
    toggleExpand,
    handleEditCountry
  } = useCountryEditor({ content, onChange });

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
      onEditCountry={handleEditCountry}
      onDeleteCountry={handleDeleteCountry}
    />
  );
};

export default CountryEditor;
