
// This file is now just re-exporting all functions from the separate services
// to maintain backwards compatibility with existing code.
// We're explicitly importing only what we want to re-export to avoid conflicts

import { createProject, deleteProject, updateProject } from './projects';
import { createScene, deleteScene } from './scenes';
import { createCharacter, updateCharacter, deleteCharacter } from './characters';
import { createEpisode, updateEpisode, deleteEpisode } from './episodes';
import { fetchUserProjects, fetchProjectDetails } from './projects/projectDetails';
import * as utils from './utils';

export { 
  createProject, deleteProject, updateProject,
  createScene, deleteScene,
  createCharacter, updateCharacter, deleteCharacter,
  createEpisode, updateEpisode, deleteEpisode,
  fetchUserProjects, fetchProjectDetails,
  utils
};
