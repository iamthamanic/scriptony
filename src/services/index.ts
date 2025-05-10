
// Re-export all services from their respective modules
export * from './projects';
export * from './characters';
// Don't export deleteScene here to avoid conflicts
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
  // deleteScene is already exported from './scenes', so we shouldn't re-export it here
  createCharacter, updateCharacter, deleteCharacter,
  createEpisode, updateEpisode, deleteEpisode,
  utils
} from './database';

// Export deleteScene from scenes module
export { deleteScene } from './scenes';
