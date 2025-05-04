import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NewSceneFormData, Scene, Character, Episode, ProjectType, TimeOfDay, EmotionalSignificance } from '../types';
import { timeOfDayOptions, emotionalSignificanceOptions } from '../utils/constants';
import { Upload, Clock, Image, Save, Check } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import CharacterSelector from './CharacterSelector';

interface NewSceneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewSceneFormData) => void;
  projectType: ProjectType; // Updated to use the full ProjectType type
  lastSceneNumber: number;
  editScene: Scene | null;
  characters: Character[];
  episodes: Episode[];
  selectedEpisodeId: string | null;
}

const NewSceneModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  projectType, 
  lastSceneNumber, 
  editScene, 
  characters = [],
  episodes = [],
  selectedEpisodeId = null
}: NewSceneModalProps) => {
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
    characterIds: [],
  });
  
  const [keyframePreview, setKeyframePreview] = useState<string | null>(null);
  const [isFormDirty, setIsFormDirty] = useState<boolean>(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState<boolean>(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Initialize form data with edit scene data if available
  useEffect(() => {
    if (editScene) {
      setFormData({
        sceneNumber: editScene.sceneNumber,
        location: editScene.location,
        timeOfDay: editScene.timeOfDay,
        timecodeStart: editScene.timecodeStart,
        timecodeEnd: editScene.timecodeEnd,
        visualComposition: editScene.visualComposition,
        lighting: editScene.lighting,
        colorGrading: editScene.colorGrading,
        soundDesign: editScene.soundDesign,
        specialEffects: editScene.specialEffects,
        description: editScene.description,
        dialog: editScene.dialog,
        transitions: editScene.transitions,
        productionNotes: editScene.productionNotes,
        emotionalSignificance: editScene.emotionalSignificance,
        episodeId: editScene.episodeId,
        episodeTitle: editScene.episodeTitle,
        emotionalNotes: editScene.emotionalNotes,
        characterIds: editScene.characterIds || [],
      });
      
      if (editScene.keyframeImage) {
        setKeyframePreview(editScene.keyframeImage);
      }
      
      setLastSaved(editScene.updatedAt);
    } else {
      // Reset form data when creating a new scene
      // If we have a selected episode for a series, pre-populate the episode fields
      const selectedEpisode = projectType === 'series' && selectedEpisodeId 
        ? episodes.find(ep => ep.id === selectedEpisodeId)
        : null;
        
      setFormData({
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
        characterIds: [],
        ...(selectedEpisode ? {
          episodeId: selectedEpisode.id,
          episodeTitle: selectedEpisode.title
        } : {})
      });
      setKeyframePreview(null);
      setLastSaved(null);
    }
    setIsFormDirty(false);
  }, [editScene, lastSceneNumber, projectType, selectedEpisodeId, episodes]);

  // AutoSave function
  useEffect(() => {
    if (autoSaveEnabled && isFormDirty) {
      const timer = setTimeout(() => {
        handleSave();
      }, 5000); // Auto-save after 5 seconds of inactivity
      
      return () => clearTimeout(timer);
    }
  }, [formData, isFormDirty, autoSaveEnabled]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsFormDirty(true);
  };

  const handleSelectChange = (name: string, value: string) => {
    // If this is the episodeId being changed, also update the episodeTitle
    if (name === 'episodeId' && value) {
      const selectedEpisode = episodes.find(ep => ep.id === value);
      if (selectedEpisode) {
        setFormData(prev => ({ 
          ...prev, 
          [name]: value,
          episodeTitle: selectedEpisode.title
        }));
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setIsFormDirty(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, keyframeImage: file }));
      setIsFormDirty(true);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setKeyframePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setIsFormDirty(false);
  };
  
  const handleSave = () => {
    if (isFormDirty && isFormValid()) {
      onSubmit(formData);
      setIsFormDirty(false);
      setLastSaved(new Date());
      
      toast({
        title: "Scene Saved",
        description: "Your changes have been saved successfully.",
        duration: 3000,
      });
    }
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

  // Check if the form is valid
  const isFormValid = (): boolean => {
    // For series projects, we need an episodeId
    if (projectType === 'series' && !formData.episodeId) {
      return false;
    }

    return (
      !!formData.location &&
      !!formData.timecodeStart &&
      !!formData.timecodeEnd &&
      isValidTimeRange() &&
      !!formData.visualComposition &&
      !!formData.description
    );
  };

  const handleCharacterToggle = (characterId: string) => {
    setFormData(prev => {
      const characterIds = prev.characterIds || [];
      if (characterIds.includes(characterId)) {
        return { 
          ...prev, 
          characterIds: characterIds.filter(id => id !== characterId) 
        };
      } else {
        return { 
          ...prev, 
          characterIds: [...characterIds, characterId] 
        };
      }
    });
    setIsFormDirty(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-anime-purple">
            {editScene 
              ? `Edit Scene ${editScene.sceneNumber}${formData.episodeTitle ? ` - ${formData.episodeTitle}` : ''}` 
              : 'Create New Scene'}
          </DialogTitle>
          <DialogDescription>
            {editScene ? 'Edit the details of your scene' : 'Fill in the details to create a new scene'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Keyframe image at the top */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              {keyframePreview ? (
                <div className="w-full rounded-md overflow-hidden bg-anime-gray-200">
                  <img 
                    src={keyframePreview} 
                    alt="Keyframe preview" 
                    className="w-full object-cover max-h-[200px]"
                  />
                </div>
              ) : (
                <div className="w-full border-2 border-dashed border-border rounded-md p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors flex flex-col items-center justify-center">
                  <Image className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">No keyframe image yet</p>
                  <p className="text-xs text-muted-foreground">Upload a concept image, storyboard, or reference</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-center mt-2">
              <Input
                id="keyframeImage"
                name="keyframeImage"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                ref={fileInputRef}
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleUploadButtonClick}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                {keyframePreview ? 'Change Image' : 'Upload Keyframe'}
              </Button>
            </div>
          </div>
          
          {/* Save button section */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-muted/30 p-3 rounded-md">
            <div className="flex items-center gap-2 mb-2 sm:mb-0">
              <Button 
                type="button" 
                onClick={handleSave} 
                disabled={!isFormDirty || !isFormValid()}
                className="bg-anime-purple hover:bg-anime-dark-purple"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <input 
                  type="checkbox" 
                  id="autoSave"
                  checked={autoSaveEnabled}
                  onChange={() => setAutoSaveEnabled(!autoSaveEnabled)}
                  className="h-4 w-4"
                />
                <Label htmlFor="autoSave" className="cursor-pointer">Auto-save</Label>
              </div>
            </div>
            
            {lastSaved && (
              <div className="text-xs text-muted-foreground flex items-center">
                {isFormDirty ? (
                  <span className="text-yellow-600 flex items-center gap-1">
                    Unsaved changes
                  </span>
                ) : (
                  <span className="text-green-600 flex items-center gap-1">
                    <Check className="h-3 w-3" /> Last saved: {lastSaved.toLocaleTimeString()}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Accordion Sections */}
          <Accordion type="single" collapsible className="w-full" defaultValue="basic-info">
            {/* Basic Info Section */}
            <AccordionItem value="basic-info">
              <AccordionTrigger className="text-lg font-medium py-2 hover:no-underline">
                Basic Info
              </AccordionTrigger>
              <AccordionContent className="py-4 space-y-4">
                {/* Scene number and episode selection for series */}
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
                      <Label htmlFor="episodeId">Episode</Label>
                      <Select
                        value={formData.episodeId || ''}
                        onValueChange={(value) => handleSelectChange('episodeId', value)}
                        disabled={!!editScene} // Disable changing episodes for existing scenes
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select episode" />
                        </SelectTrigger>
                        <SelectContent>
                          {episodes.map(episode => (
                            <SelectItem key={episode.id} value={episode.id}>
                              Episode {episode.number}: {episode.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {!formData.episodeId && projectType === 'series' && (
                        <p className="text-xs text-red-500 mt-1">
                          You must select an episode for series projects
                        </p>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Image preview in Basic Info section */}
                {keyframePreview && (
                  <div className="mt-2 p-2 bg-muted/30 rounded-md">
                    <img 
                      src={keyframePreview} 
                      alt="Keyframe preview" 
                      className="max-h-[100px] object-contain mx-auto"
                    />
                  </div>
                )}
                
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
                
                {/* Add Character Selector if characters are provided */}
                {characters && characters.length > 0 && (
                  <div className="space-y-2 mt-4">
                    <CharacterSelector
                      characters={characters}
                      selectedCharacterIds={formData.characterIds || []}
                      onSelectCharacter={handleCharacterToggle}
                    />
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
            
            {/* Visual Design Section */}
            <AccordionItem value="visual-design">
              <AccordionTrigger className="text-lg font-medium py-2 hover:no-underline">
                Visual Design
              </AccordionTrigger>
              <AccordionContent className="py-4 space-y-4">
                {/* Image preview in Visual Design section */}
                {keyframePreview && (
                  <div className="mt-2 p-2 bg-muted/30 rounded-md">
                    <img 
                      src={keyframePreview} 
                      alt="Keyframe preview" 
                      className="max-h-[100px] object-contain mx-auto"
                    />
                  </div>
                )}
                
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
              </AccordionContent>
            </AccordionItem>
            
            {/* Content Section */}
            <AccordionItem value="content">
              <AccordionTrigger className="text-lg font-medium py-2 hover:no-underline">
                Content
              </AccordionTrigger>
              <AccordionContent className="py-4 space-y-4">
                {/* Image preview in Content section */}
                {keyframePreview && (
                  <div className="mt-2 p-2 bg-muted/30 rounded-md">
                    <img 
                      src={keyframePreview} 
                      alt="Keyframe preview" 
                      className="max-h-[100px] object-contain mx-auto"
                    />
                  </div>
                )}
                
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
              </AccordionContent>
            </AccordionItem>
            
            {/* Meta & Notes Section */}
            <AccordionItem value="meta-notes">
              <AccordionTrigger className="text-lg font-medium py-2 hover:no-underline">
                Meta & Notes
              </AccordionTrigger>
              <AccordionContent className="py-4 space-y-4">
                {/* Image preview in Meta & Notes section */}
                {keyframePreview && (
                  <div className="mt-2 p-2 bg-muted/30 rounded-md">
                    <img 
                      src={keyframePreview} 
                      alt="Keyframe preview" 
                      className="max-h-[100px] object-contain mx-auto"
                    />
                  </div>
                )}
                
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
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <DialogFooter className="pt-4 flex justify-between">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid()}
              className="bg-anime-purple hover:bg-anime-dark-purple"
            >
              {editScene ? 'Update Scene' : 'Create Scene'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewSceneModal;
