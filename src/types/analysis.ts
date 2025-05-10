
import { Scene, Character, Project } from './index';

export interface AnalysisResult {
  title: string;
  type: string;
  logline?: string;
  genres?: string[];
  scenes?: Scene[];
  characters?: Character[];
  narrative_structure?: string;
  duration?: number;
}

export interface ScriptAnalysisOptions {
  extractCharacters?: boolean;
  extractScenes?: boolean;
  detectGenre?: boolean;
  suggestTitle?: boolean;
}
