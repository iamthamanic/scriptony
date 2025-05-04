
import { z } from "zod";
import { titleSchema, descriptionSchema, basicTextSchema } from "./index";

// Character form validation
export const characterFormSchema = z.object({
  name: titleSchema.max(50, "Der Name darf maximal 50 Zeichen lang sein"),
  role: basicTextSchema.max(100, "Die Rolle darf maximal 100 Zeichen lang sein"),
  description: descriptionSchema,
  avatar: z.instanceof(File).optional()
});

// Episode form validation
export const episodeFormSchema = z.object({
  title: titleSchema.max(80, "Der Titel darf maximal 80 Zeichen lang sein"),
  number: z.number().int().positive().max(1000, "Die Episodennummer muss zwischen 1 und 1000 liegen"),
  description: descriptionSchema,
  coverImage: z.instanceof(File).optional()
});

// Timecode validation
export const timecodeSchema = z.string()
  .regex(/^([0-9]{2}):([0-5][0-9]):([0-5][0-9])$/, "Timecode muss im Format HH:MM:SS sein");

// Scene form validation
export const sceneFormSchema = z.object({
  episodeId: z.string().optional(),
  episodeTitle: basicTextSchema.optional(),
  sceneNumber: z.number().int().positive(),
  location: basicTextSchema,
  timeOfDay: z.enum(["morning", "day", "evening", "night"]),
  timecodeStart: timecodeSchema,
  timecodeEnd: timecodeSchema,
  visualComposition: basicTextSchema,
  lighting: basicTextSchema,
  colorGrading: basicTextSchema,
  soundDesign: basicTextSchema,
  specialEffects: basicTextSchema,
  keyframeImage: z.instanceof(File).optional(),
  description: descriptionSchema,
  dialog: basicTextSchema.max(5000),
  transitions: basicTextSchema,
  productionNotes: basicTextSchema,
  emotionalSignificance: z.enum([
    "introduction", 
    "buildup", 
    "climax", 
    "turning-point", 
    "resolution", 
    "finale", 
    "other"
  ]),
  emotionalNotes: basicTextSchema.optional(),
  characterIds: z.array(z.string())
});

// Type inference helpers
export type CharacterFormValidationSchema = z.infer<typeof characterFormSchema>;
export type EpisodeFormValidationSchema = z.infer<typeof episodeFormSchema>;
export type SceneFormValidationSchema = z.infer<typeof sceneFormSchema>;

// Export the auth schemas for backward compatibility
export * from '../validation/authSchemas';
