/**
 * API Module
 * Replaces Supabase client with Fastify API
 */

export { apiClient, ApiClient } from "./client";
export type { ApiResponse, ApiError } from "./client";

export { authApi } from "./auth";
export type { User, Session, AuthResponse } from "./auth";

export { storageApi } from "./storage";
export type { UploadResponse } from "./storage";

export {
  projectsApi,
  charactersApi,
  scenesApi,
  episodesApi,
  worldsApi,
} from "./database";

export type {
  Project,
  Character,
  Scene,
  Episode,
  World,
  WorldCategory,
} from "./database";
