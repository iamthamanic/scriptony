
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Character, CharacterDialog } from '../../types';
import { User, MessageSquare, Plus, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CharacterDialogEditorProps {
  characters: Character[];
  characterDialogs: CharacterDialog[];
  onChange: (dialogs: CharacterDialog[]) => void;
}

const CharacterDialogEditor = ({
  characters,
  characterDialogs,
  onChange
}: CharacterDialogEditorProps) => {
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>('');
  const [dialogText, setDialogText] = useState<string>('');
  
  const handleAddDialog = () => {
    if (!selectedCharacterId || !dialogText.trim()) return;
    
    onChange([
      ...characterDialogs,
      {
        characterId: selectedCharacterId,
        text: dialogText.trim()
      }
    ]);
    
    setDialogText('');
  };
  
  const handleUpdateDialog = (index: number, text: string) => {
    const updatedDialogs = [...characterDialogs];
    updatedDialogs[index].text = text;
    onChange(updatedDialogs);
  };
  
  const handleRemoveDialog = (index: number) => {
    const updatedDialogs = [...characterDialogs];
    updatedDialogs.splice(index, 1);
    onChange(updatedDialogs);
  };
  
  const getCharacterName = (characterId: string): string => {
    const character = characters.find(c => c.id === characterId);
    return character ? character.name : 'Unknown Character';
  };
  
  // Available characters (excluding those already with dialog)
  const availableCharacters = characters.filter(
    character => !characterDialogs.some(
      dialog => dialog.characterId === character.id
    )
  );
  
  return (
    <div className="space-y-4">
      <div className="bg-muted/40 p-3 rounded-md space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="w-full md:w-1/3">
            <Select
              value={selectedCharacterId}
              onValueChange={setSelectedCharacterId}
              disabled={availableCharacters.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select character" />
              </SelectTrigger>
              <SelectContent>
                {availableCharacters.map(character => (
                  <SelectItem key={character.id} value={character.id}>
                    {character.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1">
            <Textarea
              placeholder={availableCharacters.length === 0 
                ? "All characters have been assigned dialog" 
                : "Enter character dialog..."}
              value={dialogText}
              onChange={(e) => setDialogText(e.target.value)}
              disabled={!selectedCharacterId || availableCharacters.length === 0}
              className="min-h-[60px]"
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleAddDialog}
            disabled={!selectedCharacterId || !dialogText.trim()}
            className="bg-anime-purple hover:bg-anime-dark-purple flex items-center gap-1"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            Add Dialog
          </Button>
        </div>
      </div>
      
      {characterDialogs.length > 0 ? (
        <div className="space-y-2">
          {characterDialogs.map((dialog, index) => (
            <div key={index} className="bg-muted/20 p-3 rounded-md space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-anime-purple" />
                  <span className="font-medium">{getCharacterName(dialog.characterId)}</span>
                </div>
                
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => handleRemoveDialog(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              
              <Textarea
                value={dialog.text}
                onChange={(e) => handleUpdateDialog(index, e.target.value)}
                className="min-h-[60px]"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-muted/30 p-4 rounded-md text-center text-muted-foreground">
          <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-40" />
          <p>No character dialog added yet.</p>
          <p className="text-sm">Select a character and add their dialog above.</p>
        </div>
      )}
    </div>
  );
};

export default CharacterDialogEditor;
