
import React, { useState } from 'react';
import { Character } from '../types';
import { Button } from "@/components/ui/button";
import { UserPlus, Users } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader 
} from '@/components/ui/card';

interface CharacterListProps {
  characters: Character[];
  onNewCharacter: () => void;
}

const CharacterList = ({ characters, onNewCharacter }: CharacterListProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-anime-purple" />
          <h2 className="text-xl font-bold">Characters ({characters.length})</h2>
        </div>
        <Button 
          onClick={onNewCharacter}
          className="bg-anime-purple hover:bg-anime-dark-purple transition-colors"
          size="sm"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          New Character
        </Button>
      </div>
      
      {characters.length === 0 ? (
        <div className="text-center py-10 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground">No characters added yet.</p>
          <Button 
            onClick={onNewCharacter} 
            variant="outline" 
            className="mt-3"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add First Character
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {characters.map(character => (
            <Card key={character.id} className="overflow-hidden">
              <CardHeader className="pb-2 flex flex-row items-center gap-3">
                {character.avatar && (
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-muted">
                    <img 
                      src={character.avatar} 
                      alt={character.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-lg">{character.name}</h3>
                  <p className="text-sm text-muted-foreground">{character.role}</p>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm line-clamp-2">
                  {character.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CharacterList;
