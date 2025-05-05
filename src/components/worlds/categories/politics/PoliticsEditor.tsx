import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Map } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { PoliticalSystem } from '@/types/worlds';
import { toast } from "sonner";
import PoliticalSystemList from './PoliticalSystemList';
import PoliticalSystemForm from './PoliticalSystemForm';

interface PoliticsEditorProps {
  content: any;
  onChange: (content: any) => void;
}

const PoliticsEditor: React.FC<PoliticsEditorProps> = ({ content, onChange }) => {
  const [expandedSystemId, setExpandedSystemId] = useState<string | null>(null);
  const [editingSystem, setEditingSystem] = useState<PoliticalSystem | null>(null);
  
  // Initialize content structure safely
  const politicsContent = content && content.systems 
    ? content 
    : { systems: [] };
  
  // Create a working copy for local edits
  const [workingContent, setWorkingContent] = useState({
    systems: [...(politicsContent.systems || [])]
  });

  const handleAddSystem = () => {
    const newSystem: PoliticalSystem = {
      id: uuidv4(),
      name: 'Neues politisches System',
      description: '',
      customFields: [],
      government_type: '',
      leaders: []
    };
    
    // Add to working copy only
    const updatedSystems = [...workingContent.systems, newSystem];
    setWorkingContent({
      ...workingContent,
      systems: updatedSystems
    });
    
    // Start editing the new system
    setEditingSystem({...newSystem});
  };

  const handleUpdateSystem = (updatedSystem: PoliticalSystem) => {
    try {
      // Update the working copy first
      const updatedSystems = workingContent.systems.map(system => 
        system.id === updatedSystem.id ? updatedSystem : system
      );
      
      // Create a new content object to trigger a proper update
      const updatedContent = {
        systems: updatedSystems
      };
      
      // Save to the actual content via onChange
      onChange(updatedContent);
      setEditingSystem(null);
      
      // Update our working copy too
      setWorkingContent(updatedContent);
      
      toast.success("Politisches System erfolgreich aktualisiert");
    } catch (error) {
      console.error("Error updating political system:", error);
      toast.error("Fehler beim Aktualisieren des politischen Systems");
    }
  };

  const handleCancelEdit = () => {
    // If cancelling, discard changes and reset to original content
    setEditingSystem(null);
    
    // Reset working copy to match the actual content
    setWorkingContent({
      systems: [...(politicsContent.systems || [])]
    });
  };

  const handleDeleteSystem = (systemId: string) => {
    if (window.confirm('Sind Sie sicher, dass Sie dieses politische System löschen möchten?')) {
      try {
        const updatedContent = {
          ...politicsContent,
          systems: politicsContent.systems.filter(system => system.id !== systemId)
        };
        
        // Persist the deletion
        onChange(updatedContent);
        
        // Update working copy
        setWorkingContent(updatedContent);
        
        if (expandedSystemId === systemId) {
          setExpandedSystemId(null);
        }
        
        if (editingSystem?.id === systemId) {
          setEditingSystem(null);
        }
      } catch (error) {
        console.error("Error deleting political system:", error);
        toast.error("Fehler beim Löschen des politischen Systems");
      }
    }
  };

  const toggleExpand = (systemId: string) => {
    setExpandedSystemId(expandedSystemId === systemId ? null : systemId);
  };

  // If editing a system, show the edit form
  if (editingSystem) {
    return (
      <PoliticalSystemForm
        system={editingSystem}
        onCancel={handleCancelEdit}
        onSave={handleUpdateSystem}
      />
    );
  }

  // Otherwise show the list of systems
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Politische Systeme</h3>
        <Button 
          onClick={handleAddSystem}
          size="sm"
          className="bg-anime-purple hover:bg-anime-dark-purple"
        >
          <Plus className="h-4 w-4 mr-2" /> System hinzufügen
        </Button>
      </div>
      
      {workingContent.systems.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-lg">
          <Map className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">
            Keine politischen Systeme vorhanden. Fügen Sie ein neues System hinzu.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <PoliticalSystemList
            systems={workingContent.systems}
            expandedSystemId={expandedSystemId}
            onToggleExpand={toggleExpand}
            onEditSystem={(system) => {
              // Set the editing system to a deep copy to avoid reference issues
              setEditingSystem(JSON.parse(JSON.stringify(system)));
            }}
            onDeleteSystem={handleDeleteSystem}
          />
        </div>
      )}
    </div>
  );
};

export default PoliticsEditor;
