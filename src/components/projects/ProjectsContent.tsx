
import React from 'react';
import ProjectContent from '../ProjectContent';
import { Character, Episode, Project, Scene } from '../../types';
import { EditCharacterFormData } from '../EditCharacterModal';

interface ProjectsContentProps {
  isLoading: boolean;
  projects: Project[];
  selectedProjectId: string | null;
  selectedProject: Project | null;
  onSelectProject: (projectId: string) => void;
  onNewScene: () => void;
  onEditProject: () => void;
  onNewCharacter: () => void;
  onDeleteProject: (projectId: string) => void;
  onEditScene: (scene: Scene) => void;
  onDeleteScene: (scene: Scene) => void;
  onEditCharacter: (characterId: string, data: EditCharacterFormData) => void;
  onDeleteCharacter: (characterId: string) => void;
  onNewEpisode: () => void;
  onEditEpisode: (episodeId: string) => void;
  onDeleteEpisode: (episodeId: string) => void;
  onNewProject: () => void;
}

export default function ProjectsContent({
  isLoading,
  projects,
  selectedProjectId,
  selectedProject,
  onSelectProject,
  onNewScene,
  onEditProject,
  onNewCharacter,
  onDeleteProject,
  onEditScene,
  onDeleteScene,
  onEditCharacter,
  onDeleteCharacter,
  onNewEpisode,
  onEditEpisode,
  onDeleteEpisode,
  onNewProject
}: ProjectsContentProps) {
  
  // No need for these wrapper functions anymore since props match
  // We're directly passing the props to ProjectContent component
  
  return selectedProject ? (
    <ProjectContent
      selectedProject={selectedProject}
      isNewSceneModalOpen={false}
      onCloseNewSceneModal={onNewScene}
      onCreateScene={() => {}}
      onEditScene={onEditScene}
      onDeleteScene={onDeleteScene}
      editingScene={null}
      onEditCharacter={onEditCharacter}
      onDeleteCharacter={onDeleteCharacter}
      onEditEpisode={onEditEpisode}
      onDeleteEpisode={onDeleteEpisode}
      onNewEpisode={onNewEpisode}
      selectedEpisodeId={null}
      setSelectedEpisodeId={() => {}}
    />
  ) : (
    <div className="p-4 text-center text-gray-500">
      {isLoading ? (
        <div>Loading projects...</div>
      ) : (
        <div>
          <p className="mb-4">No project selected. Please select or create a new project.</p>
          <button 
            onClick={onNewProject}
            className="px-4 py-2 bg-anime-purple text-white rounded hover:bg-anime-dark-purple"
          >
            Create New Project
          </button>
        </div>
      )}
    </div>
  );
}
