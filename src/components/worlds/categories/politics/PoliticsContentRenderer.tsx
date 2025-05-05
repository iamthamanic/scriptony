
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { PoliticalSystem } from "@/types/worlds";
import PoliticalSystemGrid from './PoliticalSystemGrid';

interface PoliticsContentRendererProps {
  content: {
    systems: PoliticalSystem[];
  };
}

const PoliticsContentRenderer: React.FC<PoliticsContentRendererProps> = ({ content }) => {
  // Safely extract systems array
  const systems = content?.systems || [];
  
  if (systems.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">Keine politischen Systeme vorhanden</div>;
  }
  
  return (
    <Tabs defaultValue="systems">
      <TabsList>
        <TabsTrigger value="systems">Politische Systeme ({systems.length})</TabsTrigger>
        <TabsTrigger value="json">JSON</TabsTrigger>
      </TabsList>
      
      <TabsContent value="systems" className="space-y-4 pt-4">
        <PoliticalSystemGrid systems={systems} />
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

export default PoliticsContentRenderer;
