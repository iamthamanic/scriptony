
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NewSceneFormData, TimeOfDay, EmotionalSignificance } from '../types';
import { timeOfDayOptions, emotionalSignificanceOptions } from '../utils/mockData';
import { Upload, Clock } from 'lucide-react';

interface NewSceneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewSceneFormData) => void;
  projectType: 'movie' | 'series' | 'short';
  lastSceneNumber: number;
}

const NewSceneModal = ({ isOpen, onClose, onSubmit, projectType, lastSceneNumber }: NewSceneModalProps) => {
  const [formData, setFormData] = useState<NewSceneFormData>({
    sceneNumber: lastSceneNumber + 1,
    location: '',
    timeOfDay: 'day',
    timecodeStart: '00:00:00',
    timecodeEnd: '00:00:00',
    visualComposition: '',
    lighting: '',
    colorGrading: '',
    soundDesign: '',
    specialEffects: '',
    description: '',
    dialog: '',
    transitions: '',
    productionNotes: '',
    emotionalSignificance: 'introduction',
  });
  
  const [activeTab, setActiveTab] = useState('basics');
  const [keyframePreview, setKeyframePreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, keyframeImage: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setKeyframePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Helper function for timecode validation
  const validateTimecode = (value: string): boolean => {
    return /^\d{2}:\d{2}:\d{2}$/.test(value);
  };

  // Validate that the end timecode is after the start timecode
  const isValidTimeRange = (): boolean => {
    if (!validateTimecode(formData.timecodeStart) || !validateTimecode(formData.timecodeEnd)) {
      return false;
    }
    return formData.timecodeStart <= formData.timecodeEnd;
  };

  // Check if the form is valid for the current tab
  const isCurrentTabValid = (): boolean => {
    switch (activeTab) {
      case 'basics':
        return (
          !!formData.location &&
          !!formData.timecodeStart &&
          !!formData.timecodeEnd &&
          isValidTimeRange()
        );
      case 'visual':
        return !!formData.visualComposition;
      case 'content':
        return !!formData.description;
      case 'meta':
        return true; // No required fields in meta tab
      default:
        return false;
    }
  };

  // Check if the entire form is valid
  const isFormValid = (): boolean => {
    return (
      !!formData.location &&
      !!formData.timecodeStart &&
      !!formData.timecodeEnd &&
      isValidTimeRange() &&
      !!formData.visualComposition &&
      !!formData.description
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-anime-purple">Create New Scene</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="basics">Basic Info</TabsTrigger>
              <TabsTrigger value="visual">Visual Design</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="meta">Meta & Notes</TabsTrigger>
            </TabsList>
            
            {/* Basics Tab */}
            <TabsContent value="basics" className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sceneNumber">Scene Number</Label>
                  <Input
                    id="sceneNumber"
                    name="sceneNumber"
                    type="number"
                    value={formData.sceneNumber}
                    onChange={handleChange}
                    min={1}
                    required
                  />
                </div>
                
                {projectType === 'series' && (
                  <div className="space-y-2">
                    <Label htmlFor="episodeTitle">Episode Title (Optional)</Label>
                    <Input
                      id="episodeTitle"
                      name="episodeTitle"
                      value={formData.episodeTitle || ''}
                      onChange={handleChange}
                      placeholder="Episode title"
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., 'Exterior - Neo Tokyo Skyline'"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timeOfDay">Time of Day</Label>
                <Select
                  value={formData.timeOfDay}
                  onValueChange={(value) => handleSelectChange('timeOfDay', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time of day" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOfDayOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timecodeStart" className="flex items-center gap-1">
                    <Clock size={16} />
                    Start Timecode (HH:MM:SS)
                  </Label>
                  <Input
                    id="timecodeStart"
                    name="timecodeStart"
                    value={formData.timecodeStart}
                    onChange={handleChange}
                    placeholder="00:00:00"
                    pattern="\d{2}:\d{2}:\d{2}"
                    required
                  />
                  {formData.timecodeStart && !validateTimecode(formData.timecodeStart) && (
                    <p className="text-xs text-red-500">Format should be HH:MM:SS</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timecodeEnd" className="flex items-center gap-1">
                    <Clock size={16} />
                    End Timecode (HH:MM:SS)
                  </Label>
                  <Input
                    id="timecodeEnd"
                    name="timecodeEnd"
                    value={formData.timecodeEnd}
                    onChange={handleChange}
                    placeholder="00:00:00"
                    pattern="\d{2}:\d{2}:\d{2}"
                    required
                  />
                  {formData.timecodeStart && formData.timecodeEnd && !isValidTimeRange() && (
                    <p className="text-xs text-red-500">End time must be after start time</p>
                  )}
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button
                  type="button"
                  onClick={() => setActiveTab('visual')}
                  disabled={!isCurrentTabValid()}
                  className="bg-anime-purple hover:bg-anime-dark-purple"
                >
                  Next: Visual Design
                </Button>
              </div>
            </TabsContent>
            
            {/* Visual Design Tab */}
            <TabsContent value="visual" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="visualComposition">Visual Composition</Label>
                <Textarea
                  id="visualComposition"
                  name="visualComposition"
                  value={formData.visualComposition}
                  onChange={handleChange}
                  placeholder="Describe the visual composition of the scene..."
                  required
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lighting">Lighting</Label>
                  <Textarea
                    id="lighting"
                    name="lighting"
                    value={formData.lighting}
                    onChange={handleChange}
                    placeholder="Describe the lighting setup..."
                    className="min-h-[80px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="colorGrading">Color Grading</Label>
                  <Textarea
                    id="colorGrading"
                    name="colorGrading"
                    value={formData.colorGrading}
                    onChange={handleChange}
                    placeholder="Describe the color palette and grading..."
                    className="min-h-[80px]"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="soundDesign">Sound Design</Label>
                  <Textarea
                    id="soundDesign"
                    name="soundDesign"
                    value={formData.soundDesign}
                    onChange={handleChange}
                    placeholder="Describe the audio landscape..."
                    className="min-h-[80px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="specialEffects">Special Effects</Label>
                  <Textarea
                    id="specialEffects"
                    name="specialEffects"
                    value={formData.specialEffects}
                    onChange={handleChange}
                    placeholder="Describe any special effects needed..."
                    className="min-h-[80px]"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="keyframeImage">Keyframe Image (Optional)</Label>
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="w-full md:w-1/2">
                    <div className="border-2 border-dashed border-border rounded-md p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                      <Input
                        id="keyframeImage"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Label htmlFor="keyframeImage" className="cursor-pointer flex flex-col items-center justify-center gap-2">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {keyframePreview ? 'Change Image' : 'Upload Keyframe'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Upload a concept image, storyboard, or reference
                        </span>
                      </Label>
                    </div>
                  </div>
                  
                  {keyframePreview && (
                    <div className="w-full md:w-1/2">
                      <div className="aspect-video rounded-md overflow-hidden bg-anime-gray-200">
                        <img 
                          src={keyframePreview} 
                          alt="Keyframe preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="pt-4 flex justify-between">
                <Button type="button" variant="outline" onClick={() => setActiveTab('basics')}>
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={() => setActiveTab('content')}
                  disabled={!isCurrentTabValid()}
                  className="bg-anime-purple hover:bg-anime-dark-purple"
                >
                  Next: Content
                </Button>
              </div>
            </TabsContent>
            
            {/* Content Tab */}
            <TabsContent value="content" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="description">Scene Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe what happens in the scene..."
                  required
                  className="min-h-[150px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dialog">Dialog</Label>
                <Textarea
                  id="dialog"
                  name="dialog"
                  value={formData.dialog}
                  onChange={handleChange}
                  placeholder="CHARACTER NAME: Dialog text..."
                  className="min-h-[150px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="transitions">Transitions & Notes</Label>
                <Textarea
                  id="transitions"
                  name="transitions"
                  value={formData.transitions}
                  onChange={handleChange}
                  placeholder="Describe any scene transitions, flashbacks, or narrative techniques..."
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="pt-4 flex justify-between">
                <Button type="button" variant="outline" onClick={() => setActiveTab('visual')}>
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={() => setActiveTab('meta')}
                  disabled={!isCurrentTabValid()}
                  className="bg-anime-purple hover:bg-anime-dark-purple"
                >
                  Next: Meta & Notes
                </Button>
              </div>
            </TabsContent>
            
            {/* Meta Tab */}
            <TabsContent value="meta" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="productionNotes">Production Notes</Label>
                <Textarea
                  id="productionNotes"
                  name="productionNotes"
                  value={formData.productionNotes}
                  onChange={handleChange}
                  placeholder="Add any notes for the production team..."
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emotionalSignificance">Emotional Significance</Label>
                <Select
                  value={formData.emotionalSignificance}
                  onValueChange={(value) => handleSelectChange('emotionalSignificance', value as EmotionalSignificance)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select scene significance" />
                  </SelectTrigger>
                  <SelectContent>
                    {emotionalSignificanceOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emotionalNotes">Emotional Context Notes (Optional)</Label>
                <Textarea
                  id="emotionalNotes"
                  name="emotionalNotes"
                  value={formData.emotionalNotes || ''}
                  onChange={handleChange}
                  placeholder="Explain the emotional context or importance of the scene..."
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="pt-4 flex justify-between">
                <Button type="button" variant="outline" onClick={() => setActiveTab('content')}>
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={!isFormValid()}
                  className="bg-anime-purple hover:bg-anime-dark-purple"
                >
                  Create Scene
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewSceneModal;
