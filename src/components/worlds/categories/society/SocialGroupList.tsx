
import React from 'react';
import { Button } from '@/components/ui/button';
import { SocialGroup } from '@/types/worlds';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Pencil, Trash2 } from 'lucide-react';

interface SocialGroupListProps {
  groups: SocialGroup[];
  expandedGroupId: string | null;
  onToggleExpand: (groupId: string) => void;
  onEditGroup: (group: SocialGroup) => void;
  onDeleteGroup: (groupId: string) => void;
}

const SocialGroupList: React.FC<SocialGroupListProps> = ({
  groups,
  expandedGroupId,
  onToggleExpand,
  onEditGroup,
  onDeleteGroup
}) => {
  return (
    <div className="space-y-3">
      {groups.map(group => (
        <Card key={group.id} className="overflow-hidden">
          <CardHeader className="p-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onToggleExpand(group.id)}
                  className="p-1 h-auto"
                >
                  {expandedGroupId === group.id ? 
                    <ChevronUp className="h-4 w-4" /> : 
                    <ChevronDown className="h-4 w-4" />
                  }
                </Button>
                <span className="font-medium">{group.name}</span>
                {group.population && (
                  <span className="text-xs text-muted-foreground ml-2">
                    Population: {group.population}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onEditGroup(group)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onDeleteGroup(group.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          {expandedGroupId === group.id && (
            <CardContent className="px-3 pb-3 pt-0">
              {group.description && (
                <p className="text-sm mb-2">{group.description}</p>
              )}
              
              {group.characteristics && group.characteristics.length > 0 && (
                <div className="mb-2">
                  <span className="text-sm font-medium">Merkmale: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {group.characteristics.map((characteristic, index) => (
                      <span 
                        key={index}
                        className="inline-block px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full"
                      >
                        {characteristic}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {group.customFields && group.customFields.length > 0 && (
                <div className="mt-2">
                  <h4 className="text-sm font-medium">Eigenschaften:</h4>
                  <div className="grid grid-cols-2 gap-1 mt-1">
                    {group.customFields.map(field => (
                      <div key={field.id} className="text-xs">
                        <span className="font-medium">{field.name}:</span> {field.value}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end mt-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEditGroup(group)}
                >
                  <Pencil className="h-3 w-3 mr-1" /> Bearbeiten
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
};

export default SocialGroupList;
