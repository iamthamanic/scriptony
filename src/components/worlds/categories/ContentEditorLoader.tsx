
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { WorldCategoryType } from '@/types/worlds';
import CountryEditor from '../geography/CountryEditor';
import PoliticsEditor from '../categories/politics/PoliticsEditor';
import EconomyEditor from '../categories/economy/EconomyEditor';
import SocietyEditor from '../categories/society/SocietyEditor';
import CultureEditor from '../categories/culture/CultureEditor';

interface ContentEditorLoaderProps {
  type: WorldCategoryType;
  content: any;
  onChange: (content: any) => void;
}

const ContentEditorLoader: React.FC<ContentEditorLoaderProps> = ({ type, content, onChange }) => {
  switch (type) {
    case 'geography':
      return (
        <CountryEditor 
          content={content} 
          onChange={onChange}
        />
      );
      
    case 'politics':
      return (
        <PoliticsEditor
          content={content}
          onChange={onChange}
        />
      );
      
    case 'economy':
      return (
        <EconomyEditor
          content={content}
          onChange={onChange}
        />
      );
      
    case 'society':
      return (
        <SocietyEditor
          content={content}
          onChange={onChange}
        />
      );
      
    case 'culture':
      return (
        <CultureEditor
          content={content}
          onChange={onChange}
        />
      );
    
    default:
      return (
        <div className="space-y-2">
          <Label htmlFor="content">Inhalt (JSON Format)</Label>
          <Textarea
            id="content"
            name="content"
            value={JSON.stringify(content || {}, null, 2)}
            onChange={e => {
              try {
                onChange(JSON.parse(e.target.value));
              } catch (error) {
                // Invalid JSON, but we still keep the text
              }
            }}
            placeholder="{ }"
            className="font-mono h-40"
          />
          <p className="text-xs text-muted-foreground">
            Der Inhalt muss im JSON-Format eingegeben werden.
          </p>
        </div>
      );
  }
};

export default ContentEditorLoader;
