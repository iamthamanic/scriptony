import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Map } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { CultureElement } from '@/types/worlds';
import { toast } from "sonner";
import CultureElementList from './CultureElementList';
import CultureElementForm from './CultureElementForm';

interface CultureEditorProps {
  content: any;
  onChange: (content: any) => void;
}

const CultureEditor: React.FC<CultureEditorProps> = ({ content, onChange }) => {
  const [expandedElementId, setExpandedElementId] = useState<string | null>(null);
  const [editingElement, setEditingElement] = useState<CultureElement | null>(null);
  
  // Initialize content structure safely
  const cultureContent = content && content.elements 
    ? content 
    : { elements: [] };
  
  // Create a working copy for local edits
  const [workingContent, setWorkingContent] = useState({
    elements: [...(cultureContent.elements || [])]
  });

  const handleAddElement = () => {
    const newElement: CultureElement = {
      id: uuidv4(),
      name: 'Neues kulturelles Element',
      description: '',
      customFields: [],
      element_type: 'art'
    };
    
    // Add to working copy only
    const updatedElements = [...workingContent.elements, newElement];
    setWorkingContent({
      ...workingContent,
      elements: updatedElements
    });
    
    // Start editing the new element
    setEditingElement({...newElement});
  };

  const handleUpdateElement = (updatedElement: CultureElement) => {
    try {
      // Update the working copy first
      const updatedElements = workingContent.elements.map(element => 
        element.id === updatedElement.id ? updatedElement : element
      );
      
      // Create a new content object to trigger a proper update
      const updatedContent = {
        elements: updatedElements
      };
      
      // Save to the actual content via onChange
      onChange(updatedContent);
      setEditingElement(null);
      
      // Update our working copy too
      setWorkingContent(updatedContent);
      
      toast.success("Kulturelles Element erfolgreich aktualisiert");
    } catch (error) {
      console.error("Error updating culture element:", error);
      toast.error("Fehler beim Aktualisieren des kulturellen Elements");
    }
  };

  const handleCancelEdit = () => {
    // If cancelling, discard changes and reset to original content
    setEditingElement(null);
    
    // Reset working copy to match the actual content
    setWorkingContent({
      elements: [...(cultureContent.elements || [])]
    });
  };

  const handleDeleteElement = (elementId: string) => {
    if (window.confirm('Sind Sie sicher, dass Sie dieses kulturelle Element löschen möchten?')) {
      try {
        const updatedContent = {
          ...cultureContent,
          elements: cultureContent.elements.filter(element => element.id !== elementId)
        };
        
        // Persist the deletion
        onChange(updatedContent);
        
        // Update working copy
        setWorkingContent(updatedContent);
        
        if (expandedElementId === elementId) {
          setExpandedElementId(null);
        }
        
        if (editingElement?.id === elementId) {
          setEditingElement(null);
        }
      } catch (error) {
        console.error("Error deleting culture element:", error);
        toast.error("Fehler beim Löschen des kulturellen Elements");
      }
    }
  };

  const toggleExpand = (elementId: string) => {
    setExpandedElementId(expandedElementId === elementId ? null : elementId);
  };

  // If editing an element, show the edit form
  if (editingElement) {
    return (
      <CultureElementForm
        element={editingElement}
        onCancel={handleCancelEdit}
        onSave={handleUpdateElement}
      />
    );
  }

  // Otherwise show the list of elements
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Kulturelle Elemente</h3>
        <Button 
          onClick={handleAddElement}
          size="sm"
          className="bg-anime-purple hover:bg-anime-dark-purple"
        >
          <Plus className="h-4 w-4 mr-2" /> Element hinzufügen
        </Button>
      </div>
      
      {workingContent.elements.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-lg">
          <Map className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">
            Keine kulturellen Elemente vorhanden. Fügen Sie ein neues Element hinzu.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <CultureElementList
            elements={workingContent.elements}
            expandedElementId={expandedElementId}
            onToggleExpand={toggleExpand}
            onEditElement={(element) => {
              // Set the editing element to a deep copy to avoid reference issues
              setEditingElement(JSON.parse(JSON.stringify(element)));
            }}
            onDeleteElement={handleDeleteElement}
          />
        </div>
      )}
    </div>
  );
};

export default CultureEditor;
