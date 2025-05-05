
import { Json } from "@/integrations/supabase/types";

/**
 * Helper to preserve image URLs and other special properties during JSON transformations
 */
export const preserveImageProperties = (obj: any): any => {
  if (!obj) return obj;
  
  // For arrays, process each item
  if (Array.isArray(obj)) {
    return obj.map(item => preserveImageProperties(item));
  }
  
  // For objects, preserve special properties and process nested objects
  if (typeof obj === 'object') {
    const result = { ...obj };
    
    // List of special properties to explicitly preserve
    const specialProperties = [
      'flag_url', 
      'cover_image_url', 
      'image_url', 
      'symbol_image_url'
    ];
    
    // Ensure special properties are preserved
    for (const prop of specialProperties) {
      if (obj[prop] !== undefined) {
        console.log(`Preserving ${prop}:`, obj[prop]);
        result[prop] = obj[prop];
      }
    }
    
    // Process nested objects
    for (const key in result) {
      if (typeof result[key] === 'object' && result[key] !== null) {
        result[key] = preserveImageProperties(result[key]);
      }
    }
    
    return result;
  }
  
  // Return primitives as is
  return obj;
};

/**
 * Safely serialize and deserialize JSON while preserving image URLs
 */
export const safeJsonTransform = (data: any): any => {
  try {
    // First serialize to JSON string
    const jsonString = JSON.stringify(data);
    
    // Then parse back to object
    const parsed = JSON.parse(jsonString);
    
    // Apply property preservation
    return preserveImageProperties(parsed);
  } catch (error) {
    console.error('Error in safeJsonTransform:', error);
    return data; // Return original data if transformation fails
  }
};
