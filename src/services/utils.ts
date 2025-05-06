
import { Scene } from '@/types';

export const handleApiError = (error: any) => {
  console.error("API Error:", error);
  // Additional error handling logic can be added here
  return null;
};

export const convertDbSceneToApp = (dbScene: any): Scene => {
  return {
    id: dbScene.id,
    projectId: dbScene.project_id,
    episodeId: dbScene.episode_id,
    episodeTitle: dbScene.episode_title,
    sceneNumber: dbScene.scene_number,
    location: dbScene.location,
    timeOfDay: dbScene.time_of_day,
    timecodeStart: dbScene.timecode_start,
    timecodeEnd: dbScene.timecode_end,
    visualComposition: dbScene.visual_composition,
    lighting: dbScene.lighting,
    colorGrading: dbScene.color_grading,
    soundDesign: dbScene.sound_design,
    specialEffects: dbScene.special_effects,
    keyframeImage: dbScene.keyframe_image,
    description: dbScene.description,
    dialog: dbScene.dialog,
    characterDialogs: dbScene.character_dialogs,
    transitions: dbScene.transitions,
    productionNotes: dbScene.production_notes,
    emotionalSignificance: dbScene.emotional_significance,
    emotionalNotes: dbScene.emotional_notes,
    characterIds: dbScene.character_ids || [],
    colorReferences: dbScene.color_references,
    audioReferences: dbScene.audio_references,
    visualReferences: dbScene.visual_references,
    shots: dbScene.shots,
    createdAt: new Date(dbScene.created_at),
    updatedAt: new Date(dbScene.updated_at)
  };
};
