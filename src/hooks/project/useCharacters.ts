
import { useToast } from "../use-toast";
import { Character, NewCharacterFormData, EditCharacterFormData } from "../../types";

export const useCharacters = (
  selectedProject: { id: string; characters: Character[] } | null,
  updateProjects: (projectId: string, updater: (project: any) => any) => void
) => {
  const { toast } = useToast();

  const handleCreateCharacter = (data: NewCharacterFormData) => {
    if (!selectedProject) return;

    const newCharacter: Character = {
      id: `c${selectedProject.characters.length + 1}`,
      name: data.name,
      role: data.role,
      description: data.description,
      projectId: selectedProject.id,
      avatar: data.avatar ? URL.createObjectURL(data.avatar) : undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    updateProjects(selectedProject.id, (project) => ({
      ...project,
      characters: [...project.characters, newCharacter],
      updatedAt: new Date()
    }));

    toast({
      title: "Character Added",
      description: `${data.name} has been added to the project.`,
      duration: 3000
    });
  };

  const handleEditCharacter = (characterId: string, data: EditCharacterFormData) => {
    if (!selectedProject) return;

    // Find the character to edit
    const characterToEdit = selectedProject.characters.find(c => c.id === characterId);
    if (!characterToEdit) return;

    // Create the updated character
    const updatedCharacter: Character = {
      ...characterToEdit,
      name: data.name,
      role: data.role,
      description: data.description,
      avatar: data.avatar ? URL.createObjectURL(data.avatar) : characterToEdit.avatar,
      updatedAt: new Date()
    };

    updateProjects(selectedProject.id, (project) => ({
      ...project,
      characters: project.characters.map(c => 
        c.id === characterId ? updatedCharacter : c
      ),
      updatedAt: new Date()
    }));

    toast({
      title: "Character Updated",
      description: `${data.name} has been updated successfully.`,
      duration: 3000
    });
  };

  const handleDeleteCharacter = (characterId: string) => {
    if (!selectedProject) return;

    // Find the character to delete
    const characterToDelete = selectedProject.characters.find(c => c.id === characterId);
    if (!characterToDelete) return;

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
  };

  return {
    handleCreateCharacter,
    handleEditCharacter,
    handleDeleteCharacter
  };
};
