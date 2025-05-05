
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { CultureElement } from "@/types/worlds";
import CultureElementGrid from './CultureElementGrid';

interface CultureContentRendererProps {
  content: {
    elements: CultureElement[];
  };
}

const CultureContentRenderer: React.FC<CultureContentRendererProps> = ({ content }) => {
  // Safely extract elements array
  const elements = content?.elements || [];
  
  if (elements.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">Keine kulturellen Elemente vorhanden</div>;
  }
  
  return (
    <Tabs defaultValue="elements">
      <TabsList>
        <TabsTrigger value="elements">Kulturelle Elemente ({elements.length})</TabsTrigger>
        <TabsTrigger value="json">JSON</TabsTrigger>
      </TabsList>
      
      <TabsContent value="elements" className="space-y-4 pt-4">
        <CultureElementGrid elements={elements} />
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

export default CultureContentRenderer;
