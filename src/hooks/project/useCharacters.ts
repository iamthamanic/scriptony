
import { useToast } from "../use-toast";
import { Character, CharacterWithAvatarFile, NewCharacterFormData, EditCharacterFormData } from "../../types";
import { createCharacter, updateCharacter, deleteCharacter } from "../../services/database";
import { useAuth } from "@/contexts/AuthContext";

export const useCharacters = (
  selectedProject: { id: string; characters: Character[] } | null,
  updateProjects: (projectId: string, updater: (project: any) => any) => void
) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const handleCreateCharacter = async (data: NewCharacterFormData) => {
    if (!selectedProject || !user) return;

    const newCharacterData = await createCharacter(selectedProject.id, data);

    if (newCharacterData) {
      updateProjects(selectedProject.id, (project) => ({
        ...project,
        characters: [...project.characters, newCharacterData],
        updatedAt: new Date()
      }));

      toast({
        title: "Character Added",
        description: `${data.name} has been added to the project.`,
        duration: 3000
      });
    }
  };

  const handleEditCharacter = async (characterId: string, data: EditCharacterFormData) => {
    if (!selectedProject || !user) return;

    // Find the character to edit
    const characterToEdit = selectedProject.characters.find(c => c.id === characterId);
    if (!characterToEdit) return;

    // Create update data with proper typing for API call
    const updateData: Partial<Character> = {
      name: data.name,
      role: data.role,
      description: data.description
    };
    
    // Only include avatar if it's a string (URL) or undefined
    // File objects will be handled by the updateCharacter function
    if (typeof data.avatar === 'string' || data.avatar === undefined) {
      updateData.avatar = data.avatar;
    }

    const success = await updateCharacter(characterId, updateData);

    if (success) {
      // Create the updated character with proper type handling
      const updatedCharacter: CharacterWithAvatarFile = {
        ...characterToEdit,
        name: data.name,
        role: data.role,
        description: data.description,
        avatar: data.avatar,
        updatedAt: new Date()
      };

      updateProjects(selectedProject.id, (project) => ({
        ...project,
        characters: project.characters.map(c => 
          c.id === characterId ? ({
            ...updatedCharacter,
            // Remove File object before storing in characters array
            avatar: typeof updatedCharacter.avatar === 'string' ? updatedCharacter.avatar : null
          } as Character) : c
        ),
        updatedAt: new Date()
      }));

      toast({
        title: "Character Updated",
        description: `${data.name} has been updated successfully.`,
        duration: 3000
      });
    }
  };

  const handleDeleteCharacter = async (characterId: string) => {
    if (!selectedProject || !user) return;

    // Find the character to delete
    const characterToDelete = selectedProject.characters.find(c => c.id === characterId);
    if (!characterToDelete) return;

    const success = await deleteCharacter(characterId);

    if (success) {
      updateProjects(selectedProject.id, (project) => {
        // Remove character from all scenes that reference it
        const updatedScenes = project.scenes.map(scene => ({
          ...scene,
          characterIds: scene.characterIds.filter(id => id !== characterId),
          updatedAt: new Date()
        }));

        return {
          ...project,
          characters: project.characters.filter(c => c.id !== characterId),
          scenes: updatedScenes,
          updatedAt: new Date()
        };
      });

      toast({
        title: "Character Deleted",
        description: `${characterToDelete.name} has been permanently deleted.`,
        variant: "destructive",
        duration: 3000
      });
    }
  };

  return {
    handleCreateCharacter,
    handleEditCharacter,
    handleDeleteCharacter
  };
};
