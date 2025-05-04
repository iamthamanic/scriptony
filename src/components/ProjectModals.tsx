
import React from "react";
import NewProjectModal from "./NewProjectModal";
import EditProjectModal from "./EditProjectModal";
import NewCharacterModal from "./NewCharacterModal";
import NewSceneModal from "./NewSceneModal";
import { Project, Scene, NewProjectFormData, NewSceneFormData, EditProjectFormData, NewCharacterFormData } from "../types";

interface ProjectModalsProps {
  isNewProjectModalOpen: boolean;
  isEditProjectModalOpen: boolean;
  isNewSceneModalOpen: boolean;
  isNewCharacterModalOpen: boolean;
  onCloseNewProject: () => void;
  onCloseEditProject: () => void;
  onCloseNewScene: () => void;
  onCloseNewCharacter: () => void;
  onCreateProject: (data: NewProjectFormData) => void;
  onEditProject: (data: EditProjectFormData) => void;
  onCreateScene: (data: NewSceneFormData) => void;
  onCreateCharacter: (data: NewCharacterFormData) => void;
  selectedProject: Project | null;
  editingScene: Scene | null;
}

const ProjectModals = ({
  isNewProjectModalOpen,
  isEditProjectModalOpen,
  isNewSceneModalOpen,
  isNewCharacterModalOpen,
  onCloseNewProject,
  onCloseEditProject,
  onCloseNewScene,
  onCloseNewCharacter,
  onCreateProject,
  onEditProject,
  onCreateScene,
  onCreateCharacter,
  selectedProject,
  editingScene
}: ProjectModalsProps) => {
  if (!selectedProject) {
    return (
      <NewProjectModal 
        isOpen={isNewProjectModalOpen} 
        onClose={onCloseNewProject} 
        onSubmit={onCreateProject} 
      />
    );
  }

  return (
    <>
      <NewProjectModal 
        isOpen={isNewProjectModalOpen} 
        onClose={onCloseNewProject} 
        onSubmit={onCreateProject} 
      />
      
      <EditProjectModal
        isOpen={isEditProjectModalOpen}
        onClose={onCloseEditProject}
        onSubmit={onEditProject}
        project={selectedProject}
      />
      
      <NewCharacterModal
        isOpen={isNewCharacterModalOpen}
        onClose={onCloseNewCharacter}
        onSubmit={onCreateCharacter}
      />
      
      <NewSceneModal 
        isOpen={isNewSceneModalOpen} 
        onClose={onCloseNewScene} 
        onSubmit={onCreateScene} 
        projectType={selectedProject.type} 
        lastSceneNumber={
          editingScene 
            ? editingScene.sceneNumber 
            : selectedProject.scenes.length > 0 
              ? Math.max(...selectedProject.scenes.map(s => s.sceneNumber)) 
              : 0
        } 
        editScene={editingScene}
        characters={selectedProject.characters}
      />
    </>
  );
};

export default ProjectModals;
