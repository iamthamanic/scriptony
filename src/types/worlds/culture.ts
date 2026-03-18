
export interface CultureElement {
  id: string;
  name: string;
  description?: string;
  category?: string;
  significance?: string;
  element_type?: string;
  customFields: CustomField[];
  [key: string]: unknown; // Index signature for Json compatibility
}

export interface CultureContent {
  elements: CultureElement[];
  [key: string]: unknown; // Index signature for Json compatibility
}

export const createEmptyCultureContent = (): CultureContent => ({
  elements: []
});
