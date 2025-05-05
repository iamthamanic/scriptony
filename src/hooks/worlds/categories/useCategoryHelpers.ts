
import { Json } from "@/integrations/supabase/types";
import { WorldCategoryType, getEmptyCategoryContent } from "@/types/worlds";
import { preserveImageProperties } from "@/utils/jsonPreserver";

export function useCategoryHelpers() {
  /**
   * Ensures the content has the correct structure for its category type
   */
  const ensureContentStructure = (type: WorldCategoryType, content: Json | null): Json => {
    console.log(`Ensuring content structure for type: ${type}`);
    
    // If content is null or empty, create default structure
    if (!content || Object.keys(content as object).length === 0) {
      console.log(`Creating empty content for type ${type}`);
      return getEmptyCategoryContent(type);
    }
    
    // Make sure content is an object, not a primitive
    if (typeof content !== 'object' || content === null) {
      console.log(`Content is not an object, creating default structure for ${type}`);
      return getEmptyCategoryContent(type);
    }
    
    let processedContent = { ...content } as Record<string, any>;
    
    // Apply type-specific structure checks and fixes
    switch (type) {
      case 'geography':
        if (!processedContent.countries) {
          processedContent.countries = [];
        } else if (Array.isArray(processedContent.countries)) {
          // Ensure all special properties are preserved in countries array
          processedContent.countries = processedContent.countries.map(
            country => preserveImageProperties(country)
          );
        } else {
          // If countries is not an array, reset it
          processedContent.countries = [];
        }
        break;
        
      case 'politics':
        if (!processedContent.systems) {
          processedContent.systems = [];
        } else if (Array.isArray(processedContent.systems)) {
          // Ensure all special properties are preserved in systems array
          processedContent.systems = processedContent.systems.map(
            system => preserveImageProperties(system)
          );
        } else {
          // If systems is not an array, reset it
          processedContent.systems = [];
        }
        break;
        
      case 'economy':
        if (!processedContent.entities) {
          processedContent.entities = [];
        } else if (Array.isArray(processedContent.entities)) {
          // Ensure all special properties are preserved in entities array
          processedContent.entities = processedContent.entities.map(
            entity => preserveImageProperties(entity)
          );
        } else {
          // If entities is not an array, reset it
          processedContent.entities = [];
        }
        break;
        
      case 'society':
        if (!processedContent.groups) {
          processedContent.groups = [];
        } else if (Array.isArray(processedContent.groups)) {
          // Ensure all special properties are preserved in groups array
          processedContent.groups = processedContent.groups.map(
            group => preserveImageProperties(group)
          );
        } else {
          // If groups is not an array, reset it
          processedContent.groups = [];
        }
        break;
        
      case 'culture':
        if (!processedContent.elements) {
          processedContent.elements = [];
        } else if (Array.isArray(processedContent.elements)) {
          // Ensure all special properties are preserved in elements array
          processedContent.elements = processedContent.elements.map(
            element => preserveImageProperties(element)
          );
        } else {
          // If elements is not an array, reset it
          processedContent.elements = [];
        }
        break;
        
      default:
        // For other types, just ensure it's an object
        processedContent = typeof content === 'object' ? content as Record<string, any> : {};
    }
    
    console.log(`Ensured content structure:`, processedContent);
    return processedContent as Json;
  };
  
  return { ensureContentStructure };
}
