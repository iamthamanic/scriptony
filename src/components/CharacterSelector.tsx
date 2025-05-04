
import React from 'react';
import { Character } from '../types';
import { Button } from "@/components/ui/button";
import { Check, User } from 'lucide-react';

interface CharacterSelectorProps {
  characters: Character[];
  selectedCharacterIds: string[];
  onSelectCharacter: (characterId: string) => void;
}

const CharacterSelector = ({ 
  characters, 
  selectedCharacterIds, 
  onSelectCharacter 
}: CharacterSelectorProps) => {
  if (characters.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Characters in scene:</h3>
      <div className="flex flex-wrap gap-2">
        {characters.map(character => (
          <Button 
            key={character.id} 
            variant={selectedCharacterIds.includes(character.id) ? "default" : "outline"} 
            size="sm"
            className={selectedCharacterIds.includes(character.id) ? "bg-anime-purple hover:bg-anime-dark-purple" : ""}
            onClick={() => onSelectCharacter(character.id)}
          >
            {selectedCharacterIds.includes(character.id) && <Check className="mr-1 h-3 w-3" />}
            {character.avatar ? (
              <span className="w-4 h-4 rounded-full overflow-hidden mr-1">
                <img 
                  src={character.avatar} 
                  alt={character.name}
                  className="w-full h-full object-cover"
                />
              </span>
            ) : (
              <User className="mr-1 h-3 w-3" />
            )}
            {character.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CharacterSelector;
