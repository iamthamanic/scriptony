
import React from 'react';
import { useProjectState } from '@/hooks/project/useProjectState';
import { useProjectModals } from '@/hooks/project/useProjectModals';
import { useFileUpload } from '@/hooks/project/useFileUpload';
import ProjectsContent from '@/components/projects/ProjectsContent';
import ProjectPageHeader from '@/components/projects/ProjectPageHeader';
import ProjectModals from '@/components/projects/ProjectModals';
import ProjectSelector from '@/components/ProjectSelector';
import ProjectHeader from '@/components/ProjectHeader';
import { EditCharacterFormData } from '@/components/EditCharacterModal';
import { Scene } from '@/types';

const ProjectsContainer = () => {
  // Get all project state from the hook
  const {
    projects,
    selectedProjectId,
    selectedProject,
    setSelectedProjectId,
    handleCreateProject,
    handleEditProject,
    handleDeleteProject,
    handleCreateCharacter,
    handleEditCharacter,
    handleDeleteCharacter,
    handleCreateEpisode,
    handleEditEpisode,
    handleDeleteEpisode,
    handleCreateScene,
    handleDeleteScene,
    isLoading
  } = useProjectState();

  // Get modal state management
  const {
    isNewProjectModalOpen,
    isEditProjectModalOpen,
    isNewSceneModalOpen,
    isNewCharacterModalOpen,
    isEpisodeModalOpen,
    editingScene,
    editingEpisode,
    selectedEpisodeId,
    setSelectedEpisodeId,
    handleNewProject,
    handleOpenEditProject,
    handleNewScene,
    handleEditScene,
    handleNewCharacter, 
    handleNewEpisode,
    handleEditEpisodeModal,
    closeNewProject,
    closeEditProject,
    closeNewScene,
    closeNewCharacter,
    closeEpisodeModal
  } = useProjectModals();

  // Get file upload handlers
  const { fileInputRef, handleFileChange } = useFileUpload();

  // Form submission handlers
  const handleCreateProjectSubmit = async (data: any) => {
    await handleCreateProject(data);
    closeNewProject();
  };
  
  const handleEditProjectSubmit = async (data: any) => {
    if (selectedProject) {
      await handleEditProject(data);
      closeEditProject();
    }
  };
  
  const handleCreateSceneSubmit = (data: any) => {
    handleCreateScene(data);
    closeNewScene();
  };
  
  const handleCreateCharacterSubmit = (data: any) => {
    handleCreateCharacter(data);
    closeNewCharacter();
  };
  
  const handleCreateOrEditEpisodeSubmit = (data: any) => {
    if (editingEpisode) {
      handleEditEpisode(editingEpisode.id, data);
    } else {
      handleCreateEpisode(data);
    }
    closeEpisodeModal();
  };

  // Function to handle editing an episode with the right episodes array
  const wrappedHandleEditEpisodeModal = (episodeId: string) => {
    if (selectedProject) {
      handleEditEpisodeModal(episodeId, selectedProject.episodes);
    }
  };

  // Fixed function to handle Scene edit properly
  const handleEditSceneWrapper = (scene: Scene) => {
    handleEditScene(scene);
  };

  return (
    <div className="container mx-auto p-4 pt-6">
      <ProjectPageHeader 
        onNewProject={handleNewProject}
        fileInputRef={fileInputRef}
        handleFileChange={handleFileChange}
      />
      
      {/* Show ProjectSelector only if we have projects */}
      {projects.length > 0 && (
        <div className="mb-8">
          <ProjectSelector
            projects={projects}
            selectedProjectId={selectedProjectId}
            onSelectProject={setSelectedProjectId}
          />
        </div>
      )}
      
      {/* Show ProjectHeader when a project is selected */}
      {selectedProject && (
        <ProjectHeader
          project={selectedProject}
          onNewScene={handleNewScene}
          onEditProject={handleOpenEditProject}
          onNewCharacter={handleNewCharacter}
          onDeleteProject={() => handleDeleteProject()}
          onNewEpisode={selectedProject.type === 'series' ? handleNewEpisode : undefined}
        />
      )}
      
      {/* Main project content */}
      <ProjectsContent
        isLoading={isLoading}
        projects={projects}
        selectedProjectId={selectedProjectId}
        selectedProject={selectedProject}
        onSelectProject={setSelectedProjectId}
        onNewScene={handleNewScene}
        onEditProject={handleOpenEditProject}
        onNewCharacter={handleNewCharacter}
        onDeleteProject={handleDeleteProject}
        onEditScene={handleEditSceneWrapper}
        onDeleteScene={handleDeleteScene}
        onEditCharacter={(characterId, data: EditCharacterFormData) => handleEditCharacter(characterId, data)}
        onDeleteCharacter={handleDeleteCharacter}
        onNewEpisode={handleNewEpisode}
        onEditEpisode={wrappedHandleEditEpisodeModal}
        onDeleteEpisode={handleDeleteEpisode}
        onNewProject={handleNewProject}
      />
      
      {/* Modals */}
      <ProjectModals
        isNewProjectModalOpen={isNewProjectModalOpen}
        isEditProjectModalOpen={isEditProjectModalOpen}
        isNewSceneModalOpen={isNewSceneModalOpen}
        isNewCharacterModalOpen={isNewCharacterModalOpen}
        isEpisodeModalOpen={isEpisodeModalOpen}
        onCloseNewProject={closeNewProject}
        onCloseEditProject={closeEditProject}
        onCloseNewScene={closeNewScene}
        onCloseNewCharacter={closeNewCharacter}
        onCloseEpisodeModal={closeEpisodeModal}
        onCreateProject={handleCreateProjectSubmit}
        onEditProject={handleEditProjectSubmit}
        onCreateScene={handleCreateSceneSubmit}
        onCreateCharacter={handleCreateCharacterSubmit}
        onCreateOrEditEpisode={handleCreateOrEditEpisodeSubmit}
        selectedProject={selectedProject}
        editingScene={editingScene}
        editingEpisode={editingEpisode}
      />
    </div>
  );
};

export default ProjectsContainer;
