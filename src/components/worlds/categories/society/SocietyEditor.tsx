import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Map } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { SocialGroup } from '@/types/worlds';
import { toast } from "sonner";
import SocialGroupList from './SocialGroupList';
import SocialGroupForm from './SocialGroupForm';

interface SocietyEditorProps {
  content: any;
  onChange: (content: any) => void;
}

const SocietyEditor: React.FC<SocietyEditorProps> = ({ content, onChange }) => {
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);
  const [editingGroup, setEditingGroup] = useState<SocialGroup | null>(null);
  
  // Initialize content structure safely
  const societyContent = content && content.groups 
    ? content 
    : { groups: [] };
  
  // Create a working copy for local edits
  const [workingContent, setWorkingContent] = useState({
    groups: [...(societyContent.groups || [])]
  });

  const handleAddGroup = () => {
    const newGroup: SocialGroup = {
      id: uuidv4(),
      name: 'Neue soziale Gruppe',
      description: '',
      customFields: [],
      population: '',
      characteristics: []
    };
    
    // Add to working copy only
    const updatedGroups = [...workingContent.groups, newGroup];
    setWorkingContent({
      ...workingContent,
      groups: updatedGroups
    });
    
    // Start editing the new group
    setEditingGroup({...newGroup});
  };

  const handleUpdateGroup = (updatedGroup: SocialGroup) => {
    try {
      // Update the working copy first
      const updatedGroups = workingContent.groups.map(group => 
        group.id === updatedGroup.id ? updatedGroup : group
      );
      
      // Create a new content object to trigger a proper update
      const updatedContent = {
        groups: updatedGroups
      };
      
      // Save to the actual content via onChange
      onChange(updatedContent);
      setEditingGroup(null);
      
      // Update our working copy too
      setWorkingContent(updatedContent);
      
      toast.success("Soziale Gruppe erfolgreich aktualisiert");
    } catch (error) {
      console.error("Error updating social group:", error);
      toast.error("Fehler beim Aktualisieren der sozialen Gruppe");
    }
  };

  const handleCancelEdit = () => {
    // If cancelling, discard changes and reset to original content
    setEditingGroup(null);
    
    // Reset working copy to match the actual content
    setWorkingContent({
      groups: [...(societyContent.groups || [])]
    });
  };

  const handleDeleteGroup = (groupId: string) => {
    if (window.confirm('Sind Sie sicher, dass Sie diese soziale Gruppe löschen möchten?')) {
      try {
        const updatedContent = {
          ...societyContent,
          groups: societyContent.groups.filter(group => group.id !== groupId)
        };
        
        // Persist the deletion
        onChange(updatedContent);
        
        // Update working copy
        setWorkingContent(updatedContent);
        
        if (expandedGroupId === groupId) {
          setExpandedGroupId(null);
        }
        
        if (editingGroup?.id === groupId) {
          setEditingGroup(null);
        }
      } catch (error) {
        console.error("Error deleting social group:", error);
        toast.error("Fehler beim Löschen der sozialen Gruppe");
      }
    }
  };

  const toggleExpand = (groupId: string) => {
    setExpandedGroupId(expandedGroupId === groupId ? null : groupId);
  };

  // If editing a group, show the edit form
  if (editingGroup) {
    return (
      <SocialGroupForm
        group={editingGroup}
        onCancel={handleCancelEdit}
        onSave={handleUpdateGroup}
      />
    );
  }

  // Otherwise show the list of groups
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Soziale Gruppen</h3>
        <Button 
          onClick={handleAddGroup}
          size="sm"
          className="bg-anime-purple hover:bg-anime-dark-purple"
        >
          <Plus className="h-4 w-4 mr-2" /> Gruppe hinzufügen
        </Button>
      </div>
      
      {workingContent.groups.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-lg">
          <Map className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">
            Keine sozialen Gruppen vorhanden. Fügen Sie eine neue Gruppe hinzu.
          </p>
        </div>
      ) : (
        <SocialGroupList
          groups={workingContent.groups}
          expandedGroupId={expandedGroupId}
          onToggleExpand={toggleExpand}
          onEditGroup={(group) => {
            // Set the editing group to a deep copy to avoid reference issues
            setEditingGroup(JSON.parse(JSON.stringify(group)));
          }}
          onDeleteGroup={handleDeleteGroup}
        />
      )}
    </div>
  );
};

export default SocietyEditor;
