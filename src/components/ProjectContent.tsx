
import React from "react";
import ProjectHeader from "./ProjectHeader";
import CharacterList from "./CharacterList";
import SceneList from "./SceneList";
import EpisodeList from "./EpisodeList";
import EmptyState from "./EmptyState";
import ScenePdfExport from "./ScenePdfExport";
import { Character, Project, Scene, EditCharacterFormData, Episode } from "../types";
import { useToast } from "@/hooks/use-toast";

interface ProjectContentProps {
  project: Project;
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
}

const ProjectContent = ({
  project,
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
  onDeleteEpisode
}: ProjectContentProps) => {
  const { toast } = useToast();

  const handleExportScenePDF = (scene: Scene) => {
    toast({
      title: "Generating PDF",
      description: `Preparing Scene ${scene.sceneNumber} for export...`,
      duration: 2000
    });
  };

  return (
    <div className="animate-fade-in">
      <ProjectHeader 
        project={project} 
        onNewScene={onNewScene}
        onEditProject={onEditProject}
        onNewCharacter={onNewCharacter}
        onDeleteProject={onDeleteProject}
        onNewEpisode={project.type === 'series' ? onNewEpisode : undefined}
      />
      
      {project.characters.length > 0 && (
        <CharacterList 
          characters={project.characters} 
          onNewCharacter={onNewCharacter}
          onEditCharacter={onEditCharacter}
          onDeleteCharacter={onDeleteCharacter}
        />
      )}
      
      {/* Display Episodes for series projects */}
      {project.type === 'series' && (
        <>
          {project.episodes && project.episodes.length > 0 ? (
            <EpisodeList
              episodes={project.episodes}
              onNewEpisode={onNewEpisode}
              onEditEpisode={onEditEpisode}
              onDeleteEpisode={onDeleteEpisode}
            />
          ) : (
            <EmptyState
              title="No Episodes Yet"
              description={`Start by adding your first episode to ${project.title}`}
              buttonText="Create First Episode"
              onClick={onNewEpisode}
            />
          )}
        </>
      )}
      
      {project.scenes.length > 0 ? (
        <SceneList 
          scenes={project.scenes} 
          onEditScene={onEditScene}
          onExportPDF={handleExportScenePDF}
          onDeleteScene={onDeleteScene}
          characters={project.characters}
        />
      ) : (
        <EmptyState
          title="No Scenes Yet"
          description={`Start by adding your first scene to ${project.title}`}
          buttonText="Create First Scene"
          onClick={onNewScene}
        />
      )}
      
      {/* PDF Export Component (hidden) */}
      {project.scenes.map(scene => (
        <div key={scene.id} className="hidden">
          <ScenePdfExport scene={scene} project={project} />
        </div>
      ))}
    </div>
  );
};

export default ProjectContent;
