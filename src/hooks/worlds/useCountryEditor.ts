
import { useState, useEffect } from 'react';
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
  const [instanceId] = useState(`editor-${Math.random().toString(36).substring(2, 9)}`);
  
  // Initialize content structure safely
  const geographyContent: GeographyContent = content && typeof content === 'object' && content.countries 
    ? content as GeographyContent 
    : { countries: [] as Array<Country & Record<string, Json>> };
  
  // Create a working copy for local edits
  const [workingContent, setWorkingContent] = useState<GeographyContent>({
    countries: [...(geographyContent.countries || [])]
  });
  
  // Log when content changes
  useEffect(() => {
    console.log(`[${instanceId}] Content updated:`, content);
    if (content && typeof content === 'object' && content.countries && Array.isArray(content.countries)) {
      console.log(`[${instanceId}] Countries count:`, content.countries.length);
      if (content.countries.length > 0) {
        const sampleCountry = content.countries[0];
        console.log(`[${instanceId}] Sample country flag_url:`, sampleCountry.flag_url);
        console.log(`[${instanceId}] Sample country cover_image_url:`, sampleCountry.cover_image_url);
      }
    }
  }, [content, instanceId]);

  const handleAddCountry = () => {
    const newCountry: Country = {
      id: uuidv4(),
      name: 'Neues Land',
      description: '',
      customFields: [],
      locations: []
    };
    
    console.log(`[${instanceId}] Adding new country:`, newCountry);
    
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
      console.log(`[${instanceId}] Updating country:`, updatedCountry.name);
      console.log(`[${instanceId}] Flag URL before update:`, updatedCountry.flag_url);
      console.log(`[${instanceId}] Cover image URL before update:`, updatedCountry.cover_image_url);
      
      // First ensure we're working with a full deep copy to avoid reference issues
      const countryForUpdate = JSON.parse(JSON.stringify(updatedCountry));
      
      // Then apply the preserveImageProperties utility to ensure image URLs are preserved
      const processedCountry = preserveImageProperties(countryForUpdate) as Country & Record<string, Json>;
      
      // Log after transformation to verify URLs are preserved
      console.log(`[${instanceId}] Flag URL after transform:`, processedCountry.flag_url);
      console.log(`[${instanceId}] Cover image URL after transform:`, processedCountry.cover_image_url);
      
      // Update the working copy first
      const updatedCountries = workingContent.countries.map(country => 
        country.id === updatedCountry.id ? processedCountry : country
      );
      
      // Create a new content object to trigger a proper update
      const updatedContent: GeographyContent = {
        ...workingContent,
        countries: updatedCountries
      };
      
      console.log(`[${instanceId}] Updated content before save:`, JSON.stringify(updatedContent).substring(0, 100) + '...');
      
      // Save to the actual content via onChange
      onChange(safeJsonTransform(updatedContent) as GeographyContent);
      setEditingCountry(null);
      
      // Update our working copy too
      setWorkingContent(updatedContent);
      
      toast.success("Land erfolgreich aktualisiert");
    } catch (error) {
      console.error(`[${instanceId}] Error updating country:`, error);
      toast.error("Fehler beim Aktualisieren des Landes");
    }
  };

  const handleCancelEdit = () => {
    console.log(`[${instanceId}] Cancelling edit`);
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
        console.log(`[${instanceId}] Deleting country:`, countryId);
        
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
        console.error(`[${instanceId}] Error deleting country:`, error);
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
    
    console.log(`[${instanceId}] Adding new location to country:`, editingCountry.name);
    
    // Update the editing country with the new location without saving to backend
    setEditingCountry({
      ...editingCountry,
      locations: [...(editingCountry.locations || []), newLocation as Location & Record<string, Json>]
    });
  };

  const handleUpdateLocation = (updatedLocation: Location) => {
    if (!editingCountry) return;
    
    console.log(`[${instanceId}] Updating location:`, updatedLocation.name);
    
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
      console.log(`[${instanceId}] Deleting location:`, locationId);
      
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
    console.log(`[${instanceId}] Starting edit of country:`, country.name);
    console.log(`[${instanceId}] Original flag_url:`, country.flag_url);
    console.log(`[${instanceId}] Original cover_image_url:`, country.cover_image_url);
    
    // Create a deep copy with preserved image URLs
    const countryToEdit = JSON.parse(JSON.stringify(country));
    const processedCountry = preserveImageProperties(countryToEdit);
    
    console.log(`[${instanceId}] Country to edit after transform:`);
    console.log(`- flag_url:`, processedCountry.flag_url);
    console.log(`- cover_image_url:`, processedCountry.cover_image_url);
    
    setEditingCountry(processedCountry);
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
