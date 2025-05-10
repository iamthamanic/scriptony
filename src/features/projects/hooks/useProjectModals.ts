
import { useState } from 'react';
import { Scene, Episode } from '@/types';

export const useProjectModals = () => {
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

  // Modal handlers
  const handleNewProject = () => {
    setIsNewProjectModalOpen(true);
  };
  
  const handleOpenEditProject = () => {
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
  
  const handleEditEpisodeModal = (episodeId: string, episodes: Episode[]) => {
    const episode = episodes.find(ep => ep.id === episodeId);
    if (episode) {
      setEditingEpisode(episode);
      setIsEpisodeModalOpen(true);
    }
  };

  return {
    // Modal states
    isNewProjectModalOpen,
    isEditProjectModalOpen,
    isNewSceneModalOpen,
    isNewCharacterModalOpen,
    isEpisodeModalOpen,
    
    // Editing states
    editingScene,
    editingEpisode,
    selectedEpisodeId,
    setSelectedEpisodeId,
    
    // Modal open handlers
    handleNewProject,
    handleOpenEditProject,
    handleNewScene,
    handleEditScene,
    handleNewCharacter,
    handleNewEpisode,
    handleEditEpisodeModal,
    
    // Modal close handlers
    closeNewProject: () => setIsNewProjectModalOpen(false),
    closeEditProject: () => setIsEditProjectModalOpen(false),
    closeNewScene: () => setIsNewSceneModalOpen(false),
    closeNewCharacter: () => setIsNewCharacterModalOpen(false),
    closeEpisodeModal: () => setIsEpisodeModalOpen(false)
  };
};

export default useProjectModals;
