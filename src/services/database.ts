
// This file is now just re-exporting all functions from the separate services
// to maintain backwards compatibility with existing code.
// We're explicitly importing only what we want to re-export to avoid conflicts

import { createProject, deleteProject, updateProject } from './projects';
import { createScene as createSceneOld, deleteScene } from './scenes';
import * as characters from './characters';
import * as episodes from './episodes';
import * as utils from './utils';

export { 
  createProject, deleteProject, updateProject,
  createSceneOld as createScene, deleteScene,
  characters, episodes, utils
};
