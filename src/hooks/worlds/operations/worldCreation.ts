
import { useToast } from "@/hooks/use-toast";
import { createWorld, updateWorld } from "@/services/worlds";
import { NewWorldFormData, World } from "@/types";

export function useWorldCreation(
  worlds: World[],
  setWorlds: (worlds: World[]) => void,
  setSelectedWorldId: (id: string | null) => void,
  setIsNewWorldModalOpen: (open: boolean) => void
) {
  const { toast } = useToast();

  const handleCreateWorld = async (data: NewWorldFormData) => {
    try {
      const newWorld = await createWorld(data);
      setWorlds([newWorld, ...worlds]);
      setSelectedWorldId(newWorld.id);
      setIsNewWorldModalOpen(false);
      
      toast({
        title: 'Welt erstellt',
        description: `"${data.name}" wurde erfolgreich erstellt.`,
        duration: 3000 
      });
    } catch (error) {
      console.error('Error creating world:', error);
      toast({
        title: 'Fehler',
        description: 'Die Welt konnte nicht erstellt werden.',
        variant: 'destructive',
        duration: 3000 
      });
    }
  };

  return {
    handleCreateWorld
  };
}
