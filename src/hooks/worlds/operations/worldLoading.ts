
import { useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { fetchUserWorlds } from "@/services/worlds";

export function useWorldLoading(
  userId: string | undefined,
  setWorlds: (worlds: any[]) => void,
  selectedWorldId: string | null,
  setSelectedWorldId: (id: string | null) => void,
  setIsLoading: (loading: boolean) => void,
  hasLoadedOnce: boolean = false,
  setHasLoadedOnce: (loaded: boolean) => void = () => {}
) {
  const { toast } = useToast();
  const lastOperationTimestampRef = useRef<number | null>(null);
  const deleteCompletedAtRef = useRef<number | null>(null);
  const loadingInProgressRef = useRef<boolean>(false);
  
  // Load worlds with cooldown protection
  const loadWorlds = async () => {
    console.log("loadWorlds called, userId:", userId, "hasLoadedOnce:", hasLoadedOnce);
    
    // Prevent loading immediately after deletion to avoid flicker
    if (deleteCompletedAtRef.current && (Date.now() - deleteCompletedAtRef.current < 1500)) {
      console.log("Skipping reload due to recent deletion");
      return;
    }
    
    // Rate limit operations to prevent UI thrashing
    const now = Date.now();
    if (lastOperationTimestampRef.current && (now - lastOperationTimestampRef.current < 500)) {
      console.log("Operation rate limited");
      return;
    }
    
    // Prevent multiple concurrent load operations
    if (loadingInProgressRef.current) {
      console.log("Loading already in progress, skipping");
      return;
    }
    
    lastOperationTimestampRef.current = now;
    
    if (!userId) {
      console.log("No userId provided, setting worlds to empty array");
      setWorlds([]);
      setSelectedWorldId(null);
      setIsLoading(false);
      return;
    }
    
    try {
      // Only set loading to true if we haven't loaded data before
      // This prevents the flash on subsequent loads
      if (!hasLoadedOnce) {
        setIsLoading(true);
      }
      
      loadingInProgressRef.current = true;
      const worldsData = await fetchUserWorlds();
      console.log("Worlds fetched successfully:", worldsData.length);
      
      // Small delay only for first load to ensure UI is ready
      if (!hasLoadedOnce) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      setWorlds(worldsData);
      setHasLoadedOnce(true);
      
      if (selectedWorldId && worldsData.some(w => w.id === selectedWorldId)) {
        // Keep selected world if it exists in the loaded worlds
        setSelectedWorldId(selectedWorldId);
      } else {
        // Clear selection to show the worlds list
        setSelectedWorldId(null);
      }
    } catch (error) {
      console.error('Error loading worlds:', error);
      toast({
        title: 'Fehler beim Laden',
        description: 'Welten konnten nicht geladen werden.',
        variant: 'destructive',
        duration: 3000 // Shorter toast duration
      });
    } finally {
      // Always ensure loading state is cleared
      setIsLoading(false);
      loadingInProgressRef.current = false;
    }
  };

  // Expose deletion timestamp ref for other operations
  const setDeleteCompletedAt = (timestamp: number | null) => {
    deleteCompletedAtRef.current = timestamp;
  };

  return {
    loadWorlds,
    setDeleteCompletedAt
  };
}
