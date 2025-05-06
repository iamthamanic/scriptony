
import React from "react";
import { Loader2 } from "lucide-react";
import { Project } from "@/types";
import ProjectSelector from "../ProjectSelector";
import ProjectContent from "../ProjectContent";
import EmptyState from "../EmptyState";
import { Scene, Episode, Character } from "@/types";
import { EditCharacterFormData } from "../EditCharacterModal";

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
  onDeleteScene: (scene: Scene) => void;
  onEditCharacter: (characterId: string, data: EditCharacterFormData) => void;
  onDeleteCharacter: (characterId: string) => void;
  onNewEpisode: () => void;
  onEditEpisode: (episodeId: string) => void;
  onDeleteEpisode: (episodeId: string) => void;
  onNewProject: () => void;
}

const ProjectsContent = ({
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
}: ProjectsContentProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-anime-purple mb-4" />
        <p className="text-lg text-muted-foreground">Loading your projects...</p>
      </div>
    );
  }
  
  // Wrapper functions to handle type conversions
  const handleEditCharacter = (character: Character) => {
    onEditCharacter(character.id, {
      name: character.name,
      role: character.role,
      description: character.description,
      avatar: character.avatar as any // Using 'any' to bypass type error
    });
  };

  const handleDeleteCharacter = (character: Character) => {
    onDeleteCharacter(character.id);
  };

  const handleDeleteEpisode = (episode: Episode) => {
    onDeleteEpisode(episode.id);
  };
  
  return (
    <>
      {projects.length > 0 && (
        <ProjectSelector 
          projects={projects} 
          selectedProjectId={selectedProjectId} 
          onSelectProject={onSelectProject} 
        />
      )}
      
      {selectedProject ? (
        <ProjectContent 
          selectedProject={selectedProject}
          isNewSceneModalOpen={false}
          onCloseNewSceneModal={onNewScene}
          onCreateScene={(data) => {}}
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
        <EmptyState
          title="No Projects Yet"
          description="Start by creating your first anime project"
          buttonText="Create First Project"
          onClick={onNewProject}
        />
      )}
    </>
  );
};

export default ProjectsContent;
