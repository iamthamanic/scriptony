
import { useState } from 'react';
import { Country, GeographyContent, Location } from '@/types/worlds';
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";
import { Json } from '@/integrations/supabase/types';
import { safeJsonTransform, preserveImageProperties } from "@/utils/jsonPreserver";

interface UseCountryEditorProps {
  content: any;
  onChange: (content: GeographyContent) => void;
}

export function useCountryEditor({ content, onChange }: UseCountryEditorProps) {
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
      console.log('Updating country:', updatedCountry.name);
      console.log('Flag URL before update:', updatedCountry.flag_url);
      console.log('Cover image URL before update:', updatedCountry.cover_image_url);
      
      // Use the preserveImageProperties utility to ensure image URLs are preserved
      const countryForUpdate = preserveImageProperties(updatedCountry) as Country & Record<string, Json>;
      
      // Log after transformation to verify URLs are preserved
      console.log('Flag URL after transform:', countryForUpdate.flag_url);
      console.log('Cover image URL after transform:', countryForUpdate.cover_image_url);
      
      // Update the working copy first
      const updatedCountries = workingContent.countries.map(country => 
        country.id === updatedCountry.id ? countryForUpdate : country
      );
      
      // Create a new content object to trigger a proper update
      const updatedContent: GeographyContent = {
        ...workingContent,
        countries: updatedCountries
      };
      
      console.log('Updated content before save:', JSON.stringify(updatedContent).substring(0, 100) + '...');
      
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
    
    // Preserve image URLs and other special properties
    const locationForUpdate = preserveImageProperties(updatedLocation) as Location & Record<string, Json>;
    
    // Update in the currently editing country only
    setEditingCountry({
      ...editingCountry,
      locations: (editingCountry.locations || []).map(location => 
        location.id === updatedLocation.id ? locationForUpdate : location
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

  const handleEditCountry = (country: Country) => {
    console.log('Starting edit of country:', country.name);
    console.log('Original flag_url:', country.flag_url);
    console.log('Original cover_image_url:', country.cover_image_url);
    
    // Create a deep copy with preserved image URLs
    const countryToEdit = preserveImageProperties(country);
    
    console.log('Country to edit after transform:');
    console.log('- flag_url:', countryToEdit.flag_url);
    console.log('- cover_image_url:', countryToEdit.cover_image_url);
    
    setEditingCountry(countryToEdit);
  };

  return {
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
  };
}
