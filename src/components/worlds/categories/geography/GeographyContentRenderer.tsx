
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { GeographyContent, Country } from "@/types";
import GeographyCountryGrid from './GeographyCountryGrid';

interface GeographyContentRendererProps {
  content: GeographyContent | null;
}

const GeographyContentRenderer: React.FC<GeographyContentRendererProps> = ({ content }) => {
  // Safely extract countries array
  const countries = content?.countries || [];
  
  if (countries.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">Keine Länder vorhanden</div>;
  }
  
  return (
    <Tabs defaultValue="countries">
      <TabsList>
        <TabsTrigger value="countries">Länder ({countries.length})</TabsTrigger>
        <TabsTrigger value="json">JSON</TabsTrigger>
      </TabsList>
      
      <TabsContent value="countries" className="space-y-4 pt-4">
        <GeographyCountryGrid countries={countries} />
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

export default GeographyContentRenderer;
