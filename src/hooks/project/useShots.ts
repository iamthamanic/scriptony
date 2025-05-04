
import { useState } from "react";
import { Shot, NewShotFormData } from "../../types";
import { useToast } from "../use-toast";

interface UseShotsProps {
  sceneId: string;
  initialShots?: Shot[];
  onShotsChange?: (shots: Shot[]) => void;
}

export const useShots = ({ sceneId, initialShots = [], onShotsChange }: UseShotsProps) => {
  const [shots, setShots] = useState<Shot[]>(initialShots);
  const { toast } = useToast();

  const handleAddShot = (data: NewShotFormData) => {
    const newShot: Shot = {
      id: `shot-${Date.now()}`,
      sceneId,
      title: data.title,
      shotNumber: data.shotNumber,
      shotType: data.shotType,
      cameraMovement: data.cameraMovement,
      cameraPerspective: data.cameraPerspective,
      timecodeStart: data.timecodeStart,
      timecodeEnd: data.timecodeEnd,
      description: data.description,
      image: data.image ? URL.createObjectURL(data.image) : undefined,
      aiNotes: data.aiNotes,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedShots = [...shots, newShot].sort((a, b) => a.shotNumber - b.shotNumber);
    setShots(updatedShots);
    
    if (onShotsChange) {
      onShotsChange(updatedShots);
    }
    
    toast({
      title: "Shot Added",
      description: `Shot ${data.shotNumber}: "${data.title}" has been added.`,
      duration: 3000
    });
  };

  const handleEditShot = (shotId: string, data: NewShotFormData) => {
    const shotToUpdate = shots.find(s => s.id === shotId);
    
    if (!shotToUpdate) return;
    
    const updatedShot: Shot = {
      ...shotToUpdate,
      title: data.title,
      shotNumber: data.shotNumber,
      shotType: data.shotType,
      cameraMovement: data.cameraMovement,
      cameraPerspective: data.cameraPerspective,
      timecodeStart: data.timecodeStart,
      timecodeEnd: data.timecodeEnd,
      description: data.description,
      image: data.image ? URL.createObjectURL(data.image) : shotToUpdate.image,
      aiNotes: data.aiNotes,
      updatedAt: new Date()
    };
    
    const updatedShots = shots.map(
      s => s.id === shotId ? updatedShot : s
    ).sort((a, b) => a.shotNumber - b.shotNumber);
    
    setShots(updatedShots);
    
    if (onShotsChange) {
      onShotsChange(updatedShots);
    }
    
    toast({
      title: "Shot Updated",
      description: `Shot ${data.shotNumber}: "${data.title}" has been updated.`,
      duration: 3000
    });
  };

  const handleDeleteShot = (shotId: string) => {
    const shotToDelete = shots.find(s => s.id === shotId);
    
    if (!shotToDelete) return;
    
    const updatedShots = shots.filter(s => s.id !== shotId);
    setShots(updatedShots);
    
    if (onShotsChange) {
      onShotsChange(updatedShots);
    }
    
    toast({
      title: "Shot Deleted",
      description: `Shot ${shotToDelete.shotNumber}: "${shotToDelete.title}" has been deleted.`,
      variant: "destructive",
      duration: 3000
    });
  };

  return {
    shots,
    setShots,
    handleAddShot,
    handleEditShot,
    handleDeleteShot
  };
};

export default useShots;
