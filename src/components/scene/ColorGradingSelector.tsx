
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ColorReference } from '../../types';
import { Plus, X, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Predefined color palette
const colorPalette = [
  { name: 'Neutral Gray', hexCode: '#8E9196' },
  { name: 'Primary Purple', hexCode: '#9b87f5' },
  { name: 'Dark Purple', hexCode: '#1A1F2C' },
  { name: 'Light Purple', hexCode: '#D6BCFA' },
  { name: 'Soft Green', hexCode: '#F2FCE2' },
  { name: 'Soft Yellow', hexCode: '#FEF7CD' },
  { name: 'Soft Orange', hexCode: '#FEC6A1' },
  { name: 'Soft Purple', hexCode: '#E5DEFF' },
  { name: 'Soft Pink', hexCode: '#FFDEE2' },
  { name: 'Soft Peach', hexCode: '#FDE1D3' },
  { name: 'Soft Blue', hexCode: '#D3E4FD' },
  { name: 'Vivid Purple', hexCode: '#8B5CF6' },
  { name: 'Magenta Pink', hexCode: '#D946EF' },
  { name: 'Bright Orange', hexCode: '#F97316' },
  { name: 'Ocean Blue', hexCode: '#0EA5E9' },
  { name: 'Charcoal Gray', hexCode: '#403E43' },
  { name: 'Pure White', hexCode: '#FFFFFF' },
  { name: 'Medium Gray', hexCode: '#8A898C' },
  { name: 'Dark Charcoal', hexCode: '#221F26' },
  { name: 'Sky Blue', hexCode: '#33C3F0' }
];

interface ColorGradingSelectorProps {
  selectedColors: ColorReference[];
  onChange: (colors: ColorReference[]) => void;
  maxColors?: number;
  referenceImages?: File[];
  onAddReferenceImage?: (file: File) => void;
  onRemoveReferenceImage?: (index: number) => void;
  maxReferenceImages?: number;
}

const ColorGradingSelector: React.FC<ColorGradingSelectorProps> = ({
  selectedColors,
  onChange,
  maxColors = 5,
  referenceImages = [],
  onAddReferenceImage,
  onRemoveReferenceImage,
  maxReferenceImages = 3
}) => {
  const [customColorName, setCustomColorName] = useState('');
  const [customColorHex, setCustomColorHex] = useState('#000000');
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  
  const handleSelectColor = (color: { name: string; hexCode: string }) => {
    // Only allow adding if we haven't reached the max
    if (selectedColors.length >= maxColors) {
      return;
    }
    
    // Create a unique ID
    const newColor: ColorReference = {
      id: `color-${Date.now()}`,
      name: color.name,
      hexCode: color.hexCode
    };
    
    onChange([...selectedColors, newColor]);
  };
  
  const handleRemoveColor = (id: string) => {
    onChange(selectedColors.filter(color => color.id !== id));
  };
  
  const handleAddCustomColor = () => {
    if (!customColorName || selectedColors.length >= maxColors) {
      return;
    }
    
    const newColor: ColorReference = {
      id: `color-${Date.now()}`,
      name: customColorName,
      hexCode: customColorHex
    };
    
    onChange([...selectedColors, newColor]);
    setCustomColorName('');
    setCustomColorHex('#000000');
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !onAddReferenceImage) return;
    
    const file = e.target.files[0];
    if (file && referenceImages.length < maxReferenceImages) {
      onAddReferenceImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrls(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <div className="space-y-4">
      <div>
        <Label className="block mb-2">Selected Colors ({selectedColors.length}/{maxColors})</Label>
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedColors.map(color => (
            <div 
              key={color.id}
              className="flex items-center gap-1 bg-muted rounded-md p-1.5 pr-2"
            >
              <div 
                className="h-5 w-5 rounded-sm border border-border" 
                style={{ backgroundColor: color.hexCode }}
              ></div>
              <span className="text-xs">{color.name}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1"
                onClick={() => handleRemoveColor(color.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
          
          {selectedColors.length === 0 && (
            <p className="text-sm text-muted-foreground">No colors selected. Choose from the palette below.</p>
          )}
        </div>
      </div>
      
      <div>
        <Label className="block mb-2">Color Palette</Label>
        <div className="grid grid-cols-5 gap-2 mb-4">
          {colorPalette.map(color => (
            <button
              key={color.hexCode}
              type="button"
              className={`h-8 w-full rounded-md border ${
                selectedColors.some(sc => sc.hexCode === color.hexCode) ? 'ring-2 ring-anime-purple' : ''
              }`}
              style={{ backgroundColor: color.hexCode }}
              onClick={() => handleSelectColor(color)}
              disabled={selectedColors.length >= maxColors}
              title={color.name}
            ></button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div className="md:col-span-2">
          <Label htmlFor="customColorName">Custom Color Name</Label>
          <Input
            id="customColorName"
            value={customColorName}
            onChange={(e) => setCustomColorName(e.target.value)}
            placeholder="e.g., Sunrise Orange"
            disabled={selectedColors.length >= maxColors}
          />
        </div>
        <div>
          <Label htmlFor="customColorPicker">Color</Label>
          <div className="flex gap-2">
            <Input
              id="customColorPicker"
              type="color"
              value={customColorHex}
              onChange={(e) => setCustomColorHex(e.target.value)}
              className="w-16"
              disabled={selectedColors.length >= maxColors}
            />
            <Button 
              type="button"
              onClick={handleAddCustomColor}
              disabled={!customColorName || selectedColors.length >= maxColors}
              className="flex-grow bg-anime-purple hover:bg-anime-dark-purple"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </div>
      
      {onAddReferenceImage && (
        <div className="mt-6 space-y-3">
          <div className="flex justify-between items-center">
            <Label>Reference Images ({referenceImages.length}/{maxReferenceImages})</Label>
            <Input
              id="referenceImageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={referenceImages.length >= maxReferenceImages}
            />
            <Label 
              htmlFor="referenceImageUpload" 
              className={`cursor-pointer flex items-center gap-1 text-xs px-2 py-1 rounded-md ${
                referenceImages.length >= maxReferenceImages 
                  ? 'bg-muted text-muted-foreground' 
                  : 'bg-anime-purple hover:bg-anime-dark-purple text-white'
              }`}
            >
              <Upload className="h-3 w-3" />
              Upload Image
            </Label>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {imagePreviewUrls.map((url, index) => (
              <div key={index} className="relative rounded-md overflow-hidden border border-border group">
                <img 
                  src={url} 
                  alt={`Reference ${index + 1}`} 
                  className="w-full h-24 object-cover"
                />
                {onRemoveReferenceImage && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onRemoveReferenceImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
            
            {imagePreviewUrls.length === 0 && (
              <p className="text-sm text-muted-foreground col-span-3">
                No reference images. Upload up to {maxReferenceImages} images for color inspiration.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorGradingSelector;
