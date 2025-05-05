
import React from 'react';
import { WorldCategory, GeographyContent } from "@/types";
import { Json } from "@/integrations/supabase/types";
import { Textarea } from "@/components/ui/textarea";
import GeographyContentRenderer from './geography/GeographyContentRenderer';
import PoliticsContentRenderer from './politics/PoliticsContentRenderer';
import EconomyContentRenderer from './economy/EconomyContentRenderer';
import SocietyContentRenderer from './society/SocietyContentRenderer';
import CultureContentRenderer from './culture/CultureContentRenderer';

interface ContentRendererProps {
  category: WorldCategory;
}

const ContentRenderer: React.FC<ContentRendererProps> = ({ category }) => {
  // Helper function to check if content has expected structure
  const validateCategoryContent = (content: any, key: string): boolean => {
    return (
      typeof content === 'object' && 
      content !== null && 
      !Array.isArray(content) &&
      key in content && 
      Array.isArray((content as any)[key])
    );
  };
  
  // Render category content based on type
  switch (category.type) {
    case 'geography': {
      const content = category.content;
      const isValidStructure = validateCategoryContent(content, 'countries');
      
      const geographyContent = isValidStructure 
        ? { countries: (content as any).countries } as GeographyContent
        : { countries: [] } as GeographyContent;
        
      return <GeographyContentRenderer content={geographyContent} />;
    }
    
    case 'politics': {
      const content = category.content;
      const isValidStructure = validateCategoryContent(content, 'systems');
      
      const politicsContent = isValidStructure 
        ? { systems: (content as any).systems }
        : { systems: [] };
        
      return <PoliticsContentRenderer content={politicsContent} />;
    }
    
    case 'economy': {
      const content = category.content;
      const isValidStructure = validateCategoryContent(content, 'entities');
      
      const economyContent = isValidStructure 
        ? { entities: (content as any).entities }
        : { entities: [] };
        
      return <EconomyContentRenderer content={economyContent} />;
    }
    
    case 'society': {
      const content = category.content;
      const isValidStructure = validateCategoryContent(content, 'groups');
      
      const societyContent = isValidStructure 
        ? { groups: (content as any).groups }
        : { groups: [] };
        
      return <SocietyContentRenderer content={societyContent} />;
    }
    
    case 'culture': {
      const content = category.content;
      const isValidStructure = validateCategoryContent(content, 'elements');
      
      const cultureContent = isValidStructure 
        ? { elements: (content as any).elements }
        : { elements: [] };
        
      return <CultureContentRenderer content={cultureContent} />;
    }
    
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
