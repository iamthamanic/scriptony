
import { useToast } from "@/hooks/use-toast";
import { updateWorld } from "@/services/worlds";
import { NewWorldFormData, World } from "@/types";

export function useWorldUpdate(
  worlds: World[],
  setWorlds: (worlds: World[]) => void,
  setIsEditWorldModalOpen: (open: boolean) => void
) {
  const { toast } = useToast();

  const handleUpdateWorld = async (selectedWorld: World | null, data: NewWorldFormData) => {
    if (!selectedWorld) return;
    
    try {
      const updatedWorld = await updateWorld(selectedWorld.id, data);
      setWorlds(worlds.map(w => w.id === updatedWorld.id ? updatedWorld : w));
      setIsEditWorldModalOpen(false);
      
      toast({
        title: 'Welt aktualisiert',
        description: `"${data.name}" wurde erfolgreich aktualisiert.`,
        duration: 3000 
      });
    } catch (error) {
      console.error('Error updating world:', error);
      toast({
        title: 'Fehler',
        description: 'Die Welt konnte nicht aktualisiert werden.',
        variant: 'destructive',
        duration: 3000
      });
    }
  };

  return {
    handleUpdateWorld
  };
}
