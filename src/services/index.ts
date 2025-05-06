
// Main entry point for database services
// We're being careful to avoid duplicate exports

import { createProject, deleteProject, updateProject } from './projects';
import { createScene as projectsCreateScene } from './projects/createScene';
import { createScene as scenesCreateScene, deleteScene } from './scenes';
import * as characters from './characters';
import * as episodes from './episodes';
import * as utils from './utils';
import * as worlds from './worlds';
import * as scriptAnalysis from './scriptAnalysis';
import * as storage from './storage';

// Re-export with careful naming to avoid conflicts
export {
  createProject, deleteProject, updateProject,
  projectsCreateScene as createScene, // This is our preferred implementation
  scenesCreateScene as createSceneOld, // Keep this for backward compatibility
  deleteScene,
  characters, episodes, utils, worlds, scriptAnalysis, storage
};
