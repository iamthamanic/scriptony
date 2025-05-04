
import React, { useState } from "react";
import AppHeader from "../components/AppHeader";
import ProjectSelector from "../components/ProjectSelector";
import ProjectContent from "../components/ProjectContent";
import ProjectModals from "../components/ProjectModals";
import EmptyState from "../components/EmptyState";
import { Scene } from "../types";
import { useProjectState } from "../hooks/useProjectState";

const Index = () => {
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
    handleCreateScene,
    handleDeleteScene
  } = useProjectState();

  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [isNewSceneModalOpen, setIsNewSceneModalOpen] = useState(false);
  const [isNewCharacterModalOpen, setIsNewCharacterModalOpen] = useState(false);
  const [editingScene, setEditingScene] = useState<Scene | null>(null);

  const handleEditScene = (scene: Scene) => {
    setEditingScene(scene);
    setIsNewSceneModalOpen(true);
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <header className="mb-8">
        <AppHeader onNewProject={() => setIsNewProjectModalOpen(true)} />
        
        {projects.length > 0 && (
          <ProjectSelector 
            projects={projects} 
            selectedProjectId={selectedProjectId} 
            onSelectProject={setSelectedProjectId} 
          />
        )}
      </header>
      
      {selectedProject ? (
        <ProjectContent 
          project={selectedProject}
          onNewScene={() => {
            setEditingScene(null);
            setIsNewSceneModalOpen(true);
          }}
          onEditProject={() => setIsEditProjectModalOpen(true)}
          onNewCharacter={() => setIsNewCharacterModalOpen(true)}
          onDeleteProject={handleDeleteProject}
          onEditScene={handleEditScene}
          onDeleteScene={handleDeleteScene}
          onEditCharacter={handleEditCharacter}
          onDeleteCharacter={handleDeleteCharacter}
        />
      ) : (
        <EmptyState
          title="No Projects Yet"
          description="Start by creating your first anime project"
          buttonText="Create First Project"
          onClick={() => setIsNewProjectModalOpen(true)}
        />
      )}
      
      <ProjectModals
        isNewProjectModalOpen={isNewProjectModalOpen}
        isEditProjectModalOpen={isEditProjectModalOpen}
        isNewSceneModalOpen={isNewSceneModalOpen}
        isNewCharacterModalOpen={isNewCharacterModalOpen}
        onCloseNewProject={() => setIsNewProjectModalOpen(false)}
        onCloseEditProject={() => setIsEditProjectModalOpen(false)}
        onCloseNewScene={() => {
          setIsNewSceneModalOpen(false);
          setEditingScene(null);
        }}
        onCloseNewCharacter={() => setIsNewCharacterModalOpen(false)}
        onCreateProject={handleCreateProject}
        onEditProject={handleEditProject}
        onCreateScene={(data) => {
          handleCreateScene(data, editingScene);
          setIsNewSceneModalOpen(false);
          setEditingScene(null);
        }}
        onCreateCharacter={handleCreateCharacter}
        selectedProject={selectedProject}
        editingScene={editingScene}
      />
    </div>
  );
};

export default Index;
