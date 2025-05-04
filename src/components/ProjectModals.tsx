
import React from "react";
import NewProjectModal from "./NewProjectModal";
import EditProjectModal from "./EditProjectModal";
import NewCharacterModal from "./NewCharacterModal";
import NewSceneModal from "./NewSceneModal";
import EpisodeModal from "./episodes/EpisodeModal";
import { Project, Scene, NewProjectFormData, NewSceneFormData, EditProjectFormData, NewCharacterFormData, Episode, NewEpisodeFormData, EditEpisodeFormData } from "../types";

interface ProjectModalsProps {
  isNewProjectModalOpen: boolean;
  isEditProjectModalOpen: boolean;
  isNewSceneModalOpen: boolean;
  isNewCharacterModalOpen: boolean;
  isEpisodeModalOpen: boolean;
  onCloseNewProject: () => void;
  onCloseEditProject: () => void;
  onCloseNewScene: () => void;
  onCloseNewCharacter: () => void;
  onCloseEpisodeModal: () => void;
  onCreateProject: (data: NewProjectFormData) => void;
  onEditProject: (data: EditProjectFormData) => void;
  onCreateScene: (data: NewSceneFormData) => void;
  onCreateCharacter: (data: NewCharacterFormData) => void;
  onCreateOrEditEpisode: (data: NewEpisodeFormData | EditEpisodeFormData) => void;
  selectedProject: Project | null;
  editingScene: Scene | null;
  editingEpisode: Episode | null;
}

const ProjectModals = ({
  isNewProjectModalOpen,
  isEditProjectModalOpen,
  isNewSceneModalOpen,
  isNewCharacterModalOpen,
  isEpisodeModalOpen,
  onCloseNewProject,
  onCloseEditProject,
  onCloseNewScene,
  onCloseNewCharacter,
  onCloseEpisodeModal,
  onCreateProject,
  onEditProject,
  onCreateScene,
  onCreateCharacter,
  onCreateOrEditEpisode,
  selectedProject,
  editingScene,
  editingEpisode
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
      
      <EpisodeModal
        isOpen={isEpisodeModalOpen}
        onClose={onCloseEpisodeModal}
        onSubmit={onCreateOrEditEpisode}
        episode={editingEpisode}
        lastEpisodeNumber={
          selectedProject.episodes && selectedProject.episodes.length > 0
            ? Math.max(...selectedProject.episodes.map(e => e.number))
            : 0
        }
      />
    </>
  );
};

export default ProjectModals;
