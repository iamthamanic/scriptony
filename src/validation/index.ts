
/**
 * This file exports common validation utilities and re-exports all schemas
 */
import { z } from "zod";

// Common validation patterns
export const MAX_TEXT_LENGTH = 1000;
export const MAX_TITLE_LENGTH = 100;
export const MAX_DESCRIPTION_LENGTH = 500;

// Common validation schemas
export const basicTextSchema = z.string().trim().max(MAX_TEXT_LENGTH);
export const titleSchema = z.string().trim().min(1, "Titel ist erforderlich").max(MAX_TITLE_LENGTH);
export const descriptionSchema = z.string().trim().max(MAX_DESCRIPTION_LENGTH);
export const optionalUrlSchema = z.string().url("Ungültige URL").or(z.literal("")).optional();

// Re-export all schemas
export * from "./projectSchemas";
export * from "./formSchemas";
