
export interface Character {
  id: string;
  name: string;
  role: string;
  description: string;
  projectId: string;
  avatar?: string | null;
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

export interface CharacterWithAvatarFile {
  id: string;
  name: string;
  role: string;
  description: string;
  projectId: string;
  avatar?: string | File | null;
  createdAt: Date;
  updatedAt: Date;
}
