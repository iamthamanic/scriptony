
import { useToast } from "@/hooks/use-toast";
import { duplicateWorld } from "@/services/worlds";
import { World } from "@/types";

export function useWorldDuplicate(
  worlds: World[],
  setWorlds: (worlds: World[]) => void,
  setSelectedWorldId: (id: string | null) => void
) {
  const { toast } = useToast();

  const handleDuplicateWorld = async (worldToDuplicate: World | null) => {
    if (!worldToDuplicate) return;
    
    try {
      const duplicatedWorld = await duplicateWorld(worldToDuplicate.id);
      setWorlds([duplicatedWorld, ...worlds]);
      setSelectedWorldId(duplicatedWorld.id);
      
      toast({
        title: 'Welt dupliziert',
        description: `"${duplicatedWorld.name}" wurde erfolgreich erstellt.`,
        duration: 3000 
      });
    } catch (error) {
      console.error('Error duplicating world:', error);
      toast({
        title: 'Fehler',
        description: 'Die Welt konnte nicht dupliziert werden.',
        variant: 'destructive',
        duration: 3000 
      });
    }
  };

  return {
    handleDuplicateWorld
  };
}
