
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

/**
 * This type is now aligned with Character but allows File type for avatar
 */
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
