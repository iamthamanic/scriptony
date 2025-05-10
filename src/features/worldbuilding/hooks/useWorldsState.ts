
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { World, WorldCategory, NewWorldFormData, WorldCategoryFormData } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

type DeletionState = 'idle' | 'deleting' | 'completed';

export const useWorldsState = (userId?: string) => {
  const { toast } = useToast();
  
  const [worlds, setWorlds] = useState<World[]>([]);
  const [selectedWorldId, setSelectedWorldId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Modal states
  const [isNewWorldModalOpen, setIsNewWorldModalOpen] = useState<boolean>(false);
  const [isEditWorldModalOpen, setIsEditWorldModalOpen] = useState<boolean>(false);
  const [isDeleteWorldDialogOpen, setIsDeleteWorldDialogOpen] = useState<boolean>(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<WorldCategory | null>(null);
  const [deletionState, setDeletionState] = useState<DeletionState>('idle');
  
  // Get the selected world from the state
  const selectedWorld = worlds.find(world => world.id === selectedWorldId) || null;

  // Load worlds when the component mounts or userId changes
  const loadWorlds = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      console.log("Loading worlds for userId:", userId);
      
      // Fetch worlds
      const { data: worldsData, error: worldsError } = await supabase
        .from('worlds')
        .select('*')
        .eq('user_id', userId);
      
      if (worldsError) {
        throw worldsError;
      }
      
      // Fetch world categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('world_categories')
        .select('*');
      
      if (categoriesError) {
        throw categoriesError;
      }
      
      // Associate categories with their respective worlds
      const populatedWorlds = worldsData.map(world => ({
        ...world,
        categories: categoriesData
          .filter(category => category.world_id === world.id)
          .sort((a, b) => a.order_index - b.order_index)
      }));
      
      console.log("Loaded worlds:", populatedWorlds);
      setWorlds(populatedWorlds);
      
    } catch (error) {
      console.error("Error loading worlds:", error);
      toast({
        title: "Error",
        description: "Failed to load worlds",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [userId, toast]);

  // Create a new world
  const handleCreateWorld = async (data: NewWorldFormData) => {
    if (!userId) {
      toast({
        title: "Error",
        description: "User ID not found. Please sign in again.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Insert the new world into the database
      const { data: worldData, error: worldError } = await supabase
        .from('worlds')
        .insert({
          name: data.name,
          description: data.description,
          user_id: userId,
          // Process image uploading separately if needed
        })
        .select();
      
      if (worldError) {
        throw worldError;
      }
      
      if (worldData && worldData.length > 0) {
        // Add the new world to the state
        const newWorld: World = {
          ...worldData[0],
          categories: [] // New world has no categories yet
        };
        
        setWorlds(prev => [...prev, newWorld]);
        setSelectedWorldId(newWorld.id);
        toast({
          title: "Success",
          description: "World created successfully",
        });
      }
    } catch (error) {
      console.error("Error creating world:", error);
      toast({
        title: "Error",
        description: "Failed to create world",
        variant: "destructive",
      });
    }
  };

  // Update an existing world
  const handleUpdateWorld = async (data: NewWorldFormData) => {
    if (!selectedWorldId || !selectedWorld) {
      toast({
        title: "Error",
        description: "No world selected for updating",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Update the world in the database
      const { error: worldError } = await supabase
        .from('worlds')
        .update({
          name: data.name,
          description: data.description,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedWorldId);
      
      if (worldError) {
        throw worldError;
      }
      
      // Update the world in the state
      setWorlds(prev => 
        prev.map(world => 
          world.id === selectedWorldId 
            ? { 
                ...world, 
                name: data.name, 
                description: data.description 
              } 
            : world
        )
      );
      
      toast({
        title: "Success",
        description: "World updated successfully",
      });
    } catch (error) {
      console.error("Error updating world:", error);
      toast({
        title: "Error",
        description: "Failed to update world",
        variant: "destructive",
      });
    }
  };

  // Delete a world
  const handleDeleteWorld = async () => {
    if (!selectedWorldId || !selectedWorld) {
      toast({
        title: "Error",
        description: "No world selected for deletion",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setDeletionState('deleting');
      
      // Delete associated categories first
      if (selectedWorld.categories?.length > 0) {
        const { error: categoriesError } = await supabase
          .from('world_categories')
          .delete()
          .eq('world_id', selectedWorldId);
        
        if (categoriesError) {
          throw categoriesError;
        }
      }
      
      // Now delete the world
      const { error: worldError } = await supabase
        .from('worlds')
        .delete()
        .eq('id', selectedWorldId);
      
      if (worldError) {
        throw worldError;
      }
      
      // Update the state
      setWorlds(prev => prev.filter(world => world.id !== selectedWorldId));
      setSelectedWorldId('');
      
      toast({
        title: "Success",
        description: "World deleted successfully",
      });
      setDeletionState('completed');
    } catch (error) {
      console.error("Error deleting world:", error);
      toast({
        title: "Error",
        description: "Failed to delete world",
        variant: "destructive",
      });
      setDeletionState('idle'); // Reset to idle on error
    }
  };

  // Duplicate a world
  const handleDuplicateWorld = async () => {
    if (!selectedWorldId || !selectedWorld || !userId) {
      return;
    }
    
    try {
      // Create a new world with copied data
      const duplicatedWorldName = `${selectedWorld.name} (Copy)`;
      
      const { data: worldData, error: worldError } = await supabase
        .from('worlds')
        .insert({
          name: duplicatedWorldName,
          description: selectedWorld.description,
          user_id: userId,
          cover_image_url: selectedWorld.cover_image_url,
        })
        .select();
      
      if (worldError) throw worldError;
      
      if (!worldData || worldData.length === 0) {
        throw new Error("No data returned from world creation");
      }
      
      const newWorldId = worldData[0].id;
      
      // Duplicate categories
      if (selectedWorld.categories?.length > 0) {
        const categoriesToInsert = selectedWorld.categories.map(cat => ({
          name: cat.name,
          type: cat.type,
          world_id: newWorldId,
          content: cat.content,
          order_index: cat.order_index,
          icon: cat.icon,
        }));
        
        const { error: categoriesError } = await supabase
          .from('world_categories')
          .insert(categoriesToInsert);
        
        if (categoriesError) throw categoriesError;
      }
      
      // Reload worlds to get the updated data
      await loadWorlds();
      
      // Select the new world
      setSelectedWorldId(newWorldId);
      
      toast({
        title: "Success", 
        description: "World duplicated successfully"
      });
    } catch (error) {
      console.error("Error duplicating world:", error);
      toast({
        title: "Error",
        description: "Failed to duplicate world",
        variant: "destructive"
      });
    }
  };

  // Handle category operations
  const handleCategorySubmit = async (data: WorldCategoryFormData) => {
    if (!selectedWorldId) return;
    
    try {
      if (selectedCategory) {
        // Update existing category
        const { error } = await supabase
          .from('world_categories')
          .update({
            name: data.name,
            type: data.type,
            content: data.content || {},
            icon: data.icon,
            updated_at: new Date().toISOString(),
          })
          .eq('id', selectedCategory.id);
        
        if (error) throw error;
        
        // Update state
        setWorlds(prev => 
          prev.map(world => {
            if (world.id === selectedWorldId) {
              return {
                ...world,
                categories: world.categories.map(cat => 
                  cat.id === selectedCategory.id
                    ? {
                        ...cat,
                        name: data.name,
                        type: data.type,
                        content: data.content || {},
                        icon: data.icon,
                      }
                    : cat
                )
              };
            }
            return world;
          })
        );
        
        toast({
          title: "Success",
          description: "Category updated successfully",
        });
      } else {
        // Create new category
        const newCategory = {
          name: data.name,
          type: data.type,
          world_id: selectedWorldId,
          content: data.content || {},
          icon: data.icon,
          order_index: selectedWorld?.categories.length || 0,
        };
        
        const { data: categoryData, error } = await supabase
          .from('world_categories')
          .insert(newCategory)
          .select();
        
        if (error) throw error;
        
        if (categoryData && categoryData.length > 0) {
          // Update state
          setWorlds(prev => 
            prev.map(world => {
              if (world.id === selectedWorldId) {
                return {
                  ...world,
                  categories: [...world.categories, categoryData[0]]
                };
              }
              return world;
            })
          );
          
          toast({
            title: "Success",
            description: "Category created successfully",
          });
        }
      }
    } catch (error) {
      console.error("Error saving category:", error);
      toast({
        title: "Error",
        description: "Failed to save category",
        variant: "destructive",
      });
    }
  };

  // Delete a category
  const handleDeleteCategory = async (categoryId: string) => {
    if (!selectedWorldId) return;
    
    try {
      const { error } = await supabase
        .from('world_categories')
        .delete()
        .eq('id', categoryId);
      
      if (error) throw error;
      
      // Update state
      setWorlds(prev => 
        prev.map(world => {
          if (world.id === selectedWorldId) {
            return {
              ...world,
              categories: world.categories.filter(cat => cat.id !== categoryId)
            };
          }
          return world;
        })
      );
      
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    }
  };

  // Reorder categories
  const handleReorderCategories = async (reorderedCategories: WorldCategory[]) => {
    if (!selectedWorldId) return;
    
    try {
      // Update order_index for each category
      const updates = reorderedCategories.map((category, index) => 
        supabase
          .from('world_categories')
          .update({ order_index: index })
          .eq('id', category.id)
      );
      
      await Promise.all(updates);
      
      // Update state
      setWorlds(prev => 
        prev.map(world => {
          if (world.id === selectedWorldId) {
            return {
              ...world,
              categories: reorderedCategories.map((cat, index) => ({
                ...cat,
                order_index: index
              }))
            };
          }
          return world;
        })
      );
    } catch (error) {
      console.error("Error reordering categories:", error);
      toast({
        title: "Error",
        description: "Failed to reorder categories",
        variant: "destructive",
      });
    }
  };

  // Load worlds initially
  useEffect(() => {
    loadWorlds();
  }, [loadWorlds]);

  return {
    worlds,
    selectedWorld,
    selectedWorldId,
    isLoading,
    isNewWorldModalOpen,
    isEditWorldModalOpen,
    isDeleteWorldDialogOpen,
    isCategoryModalOpen,
    selectedCategory,
    deletionState,
    loadWorlds,
    setSelectedWorldId,
    setIsNewWorldModalOpen,
    setIsEditWorldModalOpen, 
    setIsDeleteWorldDialogOpen,
    setIsCategoryModalOpen,
    setSelectedCategory,
    handleCreateWorld,
    handleUpdateWorld,
    handleDeleteWorld,
    handleDuplicateWorld,
    handleCategorySubmit,
    handleDeleteCategory,
    handleReorderCategories,
  };
};
