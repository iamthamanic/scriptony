
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

// Modified to NOT extend Character since it has a different type for avatar
export interface CharacterWithAvatarFile {
  id: string;
  name: string;
  role: string;
  description: string;
  projectId: string;
  avatar?: string | File;
  createdAt: Date;
  updatedAt: Date;
}
