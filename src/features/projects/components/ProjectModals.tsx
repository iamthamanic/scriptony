
import React from 'react';
import NewProjectModal from '@/components/NewProjectModal';
import EditProjectModal from '@/components/EditProjectModal';
import NewSceneModal from '@/components/NewSceneModal';
import NewCharacterModal from '@/components/NewCharacterModal';
import EpisodeModal from '@/components/episodes/EpisodeModal';
import { Project, Scene, Episode } from '@/types';

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
  onCreateProject: (data: any) => void;
  onEditProject: (data: any) => void;
  onCreateScene: (data: any) => void;
  onCreateCharacter: (data: any) => void;
  onCreateOrEditEpisode: (data: any) => void;
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
  return (
    <>
      {/* New Project Modal */}
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={onCloseNewProject}
        onSubmit={onCreateProject}
      />
      
      {/* Edit Project Modal */}
      {selectedProject && (
        <EditProjectModal
          isOpen={isEditProjectModalOpen}
          onClose={onCloseEditProject}
          onSubmit={onEditProject}
          project={selectedProject}
        />
      )}
      
      {/* New Scene Modal */}
      {selectedProject && (
        <NewSceneModal
          isOpen={isNewSceneModalOpen}
          onClose={onCloseNewScene}
          onSubmit={onCreateScene}
          projectType={selectedProject.type}
          lastSceneNumber={selectedProject.scenes?.length > 0 
            ? Math.max(...selectedProject.scenes.map(s => s.sceneNumber))
            : 0}
          editScene={editingScene}
          characters={selectedProject.characters || []}
          episodes={selectedProject.episodes || []}
          selectedEpisodeId={null}
          projectId={selectedProject.id}
        />
      )}
      
      {/* New Character Modal */}
      {selectedProject && (
        <NewCharacterModal
          isOpen={isNewCharacterModalOpen}
          onClose={onCloseNewCharacter}
          onSubmit={onCreateCharacter}
        />
      )}
      
      {/* Episode Modal */}
      {selectedProject && (
        <EpisodeModal
          isOpen={isEpisodeModalOpen}
          onClose={onCloseEpisodeModal}
          onSubmit={onCreateOrEditEpisode}
          episode={editingEpisode}
        />
      )}
    </>
  );
};

export default ProjectModals;
