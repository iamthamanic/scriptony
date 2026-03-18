
// Geography specific types
export interface Location {
  id: string;
  name: string;
  description?: string;
  coordinates?: {
    x: number;
    y: number;
  };
  customFields: CustomField[];
  cover_image_url?: string;
  [key: string]: unknown; // Index signature for Json compatibility
}

export interface Country {
  id: string;
  name: string;
  description?: string;
  flag_url?: string;
  locations?: Location[];
  customFields: CustomField[];
  cover_image_url?: string;
  [key: string]: unknown; // Index signature for Json compatibility
}

export interface GeographyContent {
  countries: Country[];
  [key: string]: unknown; // Index signature for Json compatibility
}

export const createEmptyGeographyContent = (): GeographyContent => ({
  countries: [],
});
