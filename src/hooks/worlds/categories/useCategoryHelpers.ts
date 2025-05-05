
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
    if (!content || (typeof content === 'object' && Object.keys(content as object).length === 0)) {
      console.log(`Creating empty content for type ${type}`);
      return getEmptyCategoryContent(type);
    }
    
    // Make sure content is an object
    if (typeof content !== 'object' || content === null) {
      console.log(`Content is not an object, creating default structure for ${type}`);
      return getEmptyCategoryContent(type);
    }
    
    // Safe casting for object operations
    const contentObj = content as Record<string, any>;
    
    // Apply type-specific structure checks and fixes
    switch (type) {
      case 'geography': 
        if (!contentObj.countries || !Array.isArray(contentObj.countries)) {
          // If countries doesn't exist or is not an array, create an empty array
          return { ...contentObj, countries: [] };
        } else {
          // Ensure all special properties are preserved in countries array
          return {
            ...contentObj,
            countries: contentObj.countries.map(country => preserveImageProperties(country))
          };
        }
        
      case 'politics':
        if (!contentObj.systems || !Array.isArray(contentObj.systems)) {
          // If systems doesn't exist or is not an array, create an empty array
          return { ...contentObj, systems: [] };
        } else {
          // Ensure all special properties are preserved in systems array
          return {
            ...contentObj,
            systems: contentObj.systems.map(system => preserveImageProperties(system))
          };
        }
        
      case 'economy':
        if (!contentObj.entities || !Array.isArray(contentObj.entities)) {
          // If entities doesn't exist or is not an array, create an empty array
          return { ...contentObj, entities: [] };
        } else {
          // Ensure all special properties are preserved in entities array
          return {
            ...contentObj,
            entities: contentObj.entities.map(entity => preserveImageProperties(entity))
          };
        }
        
      case 'society':
        if (!contentObj.groups || !Array.isArray(contentObj.groups)) {
          // If groups doesn't exist or is not an array, create an empty array
          return { ...contentObj, groups: [] };
        } else {
          // Ensure all special properties are preserved in groups array
          return {
            ...contentObj,
            groups: contentObj.groups.map(group => preserveImageProperties(group))
          };
        }
        
      case 'culture':
        if (!contentObj.elements || !Array.isArray(contentObj.elements)) {
          // If elements doesn't exist or is not an array, create an empty array
          return { ...contentObj, elements: [] };
        } else {
          // Ensure all special properties are preserved in elements array
          return {
            ...contentObj,
            elements: contentObj.elements.map(element => preserveImageProperties(element))
          };
        }
        
      default:
        // For other types, ensure it's a valid object
        return contentObj;
    }
  };
  
  return { ensureContentStructure };
}
