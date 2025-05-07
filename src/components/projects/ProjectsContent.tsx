
import React from 'react';
import ProjectContent from '../ProjectContent';
import { Character, Episode } from '../../types';
import { EditCharacterFormData } from '../EditCharacterModal';

interface ProjectsContentProps {
  projectId: string;
  characters: Character[];
  episodes: Episode[];
  onEditCharacter: (characterId: string, data: EditCharacterFormData) => void;
  onDeleteCharacter: (characterId: string) => void;
  onDeleteEpisode: (episodeId: string) => void;
}

export default function ProjectsContent({
  projectId,
  characters,
  episodes,
  onEditCharacter,
  onDeleteCharacter,
  onDeleteEpisode,
}: ProjectsContentProps) {
  const handleEditCharacter = (characterId: string, data: EditCharacterFormData) => {
    onEditCharacter(characterId, data);
  };

  const handleDeleteCharacter = (characterId: string) => {
    onDeleteCharacter(characterId);
  };

  const handleDeleteEpisode = (episodeId: string) => {
    onDeleteEpisode(episodeId);
  };

  return (
    <ProjectContent
      projectId={projectId}
      characters={characters}
      episodes={episodes}
      onEditCharacter={handleEditCharacter}
      onDeleteCharacter={handleDeleteCharacter}
      onDeleteEpisode={handleDeleteEpisode}
    />
  );
}
