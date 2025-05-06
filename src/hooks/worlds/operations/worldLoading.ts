
import { useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { fetchUserWorlds } from "@/services/worlds";

export function useWorldLoading(
  userId: string | undefined,
  setWorlds: (worlds: any[]) => void,
  selectedWorldId: string | null,
  setSelectedWorldId: (id: string | null) => void,
  setIsLoading: (loading: boolean) => void
) {
  const { toast } = useToast();
  const lastOperationTimestampRef = useRef<number | null>(null);
  const deleteCompletedAtRef = useRef<number | null>(null);
  
  // Load worlds with cooldown protection
  const loadWorlds = async () => {
    console.log("loadWorlds called, userId:", userId, "isLoading being set to true");
    
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
    lastOperationTimestampRef.current = now;
    
    if (!userId) {
      console.log("No userId provided, setting worlds to empty array and isLoading to false");
      setWorlds([]);
      setSelectedWorldId(null);
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      const worldsData = await fetchUserWorlds();
      console.log("Worlds fetched successfully:", worldsData.length);
      
      // Add small delay before updating state to ensure smooth UI updates
      await new Promise(resolve => setTimeout(resolve, 100));
      setWorlds(worldsData);
      
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
      console.log("Setting isLoading to false in finally block");
      setIsLoading(false);
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
