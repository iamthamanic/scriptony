
import { Scene, Character, Project } from './index';
import { Genre } from './genres';
import { NarrativeStructureType } from './narrativeStructures/types';

export interface AnalysisResult {
  title: string;
  type: string;
  logline?: string;
  genres?: Genre[];
  scenes?: Scene[];
  characters?: Character[];
  narrative_structure?: NarrativeStructureType;
  duration?: number;
}

export interface ScriptAnalysisOptions {
  extractCharacters?: boolean;
  extractScenes?: boolean;
  detectGenre?: boolean;
  suggestTitle?: boolean;
}
