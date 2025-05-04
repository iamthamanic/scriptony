
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Character, Scene } from '../../types';
import CharacterDialogEditor from './CharacterDialogEditor';
import ColorGradingSelector from './ColorGradingSelector';
import AudioReferenceSelector from './AudioReferenceSelector';
import ShotEditor from './ShotEditor';
import { useShots } from '../../hooks/project/useShots';

interface SceneTabsProps {
  scene: Scene;
  characters: Character[];
  onUpdate: (field: string, value: any) => void;
}

const SceneTabs = ({ scene, characters, onUpdate }: SceneTabsProps) => {
  const [activeTab, setActiveTab] = useState('dialog');
  
  // Initialize hooks
  const { 
    shots, 
    handleAddShot, 
    handleEditShot, 
    handleDeleteShot 
  } = useShots({ 
    sceneId: scene.id, 
    initialShots: scene.shots || [],
    onShotsChange: (updatedShots) => onUpdate('shots', updatedShots) 
  });
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
      <TabsList className="grid grid-cols-4">
        <TabsTrigger value="dialog">Character Dialog</TabsTrigger>
        <TabsTrigger value="colors">Color Grading</TabsTrigger>
        <TabsTrigger value="audio">Audio References</TabsTrigger>
        <TabsTrigger value="shots">Shots</TabsTrigger>
      </TabsList>
      
      <TabsContent value="dialog" className="p-4 bg-muted/10 rounded-b-md">
        <CharacterDialogEditor
          characters={characters}
          characterDialogs={scene.characterDialogs || []}
          onChange={(dialogs) => onUpdate('characterDialogs', dialogs)}
        />
      </TabsContent>
      
      <TabsContent value="colors" className="p-4 bg-muted/10 rounded-b-md">
        <ColorGradingSelector
          selectedColors={scene.colorReferences || []}
          onChange={(colors) => onUpdate('colorReferences', colors)}
          referenceImages={[]}  // This would need state management for files
          onAddReferenceImage={(file) => console.log('Add reference image', file)}
          onRemoveReferenceImage={(index) => console.log('Remove reference image at index', index)}
        />
      </TabsContent>
      
      <TabsContent value="audio" className="p-4 bg-muted/10 rounded-b-md">
        <AudioReferenceSelector
          references={scene.audioReferences || []}
          onChange={(refs) => onUpdate('audioReferences', refs)}
        />
      </TabsContent>
      
      <TabsContent value="shots" className="p-4 bg-muted/10 rounded-b-md">
        <ShotEditor
          shots={shots}
          onAddShot={handleAddShot}
          onEditShot={handleEditShot}
          onDeleteShot={handleDeleteShot}
          sceneId={scene.id}
        />
      </TabsContent>
    </Tabs>
  );
};

export default SceneTabs;
