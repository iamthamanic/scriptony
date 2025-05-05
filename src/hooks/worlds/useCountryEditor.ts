
import { useState } from 'react';
import { Country, GeographyContent, Location } from '@/types/worlds';
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";
import { Json } from '@/integrations/supabase/types';

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
      console.log('Updating country:', updatedCountry);
      console.log('With flag_url:', updatedCountry.flag_url);
      console.log('With cover_image_url:', updatedCountry.cover_image_url);
      
      // Create a deep clone to avoid reference issues
      const countryForUpdate = JSON.parse(JSON.stringify(updatedCountry)) as Country & Record<string, Json>;
      
      // Make sure the image URLs are preserved
      countryForUpdate.flag_url = updatedCountry.flag_url;
      countryForUpdate.cover_image_url = updatedCountry.cover_image_url;
      
      // Make sure the locations have their image URLs preserved too
      if (updatedCountry.locations) {
        countryForUpdate.locations = updatedCountry.locations.map(loc => {
          const locationCopy = JSON.parse(JSON.stringify(loc)) as Location & Record<string, Json>;
          locationCopy.cover_image_url = loc.cover_image_url;
          return locationCopy;
        });
      }
      
      // Update the working copy first
      const updatedCountries = workingContent.countries.map(country => 
        country.id === updatedCountry.id ? countryForUpdate : country
      );
      
      // Create a new content object to trigger a proper update
      const updatedContent: GeographyContent = {
        ...workingContent,
        countries: updatedCountries
      };
      
      console.log('Updated content to save:', updatedContent);
      
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
    
    // Create a deep copy to avoid reference issues
    const locationForUpdate = JSON.parse(JSON.stringify(updatedLocation)) as Location & Record<string, Json>;
    
    // Make sure the image URL is preserved
    locationForUpdate.cover_image_url = updatedLocation.cover_image_url;
    
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
    // Create a deep copy to avoid reference issues
    const countryToEdit = JSON.parse(JSON.stringify(country));
    
    // Make sure the image URLs are preserved during edit
    countryToEdit.flag_url = country.flag_url;
    countryToEdit.cover_image_url = country.cover_image_url;
    
    // Make sure the locations have their image URLs preserved too
    if (country.locations) {
      countryToEdit.locations = country.locations.map(loc => {
        const locationCopy = JSON.parse(JSON.stringify(loc));
        locationCopy.cover_image_url = loc.cover_image_url;
        return locationCopy;
      });
    }
    
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
