
import React, { useState } from "react";
import ProjectHeader from "./ProjectHeader";
import CharacterList from "./CharacterList";
import SceneList from "./SceneList";
import EpisodeList from "./episodes/EpisodeList";
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
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<string | null>(null);

  const handleExportScenePDF = (scene: Scene) => {
    toast({
      title: "Generating PDF",
      description: `Preparing Scene ${scene.sceneNumber} for export...`,
      duration: 2000
    });
  };

  const handleNewSceneClick = () => {
    // For series projects, require an episode selection before creating a scene
    if (project.type === 'series' && !selectedEpisodeId && project.episodes.length > 0) {
      toast({
        title: "Episode Required",
        description: "Please select an episode before creating a scene",
        duration: 3000
      });
      return;
    }
    
    onNewScene();
  };

  return (
    <div className="animate-fade-in">
      <ProjectHeader 
        project={project} 
        onNewScene={handleNewSceneClick}
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
              selectedEpisodeId={selectedEpisodeId}
              onSelectEpisode={setSelectedEpisodeId}
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
      
      {/* Filter scenes by episode for series projects */}
      {project.scenes.length > 0 ? (
        <SceneList 
          scenes={
            project.type === 'series' && selectedEpisodeId 
              ? project.scenes.filter(scene => scene.episodeId === selectedEpisodeId)
              : project.scenes
          }
          onEditScene={onEditScene}
          onExportPDF={handleExportScenePDF}
          onDeleteScene={onDeleteScene}
          characters={project.characters}
          showEpisodeFilter={project.type === 'series' && !selectedEpisodeId}
          episodes={project.episodes}
        />
      ) : (
        <EmptyState
          title={
            project.type === 'series' && selectedEpisodeId
              ? "No Scenes in This Episode Yet"
              : "No Scenes Yet"
          }
          description={
            project.type === 'series' && selectedEpisodeId
              ? `Start by adding your first scene to this episode`
              : `Start by adding your first scene to ${project.title}`
          }
          buttonText="Create First Scene"
          onClick={handleNewSceneClick}
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
