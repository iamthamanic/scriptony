import React from 'react';
import { Scene, Episode, Character } from '../types';
import SceneList from './scenes/SceneList';
import CharacterList from './characters/CharacterList';
import EpisodeList from './episodes/EpisodeList';
import NewSceneModal from './NewSceneModal';

interface ProjectContentProps {
  selectedProject: {
    id: string;
    type: string;
    scenes: Scene[];
    episodes: Episode[];
    characters: Character[];
  } | null;
  isNewSceneModalOpen: boolean;
  onCloseNewSceneModal: () => void;
  onCreateScene: (data: any) => void;
  onEditScene: (scene: Scene) => void;
  onDeleteScene: (scene: Scene) => void;
  editingScene: Scene | null;
  onEditCharacter: (character: Character) => void;
  onDeleteCharacter: (character: Character) => void;
  onEditEpisode: (episodeId: string) => void;
  onDeleteEpisode: (episode: Episode) => void;
  onNewEpisode: () => void;
  selectedEpisodeId: string | null;
  setSelectedEpisodeId: React.Dispatch<React.SetStateAction<string | null>>;
}

const ProjectContent = ({ 
  selectedProject,
  isNewSceneModalOpen,
  onCloseNewSceneModal,
  onCreateScene,
  onEditScene,
  onDeleteScene,
  editingScene,
  onEditCharacter,
  onDeleteCharacter,
  onEditEpisode,
  onDeleteEpisode,
  onNewEpisode,
  selectedEpisodeId,
  setSelectedEpisodeId
}: ProjectContentProps) => {

  const getLastSceneNumber = () => {
    if (!selectedProject || !selectedProject.scenes) return 0;
    return selectedProject.scenes.reduce((max, scene) => Math.max(max, scene.sceneNumber), 0);
  };

  return (
    <div className="flex-1 overflow-auto">
      {selectedProject ? (
        <div className="p-4">
          {/* Episode List */}
          {selectedProject.type === 'series' && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">Episodes</h2>
                <button onClick={onNewEpisode} className="px-4 py-2 bg-anime-purple text-white rounded hover:bg-anime-dark-purple">
                  New Episode
                </button>
              </div>
              <EpisodeList
                episodes={selectedProject.episodes}
                onEditEpisode={onEditEpisode}
                onDeleteEpisode={onDeleteEpisode}
                selectedEpisodeId={selectedEpisodeId}
                setSelectedEpisodeId={setSelectedEpisodeId}
              />
            </div>
          )}

          {/* Scene List */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">Scenes</h2>
              <button onClick={onCloseNewSceneModal} className="px-4 py-2 bg-anime-purple text-white rounded hover:bg-anime-dark-purple">
                New Scene
              </button>
            </div>
            <SceneList
              scenes={selectedProject.scenes}
              onEditScene={onEditScene}
              onDeleteScene={onDeleteScene}
              selectedEpisodeId={selectedEpisodeId}
            />
          </div>

          {/* Character List */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Characters</h2>
            <CharacterList
              characters={selectedProject.characters}
              onEditCharacter={onEditCharacter}
              onDeleteCharacter={onDeleteCharacter}
            />
          </div>
        </div>
      ) : (
        <div className="p-4 text-center text-gray-500">
          No project selected. Please select a project to view its content.
        </div>
      )}
      
      {/* Pass projectId to NewSceneModal */}
      {selectedProject && (
        <NewSceneModal
          isOpen={isNewSceneModalOpen}
          onClose={onCloseNewSceneModal}
          onSubmit={onCreateScene}
          projectType={selectedProject.type}
          lastSceneNumber={getLastSceneNumber()}
          editScene={editingScene}
          characters={selectedProject.characters || []}
          episodes={selectedProject.episodes || []}
          selectedEpisodeId={selectedEpisodeId}
          projectId={selectedProject.id}
        />
      )}
    </div>
  );
};

export default ProjectContent;
