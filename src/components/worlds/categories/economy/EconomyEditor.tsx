import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Map } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { EconomicEntity } from '@/types/worlds';
import { toast } from "sonner";
import EconomicEntityList from './EconomicEntityList';
import EconomicEntityForm from './EconomicEntityForm';

interface EconomyEditorProps {
  content: any;
  onChange: (content: any) => void;
}

const EconomyEditor: React.FC<EconomyEditorProps> = ({ content, onChange }) => {
  const [expandedEntityId, setExpandedEntityId] = useState<string | null>(null);
  const [editingEntity, setEditingEntity] = useState<EconomicEntity | null>(null);
  
  // Initialize content structure safely
  const economyContent = content && content.entities 
    ? content 
    : { entities: [] };
  
  // Create a working copy for local edits
  const [workingContent, setWorkingContent] = useState({
    entities: [...(economyContent.entities || [])]
  });

  const handleAddEntity = () => {
    const newEntity: EconomicEntity = {
      id: uuidv4(),
      name: 'Neue wirtschaftliche Einheit',
      description: '',
      customFields: [],
      entity_type: 'currency'
    };
    
    // Add to working copy only
    const updatedEntities = [...workingContent.entities, newEntity];
    setWorkingContent({
      ...workingContent,
      entities: updatedEntities
    });
    
    // Start editing the new entity
    setEditingEntity({...newEntity});
  };

  const handleUpdateEntity = (updatedEntity: EconomicEntity) => {
    try {
      // Update the working copy first
      const updatedEntities = workingContent.entities.map(entity => 
        entity.id === updatedEntity.id ? updatedEntity : entity
      );
      
      // Create a new content object to trigger a proper update
      const updatedContent = {
        entities: updatedEntities
      };
      
      // Save to the actual content via onChange
      onChange(updatedContent);
      setEditingEntity(null);
      
      // Update our working copy too
      setWorkingContent(updatedContent);
      
      toast.success("Wirtschaftliche Einheit erfolgreich aktualisiert");
    } catch (error) {
      console.error("Error updating economic entity:", error);
      toast.error("Fehler beim Aktualisieren der wirtschaftlichen Einheit");
    }
  };

  const handleCancelEdit = () => {
    // If cancelling, discard changes and reset to original content
    setEditingEntity(null);
    
    // Reset working copy to match the actual content
    setWorkingContent({
      entities: [...(economyContent.entities || [])]
    });
  };

  const handleDeleteEntity = (entityId: string) => {
    if (window.confirm('Sind Sie sicher, dass Sie diese wirtschaftliche Einheit löschen möchten?')) {
      try {
        const updatedContent = {
          ...economyContent,
          entities: economyContent.entities.filter(entity => entity.id !== entityId)
        };
        
        // Persist the deletion
        onChange(updatedContent);
        
        // Update working copy
        setWorkingContent(updatedContent);
        
        if (expandedEntityId === entityId) {
          setExpandedEntityId(null);
        }
        
        if (editingEntity?.id === entityId) {
          setEditingEntity(null);
        }
      } catch (error) {
        console.error("Error deleting economic entity:", error);
        toast.error("Fehler beim Löschen der wirtschaftlichen Einheit");
      }
    }
  };

  const toggleExpand = (entityId: string) => {
    setExpandedEntityId(expandedEntityId === entityId ? null : entityId);
  };

  // If editing an entity, show the edit form
  if (editingEntity) {
    return (
      <EconomicEntityForm
        entity={editingEntity}
        onCancel={handleCancelEdit}
        onSave={handleUpdateEntity}
      />
    );
  }

  // Otherwise show the list of entities
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Wirtschaftliche Einheiten</h3>
        <Button 
          onClick={handleAddEntity}
          size="sm"
          className="bg-anime-purple hover:bg-anime-dark-purple"
        >
          <Plus className="h-4 w-4 mr-2" /> Einheit hinzufügen
        </Button>
      </div>
      
      {workingContent.entities.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-lg">
          <Map className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">
            Keine wirtschaftlichen Einheiten vorhanden. Fügen Sie eine neue Einheit hinzu.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <EconomicEntityList
            entities={workingContent.entities}
            expandedEntityId={expandedEntityId}
            onToggleExpand={toggleExpand}
            onEditEntity={(entity) => {
              // Set the editing entity to a deep copy to avoid reference issues
              setEditingEntity(JSON.parse(JSON.stringify(entity)));
            }}
            onDeleteEntity={handleDeleteEntity}
          />
        </div>
      )}
    </div>
  );
};

export default EconomyEditor;
