/**
 * API Module
 * Replaces Supabase client with Fastify API
 */

export { apiClient, ApiClient, ApiResponse, ApiError } from "./client";
export { authApi, User, Session, AuthResponse } from "./auth";
export { storageApi, UploadResponse } from "./storage";
export {
  projectsApi,
  charactersApi,
  scenesApi,
  episodesApi,
  worldsApi,
  Project,
  Character,
  Scene,
  Episode,
  World,
  WorldCategory,
} from "./database";
