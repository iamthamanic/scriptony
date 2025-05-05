import { Json } from "@/integrations/supabase/types";
import { WorldCategoryType, getEmptyCategoryContent } from "@/types/worlds";

/**
 * Helper functions for content structure preservation during category operations
 */
export const useCategoryHelpers = () => {
  // Helper to ensure content structures are preserved correctly
  const ensureContentStructure = (type: WorldCategoryType, existingContent: Json | null): Json => {
    console.log("Ensuring content structure for type:", type, "Existing:", existingContent);
    
    // Get default empty structure for this category type
    const emptyContent = getEmptyCategoryContent(type);
    
    // Early return if no existing content
    if (!existingContent) return emptyContent;
    
    // Deep clone the content to avoid reference issues
    const contentCopy = existingContent ? JSON.parse(JSON.stringify(existingContent)) : {};
    
    // Ensure we have the expected structure based on category type
    switch (type) {
      case 'geography':
        // Preserve country data including images
        let countries = [];
        
        if ((contentCopy as any)?.countries && Array.isArray((contentCopy as any).countries)) {
          countries = (contentCopy as any).countries.map((country: any) => {
            console.log('Preserving country:', country.name);
            console.log('With flag URL:', country.flag_url);
            console.log('With cover image URL:', country.cover_image_url);
            
            // Create a clean copy of the country
            const countryCopy = {
              ...country,
              flag_url: country.flag_url,
              cover_image_url: country.cover_image_url,
              locations: []
            };
            
            // Add locations if they exist
            if (Array.isArray(country.locations)) {
              countryCopy.locations = country.locations.map((loc: any) => {
                console.log('Preserving location:', loc.name);
                console.log('With cover image URL:', loc.cover_image_url);
                
                return {
                  ...loc,
                  cover_image_url: loc.cover_image_url,
                  symbol_image_url: loc.symbol_image_url
                };
              });
            }
            
            return countryCopy;
          });
        }
          
        return {
          countries
        } as Json;
      
      case 'politics':
        return preservePoliticsContent(contentCopy);
      
      case 'economy':
        return preserveEconomyContent(contentCopy);
      
      case 'society':
        return preserveSocietyContent(contentCopy);
      
      case 'culture':
        return preserveCultureContent(contentCopy);
      
      default:
        // For custom or other categories, just keep what we have
        return contentCopy as Json;
    }
  };
  
  // Helper functions for each category type
  const preservePoliticsContent = (contentCopy: any): Json => {
    return {
      systems: Array.isArray((contentCopy as any)?.systems) ? 
        (contentCopy as any).systems.map((system: any) => ({
          ...system,
          cover_image_url: system.cover_image_url,
          symbol_image_url: system.symbol_image_url,
        })) : []
    } as Json;
  };
  
  const preserveEconomyContent = (contentCopy: any): Json => {
    return {
      entities: Array.isArray((contentCopy as any)?.entities) ? 
        (contentCopy as any).entities.map((entity: any) => ({
          ...entity,
          cover_image_url: entity.cover_image_url,
          symbol_image_url: entity.symbol_image_url,
        })) : []
    } as Json;
  };
  
  const preserveSocietyContent = (contentCopy: any): Json => {
    return {
      groups: Array.isArray((contentCopy as any)?.groups) ? 
        (contentCopy as any).groups.map((group: any) => ({
          ...group,
          cover_image_url: group.cover_image_url,
          symbol_image_url: group.symbol_image_url,
        })) : []
    } as Json;
  };
  
  const preserveCultureContent = (contentCopy: any): Json => {
    return {
      elements: Array.isArray((contentCopy as any)?.elements) ? 
        (contentCopy as any).elements.map((element: any) => ({
          ...element,
          cover_image_url: element.cover_image_url,
          symbol_image_url: element.symbol_image_url,
        })) : []
    } as Json;
  };

  return {
    ensureContentStructure
  };
};
