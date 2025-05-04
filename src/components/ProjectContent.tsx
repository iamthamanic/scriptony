
import React, { useState } from "react";
import ProjectHeader from "./ProjectHeader";
import CharacterList from "./CharacterList";
import SceneList from "./SceneList";
import EmptyState from "./EmptyState";
import ScenePdfExport from "./ScenePdfExport";
import { Character, Project, Scene, EditCharacterFormData } from "../types";
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
  onDeleteCharacter
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
      />
      
      {project.characters.length > 0 && (
        <CharacterList 
          characters={project.characters} 
          onNewCharacter={onNewCharacter}
          onEditCharacter={onEditCharacter}
          onDeleteCharacter={onDeleteCharacter}
        />
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
