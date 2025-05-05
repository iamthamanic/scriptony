
import React from 'react';
import { WorldCategory, GeographyContent, Json } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import GeographyContentRenderer from './geography/GeographyContentRenderer';

interface ContentRendererProps {
  category: WorldCategory;
}

const ContentRenderer: React.FC<ContentRendererProps> = ({ category }) => {
  // Render category content based on type
  switch (category.type) {
    case 'geography':
      // Safely check if content matches the expected GeographyContent structure
      const content = category.content;
      const isValidGeographyContent = (
        typeof content === 'object' && 
        content !== null && 
        !Array.isArray(content) &&
        'countries' in content && 
        Array.isArray((content as any).countries)
      );
      
      // Create a properly typed geography content object with safe type assertion
      const geographyContent = isValidGeographyContent 
        ? { countries: (content as any).countries } as GeographyContent
        : { countries: [] } as GeographyContent;
        
      return <GeographyContentRenderer content={geographyContent} />;
    
    default:
      // For other category types, just show JSON
      return (
        <div className="bg-muted/50 rounded-md p-2">
          {category.content && Object.keys(category.content as Json).length > 0 ? (
            <Textarea 
              value={JSON.stringify(category.content, null, 2)}
              readOnly
              className="min-h-[200px] font-mono text-sm"
            />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Keine Inhalte vorhanden
            </div>
          )}
        </div>
      );
  }
};

export default ContentRenderer;
