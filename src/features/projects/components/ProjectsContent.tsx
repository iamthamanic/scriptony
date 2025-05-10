
import React from 'react';
import { Project, Scene } from '@/types';
import { EditCharacterFormData } from '@/components/EditCharacterModal';

interface ProjectsContentProps {
  isLoading: boolean;
  projects: Project[];
  selectedProjectId: string | null;
  selectedProject: Project | null;
  onSelectProject: (projectId: string) => void;
  onNewScene: () => void;
  onEditProject: () => void;
  onNewCharacter: () => void;
  onDeleteProject: () => void;
  onEditScene: (scene: Scene) => void;
  onDeleteScene: (sceneId: string) => void;
  onEditCharacter: (characterId: string, data: EditCharacterFormData) => void;
  onDeleteCharacter: (characterId: string) => void;
  onNewEpisode: () => void;
  onEditEpisode: (episodeId: string) => void;
  onDeleteEpisode: (episodeId: string) => void;
  onNewProject: () => void;
}

// This is a stub component that would be expanded to include all the functionality
// of the original ProjectsContent component
const ProjectsContent: React.FC<ProjectsContentProps> = ({
  isLoading,
  projects,
  selectedProjectId,
  selectedProject,
  onSelectProject,
  onNewProject
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-anime-purple"></div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed rounded-lg">
        <h2 className="text-xl font-semibold mb-2">No projects yet</h2>
        <p className="text-muted-foreground mb-6">
          Create your first project to get started.
        </p>
        <button 
          onClick={onNewProject}
          className="bg-anime-purple hover:bg-anime-dark-purple text-white px-4 py-2 rounded"
        >
          Create Project
        </button>
      </div>
    );
  }

  if (!selectedProject) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Select a project</h2>
        <p className="text-muted-foreground">
          Choose a project from above or create a new one.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Project content would go here - scenes, characters, etc. */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {selectedProject.scenes.map(scene => (
          <div key={scene.id} className="border rounded p-4">
            <h3>Scene {scene.sceneNumber}</h3>
            <p>{scene.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsContent;
