
// Re-export all types from their respective files
export * from './projects';
export * from './genres';
export * from './scenes';
export * from './shots';
export * from './camera';
export * from './characters';
export * from './episodes';
export * from './references';
export * from './common';

// Export the NarrativeStructureType from the new module location
export type { NarrativeStructureType, StructureTemplate } from './narrativeStructures';
export { narrativeStructureOptions, narrativeStructureTemplates } from './narrativeStructures';
