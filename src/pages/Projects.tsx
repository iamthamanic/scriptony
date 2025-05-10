
import React, { useState, useRef } from 'react';
import { useProjectState } from '@/hooks/project/useProjectState';
import ProjectsContent from '@/components/projects/ProjectsContent';
import ProjectPageHeader from '@/components/projects/ProjectPageHeader';
import ProjectModals from '@/components/ProjectModals';
import ProjectSelector from '@/components/ProjectSelector';
import ProjectHeader from '@/components/ProjectHeader';
import { Scene, Episode } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { EditCharacterFormData } from '@/components/EditCharacterModal';

const Projects = () => {
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

  // Modal states
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [isNewSceneModalOpen, setIsNewSceneModalOpen] = useState(false);
  const [isNewCharacterModalOpen, setIsNewCharacterModalOpen] = useState(false);
  const [isEpisodeModalOpen, setIsEpisodeModalOpen] = useState(false);
  
  // Editing states
  const [editingScene, setEditingScene] = useState<Scene | null>(null);
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<string | null>(null);

  // File upload references
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  // Modal handlers
  const handleNewProject = () => {
    setIsNewProjectModalOpen(true);
  };
  
  const handleEditProject = () => {
    setIsEditProjectModalOpen(true);
  };
  
  const handleNewScene = () => {
    setEditingScene(null);
    setIsNewSceneModalOpen(true);
  };
  
  const handleEditScene = (scene: Scene) => {
    setEditingScene(scene);
    setIsNewSceneModalOpen(true);
  };
  
  const handleNewCharacter = () => {
    setIsNewCharacterModalOpen(true);
  };
  
  const handleNewEpisode = () => {
    setEditingEpisode(null);
    setIsEpisodeModalOpen(true);
  };
  
  const handleEditEpisodeModal = (episodeId: string) => {
    const episode = selectedProject?.episodes.find(ep => ep.id === episodeId);
    if (episode) {
      setEditingEpisode(episode);
      setIsEpisodeModalOpen(true);
    }
  };

  // Form submission handlers
  const handleCreateProjectSubmit = async (data: any) => {
    await handleCreateProject(data);
    setIsNewProjectModalOpen(false);
  };
  
  const handleEditProjectSubmit = async (data: any) => {
    if (selectedProject) {
      await handleEditProject(selectedProject.id, data);
      setIsEditProjectModalOpen(false);
    }
  };
  
  const handleCreateSceneSubmit = (data: any) => {
    handleCreateScene(data);
    setIsNewSceneModalOpen(false);
  };
  
  const handleCreateCharacterSubmit = (data: any) => {
    handleCreateCharacter(data);
    setIsNewCharacterModalOpen(false);
  };
  
  const handleCreateOrEditEpisodeSubmit = (data: any) => {
    if (editingEpisode) {
      handleEditEpisode(editingEpisode.id, data);
    } else {
      handleCreateEpisode(data);
    }
    setIsEpisodeModalOpen(false);
  };

  // File upload handler
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Show a toast notification that script analysis is not implemented yet
    toast({
      title: "Script Analysis",
      description: "Script analysis functionality is coming soon.",
      duration: 3000
    });
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
          onEditProject={handleEditProject}
          onNewCharacter={handleNewCharacter}
          onDeleteProject={() => handleDeleteProject(selectedProject.id)}
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
        onEditProject={handleEditProject}
        onNewCharacter={handleNewCharacter}
        onDeleteProject={handleDeleteProject}
        onEditScene={handleEditScene}
        onDeleteScene={handleDeleteScene}
        onEditCharacter={(characterId, data: EditCharacterFormData) => handleEditCharacter(characterId, data)}
        onDeleteCharacter={handleDeleteCharacter}
        onNewEpisode={handleNewEpisode}
        onEditEpisode={handleEditEpisodeModal}
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
        onCloseNewProject={() => setIsNewProjectModalOpen(false)}
        onCloseEditProject={() => setIsEditProjectModalOpen(false)}
        onCloseNewScene={() => setIsNewSceneModalOpen(false)}
        onCloseNewCharacter={() => setIsNewCharacterModalOpen(false)}
        onCloseEpisodeModal={() => setIsEpisodeModalOpen(false)}
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

export default Projects;
