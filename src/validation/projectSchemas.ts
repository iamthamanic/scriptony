
import { z } from "zod";
import { basicTextSchema, titleSchema, descriptionSchema } from "./index";
import { Genre, ProjectType } from "@/types";
import type { NarrativeStructureType } from "@/types";

// Validate project types
export const projectTypeSchema = z.enum(["movie", "series", "short"] as const);

// Validate genres with proper typing
export const genreSchema = z.enum([
  "action", 
  "adventure", 
  "comedy", 
  "drama", 
  "fantasy", 
  "horror", 
  "mystery", 
  "romance", 
  "sci-fi",
  "slice-of-life",
  "supernatural",
  "thriller"
] as const);

// Validate narrative structure types 
export const narrativeStructureTypeSchema = z.enum([
  "none", 
  "hero-journey", 
  "three-act", 
  "save-the-cat", 
  "story-circle", 
  "tragedy", 
  "cyclical"
] as const) as z.ZodType<NarrativeStructureType>;

// Project creation schema
export const newProjectSchema = z.object({
  title: titleSchema,
  type: projectTypeSchema,
  logline: basicTextSchema.max(200, "Die Logline darf maximal 200 Zeichen lang sein"),
  genres: z.array(genreSchema).min(1, "Wähle mindestens ein Genre"),
  duration: z.number().int().positive().max(600, "Die maximale Dauer beträgt 600 Minuten"),
  inspirations: z.array(basicTextSchema),
  narrativeStructure: narrativeStructureTypeSchema.optional(),
  coverImage: z.instanceof(File).optional()
});

// Project edit schema
export const editProjectSchema = newProjectSchema;

// Type inference helpers
export type NewProjectValidationSchema = z.infer<typeof newProjectSchema>;
export type EditProjectValidationSchema = z.infer<typeof editProjectSchema>;
