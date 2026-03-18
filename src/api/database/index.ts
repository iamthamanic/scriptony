/**
 * Database API Service
 * Replaces Supabase PostgreSQL with Fastify API
 */

import { apiClient } from "../client";

// Projects
export interface Project {
  id: string;
  userId: string;
  title: string;
  description?: string;
  type: "movie" | "series" | "book" | "audiobook";
  genre?: string[];
  narrativeStructure?: string;
  coverImageUrl?: string;
  status: "draft" | "in_progress" | "completed";
  createdAt: string;
  updatedAt: string;
}

export const projectsApi = {
  async getAll() {
    return apiClient.get<Project[]>("/projects");
  },

  async getById(id: string) {
    return apiClient.get<Project>(`/projects/${id}`);
  },

  async create(project: Omit<Project, "id" | "createdAt" | "updatedAt">) {
    return apiClient.post<Project>("/projects", project);
  },

  async update(id: string, updates: Partial<Project>) {
    return apiClient.put<Project>(`/projects/${id}`, updates);
  },

  async delete(id: string) {
    return apiClient.delete(`/projects/${id}`);
  },
};

// Characters
export interface Character {
  id: string;
  projectId: string;
  name: string;
  role: "protagonist" | "antagonist" | "supporting";
  description?: string;
  biography?: string;
  goals?: string;
  conflicts?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export const charactersApi = {
  async getByProject(projectId: string) {
    return apiClient.get<Character[]>(`/projects/${projectId}/characters`);
  },

  async create(character: Omit<Character, "id" | "createdAt" | "updatedAt">) {
    return apiClient.post<Character>("/characters", character);
  },

  async update(id: string, updates: Partial<Character>) {
    return apiClient.put<Character>(`/characters/${id}`, updates);
  },

  async delete(id: string) {
    return apiClient.delete(`/characters/${id}`);
  },
};

// Scenes
export interface Scene {
  id: string;
  projectId: string;
  episodeId?: string;
  title: string;
  description?: string;
  location?: string;
  timeOfDay?: string;
  orderIndex: number;
  emotionalSignificance?: string;
  keyframeImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export const scenesApi = {
  async getByProject(projectId: string) {
    return apiClient.get<Scene[]>(`/projects/${projectId}/scenes`);
  },

  async create(scene: Omit<Scene, "id" | "createdAt" | "updatedAt">) {
    return apiClient.post<Scene>("/scenes", scene);
  },

  async update(id: string, updates: Partial<Scene>) {
    return apiClient.put<Scene>(`/scenes/${id}`, updates);
  },

  async delete(id: string) {
    return apiClient.delete(`/scenes/${id}`);
  },
};

// Episodes
export interface Episode {
  id: string;
  projectId: string;
  title: string;
  episodeNumber: number;
  seasonNumber?: number;
  description?: string;
  coverImageUrl?: string;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

export const episodesApi = {
  async getByProject(projectId: string) {
    return apiClient.get<Episode[]>(`/projects/${projectId}/episodes`);
  },

  async create(episode: Omit<Episode, "id" | "createdAt" | "updatedAt">) {
    return apiClient.post<Episode>("/episodes", episode);
  },

  async update(id: string, updates: Partial<Episode>) {
    return apiClient.put<Episode>(`/episodes/${id}`, updates);
  },

  async delete(id: string) {
    return apiClient.delete(`/episodes/${id}`);
  },
};

// Worlds (Worldbuilding)
export interface World {
  id: string;
  userId: string;
  name: string;
  description?: string;
  coverImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorldCategory {
  id: string;
  worldId: string;
  name: string;
  type: string;
  icon?: string;
  content: Record<string, unknown>;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

export const worldsApi = {
  async getAll() {
    return apiClient.get<World[]>("/worlds");
  },

  async getById(id: string) {
    return apiClient.get<World & { categories: WorldCategory[] }>(
      `/worlds/${id}`
    );
  },

  async create(world: Omit<World, "id" | "createdAt" | "updatedAt">) {
    return apiClient.post<World>("/worlds", world);
  },

  async update(id: string, updates: Partial<World>) {
    return apiClient.put<World>(`/worlds/${id}`, updates);
  },

  async delete(id: string) {
    return apiClient.delete(`/worlds/${id}`);
  },

  // Categories
  async addCategory(
    worldId: string,
    category: Omit<WorldCategory, "id" | "worldId" | "createdAt" | "updatedAt">
  ) {
    return apiClient.post<WorldCategory>(
      `/worlds/${worldId}/categories`,
      category
    );
  },

  async updateCategory(id: string, updates: Partial<WorldCategory>) {
    return apiClient.put<WorldCategory>(`/worlds/categories/${id}`, updates);
  },

  async deleteCategory(id: string) {
    return apiClient.delete(`/worlds/categories/${id}`);
  },
};
