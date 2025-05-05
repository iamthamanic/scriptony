
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { SocialGroup } from "@/types/worlds";
import SocialGroupGrid from './SocialGroupGrid';

interface SocietyContentRendererProps {
  content: {
    groups: SocialGroup[];
  };
}

const SocietyContentRenderer: React.FC<SocietyContentRendererProps> = ({ content }) => {
  // Safely extract groups array
  const groups = content?.groups || [];
  
  if (groups.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">Keine sozialen Gruppen vorhanden</div>;
  }
  
  return (
    <Tabs defaultValue="groups">
      <TabsList>
        <TabsTrigger value="groups">Soziale Gruppen ({groups.length})</TabsTrigger>
        <TabsTrigger value="json">JSON</TabsTrigger>
      </TabsList>
      
      <TabsContent value="groups" className="space-y-4 pt-4">
        <SocialGroupGrid groups={groups} />
      </TabsContent>
      
      <TabsContent value="json">
        <Textarea 
          value={JSON.stringify(content, null, 2)}
          readOnly
          className="min-h-[200px] font-mono text-sm"
        />
      </TabsContent>
    </Tabs>
  );
};

export default SocietyContentRenderer;
