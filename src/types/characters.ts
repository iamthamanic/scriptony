
export interface Character {
  id: string;
  name: string;
  role: string;
  description: string;
  projectId: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CharacterDialog {
  characterId: string;
  text: string;
}

export interface NewCharacterFormData {
  name: string;
  role: string;
  description: string;
  avatar?: File;
}

export interface EditCharacterFormData {
  name: string;
  role: string;
  description: string;
  avatar?: File | string;
}

// This is a utility type that helps us handle character avatar types in hooks
export interface CharacterWithAvatarFile extends Character {
  avatar?: string | File;
}

