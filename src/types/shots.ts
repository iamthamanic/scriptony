
import type { ShotType, CameraMovement, CameraPerspective } from './camera';

export interface Shot {
  id: string;
  sceneId: string;
  title: string;
  shotNumber: number;
  shotType: ShotType;
  cameraMovement: CameraMovement;
  cameraPerspective?: CameraPerspective;
  timecodeStart?: string;
  timecodeEnd?: string;
  description: string;
  image?: string;
  aiNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewShotFormData {
  title: string;
  shotNumber: number;
  shotType: ShotType;
  cameraMovement: CameraMovement;
  cameraPerspective?: CameraPerspective;
  timecodeStart?: string;
  timecodeEnd?: string;
  description: string;
  image?: File;
  aiNotes?: string;
}

export interface EditShotFormData {
  title: string;
  shotNumber: number;
  shotType: ShotType;
  cameraMovement: CameraMovement;
  cameraPerspective?: CameraPerspective;
  timecodeStart?: string;
  timecodeEnd?: string;
  description: string;
  image?: File;
  aiNotes?: string;
}
