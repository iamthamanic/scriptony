
import { useState } from 'react';
import { World, WorldFormData, WorldCategory, WorldCategoryFormData, WorldCategoryType } from "@/types";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";
import { fetchWorlds, createWorld, updateWorld, deleteWorld } from "@/services/worlds";

export function useWorldsOperations(
  userId: string | undefined,
  worlds: World[],
  setWorlds: React.Dispatch<React.SetStateAction<World[]>>,
  selectedWorldId: string | null,
  selectedWorld: World | null,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedWorldId: React.Dispatch<React.SetStateAction<string | null>>,
  setIsNewWorldModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setIsEditWorldModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setIsDeleteWorldDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setIsCategoryModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedCategory: React.Dispatch<React.SetStateAction<WorldCategory | null>>,
  hasLoadedOnce: boolean,
  setHasLoadedOnce: React.Dispatch<React.SetStateAction<boolean>>
) {
  // Load worlds
  const loadWorlds = async () => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      
      const worldsData = await fetchWorlds(userId);
      
      // Convert date strings to Date objects and ensure type safety
      const convertedWorlds: World[] = worldsData.map(world => ({
        ...world,
        created_at: new Date(world.created_at),
        updated_at: new Date(world.updated_at),
        categories: world.categories.map(cat => ({
          ...cat,
          type: cat.type as WorldCategoryType, // Cast to ensure type safety
          created_at: new Date(cat.created_at),
          updated_at: new Date(cat.updated_at)
        }))
      }));
      
      setWorlds(convertedWorlds);
      setHasLoadedOnce(true);
    } catch (error) {
      console.error("Error fetching worlds:", error);
      toast.error("Failed to load worlds");
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new world
  const handleCreateWorld = async (data: WorldFormData) => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      
      const newWorld = await createWorld(userId, data);
      
      // Convert dates to Date objects
      const worldWithDates = {
        ...newWorld,
        created_at: new Date(newWorld.created_at),
        updated_at: new Date(newWorld.updated_at),
        categories: [] // New worlds have no categories yet
      };
      
      setWorlds(prev => [...prev, worldWithDates]);
      setIsNewWorldModalOpen(false);
      toast.success("World created successfully");
      
      // Select the new world
      setSelectedWorldId(newWorld.id);
    } catch (error) {
      console.error("Error creating world:", error);
      toast.error("Failed to create world");
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing world
  const handleUpdateWorld = async (data: WorldFormData) => {
    if (!userId || !selectedWorldId) return;
    
    try {
      setIsLoading(true);
      
      const updatedWorld = await updateWorld(userId, selectedWorldId, data);
      
      // Update state with the updated world
      setWorlds(prev => prev.map(world => 
        world.id === selectedWorldId 
          ? { 
              ...world, 
              ...updatedWorld, 
              created_at: world.created_at,
              updated_at: new Date(updatedWorld.updated_at)
            } 
          : world
      ));
      
      setIsEditWorldModalOpen(false);
      toast.success("World updated successfully");
    } catch (error) {
      console.error("Error updating world:", error);
      toast.error("Failed to update world");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a world
  const handleDeleteWorld = async () => {
    if (!userId || !selectedWorldId) return;
    
    try {
      setIsLoading(true);
      
      await deleteWorld(userId, selectedWorldId);
      
      // Remove the deleted world from state
      setWorlds(prev => prev.filter(world => world.id !== selectedWorldId));
      setSelectedWorldId(null);
      setIsDeleteWorldDialogOpen(false);
      toast.success("World deleted successfully");
    } catch (error) {
      console.error("Error deleting world:", error);
      toast.error("Failed to delete world");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    loadWorlds,
    handleCreateWorld,
    handleUpdateWorld,
    handleDeleteWorld
  };
}
