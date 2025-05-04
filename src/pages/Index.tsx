
import React, { useState } from "react";
import AppHeader from "../components/AppHeader";
import ProjectSelector from "../components/ProjectSelector";
import ProjectContent from "../components/ProjectContent";
import ProjectModals from "../components/ProjectModals";
import EmptyState from "../components/EmptyState";
import AccountSettings from "../components/AccountSettings";
import { Scene, Episode } from "../types";
import { useProjectState } from "../hooks/project/useProjectState";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

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
    handleDeleteScene,
    handleCreateEpisode,
    handleEditEpisode,
    handleDeleteEpisode,
    isLoading
  } = useProjectState();

  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [isNewSceneModalOpen, setIsNewSceneModalOpen] = useState(false);
  const [isNewCharacterModalOpen, setIsNewCharacterModalOpen] = useState(false);
  const [isEpisodeModalOpen, setIsEpisodeModalOpen] = useState(false);
  const [isAccountSettingsOpen, setIsAccountSettingsOpen] = useState(false);
  const [editingScene, setEditingScene] = useState<Scene | null>(null);
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<string | null>(null);
  const [accountName] = useState("Demo User"); // This would come from authentication in a real app
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const handleEditScene = (scene: Scene) => {
    setEditingScene(scene);
    setIsNewSceneModalOpen(true);
  };

  const handleNewEpisode = () => {
    setEditingEpisode(null);
    setIsEpisodeModalOpen(true);
  };

  const handleEditEpisodeClick = (episodeId: string) => {
    if (!selectedProject) return;
    const episode = selectedProject.episodes.find(e => e.id === episodeId);
    if (episode) {
      setEditingEpisode(episode);
      setIsEpisodeModalOpen(true);
    }
  };

  const handleCreateOrEditEpisode = (data) => {
    if (editingEpisode) {
      handleEditEpisode(editingEpisode.id, data);
    } else {
      handleCreateEpisode(data);
    }
    setIsEpisodeModalOpen(false);
    setEditingEpisode(null);
  };

  const handleNewScene = () => {
    setEditingScene(null);
    setIsNewSceneModalOpen(true);
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <header className="mb-8">
        <AppHeader 
          onNewProject={() => setIsNewProjectModalOpen(true)} 
          onOpenAccountSettings={() => setIsAccountSettingsOpen(true)}
          accountName={user?.email?.split('@')[0] || accountName}
        />
        
        {projects.length > 0 && !isLoading && (
          <ProjectSelector 
            projects={projects} 
            selectedProjectId={selectedProjectId} 
            onSelectProject={(projectId) => {
              setSelectedProjectId(projectId);
              setSelectedEpisodeId(null); // Reset selected episode when switching projects
            }} 
          />
        )}
      </header>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-anime-purple mb-4" />
          <p className="text-lg text-muted-foreground">Loading your projects...</p>
        </div>
      ) : selectedProject ? (
        <ProjectContent 
          project={selectedProject}
          onNewScene={handleNewScene}
          onEditProject={() => setIsEditProjectModalOpen(true)}
          onNewCharacter={() => setIsNewCharacterModalOpen(true)}
          onDeleteProject={handleDeleteProject}
          onEditScene={handleEditScene}
          onDeleteScene={handleDeleteScene}
          onEditCharacter={handleEditCharacter}
          onDeleteCharacter={handleDeleteCharacter}
          onNewEpisode={handleNewEpisode}
          onEditEpisode={handleEditEpisodeClick}
          onDeleteEpisode={handleDeleteEpisode}
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
        isEpisodeModalOpen={isEpisodeModalOpen}
        onCloseNewProject={() => setIsNewProjectModalOpen(false)}
        onCloseEditProject={() => setIsEditProjectModalOpen(false)}
        onCloseNewScene={() => {
          setIsNewSceneModalOpen(false);
          setEditingScene(null);
        }}
        onCloseNewCharacter={() => setIsNewCharacterModalOpen(false)}
        onCloseEpisodeModal={() => {
          setIsEpisodeModalOpen(false);
          setEditingEpisode(null);
        }}
        onCreateProject={handleCreateProject}
        onEditProject={handleEditProject}
        onCreateScene={(data) => {
          handleCreateScene(data, editingScene);
          setIsNewSceneModalOpen(false);
          setEditingScene(null);
        }}
        onCreateCharacter={handleCreateCharacter}
        onCreateOrEditEpisode={handleCreateOrEditEpisode}
        selectedProject={selectedProject}
        editingScene={editingScene}
        editingEpisode={editingEpisode}
      />
      
      <AccountSettings
        isOpen={isAccountSettingsOpen}
        onClose={() => setIsAccountSettingsOpen(false)}
        accountName={user?.email?.split('@')[0] || accountName}
      />
      
      <div className="mt-10 text-center">
        <button 
          onClick={handleSignOut} 
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Index;
