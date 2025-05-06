
import React, { useState, useRef } from "react";
import { useProjectState } from "../hooks/project/useProjectState";
import { useAuth } from "@/contexts/AuthContext";
import { Scene, Episode, EditProjectFormData, NewCharacterFormData, Character } from "../types";
import ScriptAnalysisResults from "@/components/script-analysis/ScriptAnalysisResults";
import ProjectModals from "../components/ProjectModals";
import ProjectPageHeader from "@/components/projects/ProjectPageHeader";
import ProjectsContent from "@/components/projects/ProjectsContent";
import { useScriptAnalysis } from "@/components/projects/ScriptAnalysisHandler";

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

  // Modal states
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [isNewSceneModalOpen, setIsNewSceneModalOpen] = useState(false);
  const [isNewCharacterModalOpen, setIsNewCharacterModalOpen] = useState(false);
  const [isEpisodeModalOpen, setIsEpisodeModalOpen] = useState(false);
  const [editingScene, setEditingScene] = useState<Scene | null>(null);
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<string | null>(null);
  
  // File upload reference
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Script analysis 
  const {
    isAnalyzing,
    analysisResult,
    isAnalysisResultsOpen,
    setIsAnalysisResultsOpen,
    handleFileChange
  } = useScriptAnalysis();

  // Handler functions
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

  const handleEditCharacterWrapper = (character: Character) => {
    handleEditCharacter(character.id, {
      name: character.name,
      role: character.role,
      description: character.description,
      avatar: character.avatar
    });
  };

  const handleDeleteCharacterWrapper = (character: Character) => {
    handleDeleteCharacter(character.id);
  };

  const handleDeleteEpisodeWrapper = (episode: Episode) => {
    handleDeleteEpisode(episode.id);
  };

  const handleCreateOrEditEpisode = (data: any) => {
    if (editingEpisode) {
      handleEditEpisode(editingEpisode.id, data);
    } else {
      handleCreateEpisode(data);
    }
    setIsEpisodeModalOpen(false);
    setEditingEpisode(null);
  };

  const handleCreateSceneWrapper = (data: any) => {
    handleCreateScene(data);
    setIsNewSceneModalOpen(false);
    setEditingScene(null);
  };

  const handleNewScene = () => {
    setEditingScene(null);
    setIsNewSceneModalOpen(true);
  };

  const handleNewProject = () => setIsNewProjectModalOpen(true);

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setSelectedEpisodeId(null); // Reset selected episode when switching projects
  };

  const handleCreateProjectWrapper = (data: any) => {
    handleCreateProject(data);
    setIsNewProjectModalOpen(false);
  };

  return (
    <div className="py-6 px-4 md:px-6 w-full">
      {/* Project header with actions */}
      <ProjectPageHeader 
        onNewProject={handleNewProject}
        fileInputRef={fileInputRef}
        handleFileChange={handleFileChange}
      />
      
      {/* Projects content */}
      <ProjectsContent
        isLoading={isLoading}
        projects={projects}
        selectedProjectId={selectedProjectId}
        selectedProject={selectedProject}
        onSelectProject={handleSelectProject}
        onNewScene={handleNewScene}
        onEditProject={() => setIsEditProjectModalOpen(true)}
        onNewCharacter={() => setIsNewCharacterModalOpen(true)}
        onDeleteProject={handleDeleteProject}
        onEditScene={handleEditScene}
        onDeleteScene={handleDeleteScene}
        onEditCharacter={handleEditCharacterWrapper}
        onDeleteCharacter={handleDeleteCharacterWrapper}
        onNewEpisode={handleNewEpisode}
        onEditEpisode={handleEditEpisodeClick}
        onDeleteEpisode={handleDeleteEpisodeWrapper}
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
        onCloseNewScene={() => {
          setIsNewSceneModalOpen(false);
          setEditingScene(null);
        }}
        onCloseNewCharacter={() => setIsNewCharacterModalOpen(false)}
        onCloseEpisodeModal={() => {
          setIsEpisodeModalOpen(false);
          setEditingEpisode(null);
        }}
        onCreateProject={handleCreateProjectWrapper}
        onEditProject={handleEditProject}
        onCreateScene={handleCreateSceneWrapper}
        onCreateCharacter={handleCreateCharacter}
        onCreateOrEditEpisode={handleCreateOrEditEpisode}
        selectedProject={selectedProject}
        editingScene={editingScene}
        editingEpisode={editingEpisode}
      />
      
      {/* Script analysis results */}
      <ScriptAnalysisResults
        isOpen={isAnalysisResultsOpen}
        onClose={() => setIsAnalysisResultsOpen(false)}
        analysisResult={analysisResult}
        onCreateProject={handleCreateProjectWrapper}
        isLoading={isAnalyzing}
      />
    </div>
  );
};

export default Index;
