
export interface SocialGroup {
  id: string;
  name: string;
  description?: string;
  population?: string;
  characteristics?: string[];
  customFields: CustomField[];
  [key: string]: unknown; // Index signature for Json compatibility
}

export interface SocietyContent {
  groups: SocialGroup[];
  [key: string]: unknown; // Index signature for Json compatibility
}

export const createEmptySocietyContent = (): SocietyContent => ({
  groups: []
});
