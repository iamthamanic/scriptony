
export interface EconomicEntity {
  id: string;
  name: string;
  description?: string;
  type: string;
  entity_type: string;
  value?: string;
  customFields: CustomField[];
  [key: string]: unknown; // Index signature for Json compatibility
}

export interface EconomyContent {
  entities: EconomicEntity[];
  [key: string]: unknown; // Index signature for Json compatibility
}

export const createEmptyEconomyContent = (): EconomyContent => ({
  entities: []
});
