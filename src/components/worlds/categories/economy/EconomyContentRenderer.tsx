
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { EconomicEntity } from "@/types/worlds";
import EconomicEntityGrid from './EconomicEntityGrid';

interface EconomyContentRendererProps {
  content: {
    entities: EconomicEntity[];
  };
}

const EconomyContentRenderer: React.FC<EconomyContentRendererProps> = ({ content }) => {
  // Safely extract entities array
  const entities = content?.entities || [];
  
  if (entities.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">Keine wirtschaftlichen Einheiten vorhanden</div>;
  }
  
  return (
    <Tabs defaultValue="entities">
      <TabsList>
        <TabsTrigger value="entities">Wirtschaftliche Einheiten ({entities.length})</TabsTrigger>
        <TabsTrigger value="json">JSON</TabsTrigger>
      </TabsList>
      
      <TabsContent value="entities" className="space-y-4 pt-4">
        <EconomicEntityGrid entities={entities} />
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

export default EconomyContentRenderer;
