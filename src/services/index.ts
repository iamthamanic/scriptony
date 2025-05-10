
// Re-export all services from their respective modules
export * from './projects';
export * from './characters';
// Export scenes without createScene to avoid conflicts
export { deleteScene } from './scenes';
export * from './episodes';
export * from './scriptAnalysis';
export * from './admin';
export * from './worlds';
export * from './storage';

// Export from database.ts last to avoid conflicts, but exclude createScene
// to prevent conflicts with the one from projects module
export { 
  fetchUserProjects, fetchProjectDetails, 
  deleteProject, updateProject,
  deleteScene,
  createCharacter, updateCharacter, deleteCharacter,
  createEpisode, updateEpisode, deleteEpisode,
  utils
} from './database';
