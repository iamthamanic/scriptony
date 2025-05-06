
import React, { useState } from 'react';
import { Character } from '../types';
import { Button } from "@/components/ui/button";
import { UserPlus, Users, Edit, Trash2 } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader,
  CardFooter
} from '@/components/ui/card';
import EditCharacterModal, { EditCharacterFormData } from './EditCharacterModal';
import DeleteCharacterDialog from './DeleteCharacterDialog';

interface CharacterListProps {
  characters: Character[];
  onNewCharacter: () => void;
  onEditCharacter: (character: Character) => void;
  onDeleteCharacter: (character: Character) => void;
}

const CharacterList = ({ 
  characters, 
  onNewCharacter, 
  onEditCharacter,
  onDeleteCharacter 
}: CharacterListProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [characterToDelete, setCharacterToDelete] = useState<Character | null>(null);

  const handleEditClick = (character: Character) => {
    setEditingCharacter(character);
  };

  const handleEditSubmit = (data: EditCharacterFormData) => {
    if (editingCharacter) {
      onEditCharacter(editingCharacter);
      setEditingCharacter(null);
    }
  };

  const handleDeleteClick = (character: Character) => {
    setCharacterToDelete(character);
  };

  const handleConfirmDelete = () => {
    if (characterToDelete) {
      onDeleteCharacter(characterToDelete);
      setCharacterToDelete(null);
    }
  };

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
              <CardFooter className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDeleteClick(character)}
                  className="border-destructive text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEditClick(character)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Modals */}
      {editingCharacter && (
        <EditCharacterModal
          isOpen={!!editingCharacter}
          onClose={() => setEditingCharacter(null)}
          onSubmit={handleEditSubmit}
          character={editingCharacter}
        />
      )}

      {characterToDelete && (
        <DeleteCharacterDialog
          isOpen={!!characterToDelete}
          onClose={() => setCharacterToDelete(null)}
          onConfirm={handleConfirmDelete}
          character={characterToDelete}
        />
      )}
    </div>
  );
};

export default CharacterList;
