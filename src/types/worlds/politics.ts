
export interface Leader {
  id: string;
  name: string;
  title: string;
  image_url?: string;
  description?: string;
  customFields?: CustomField[];
  [key: string]: unknown; // Index signature for Json compatibility
}

export interface PoliticalSystem {
  id: string;
  name: string;
  description?: string;
  structure?: string;
  leaders?: Leader[];
  customFields: CustomField[];
  government_type?: string;
  [key: string]: unknown; // Index signature for Json compatibility
}

export interface PoliticsContent {
  systems: PoliticalSystem[];
  [key: string]: unknown; // Index signature for Json compatibility
}

export const createEmptyPoliticsContent = (): PoliticsContent => ({
  systems: []
});
