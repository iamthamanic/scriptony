import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EditProjectFormData, Project, ProjectType, Genre, VideoFormat } from '../types';
import { genreOptions, projectTypeOptions, videoFormatOptions } from '../utils/mockData';
import { X, Plus, Upload, HelpCircle } from 'lucide-react';
import { getStructureOptions } from '../types/narrativeStructures';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { narrativeStructureTemplates } from '../types/narrativeStructures';

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EditProjectFormData) => void;
  project: Project;
}

const EditProjectModal = ({ isOpen, onClose, onSubmit, project }: EditProjectModalProps) => {
  // Ensure inspirations is always an array before initializing state
  const normalizeInspirations = (rawInspirations: string[] | string | undefined): string[] => {
    if (!rawInspirations) return [];
    if (Array.isArray(rawInspirations)) return rawInspirations;
    if (typeof rawInspirations === 'string') {
      // Handle comma-separated string format
      return rawInspirations.split(',').map(item => item.trim()).filter(Boolean);
    }
    console.warn("Unexpected inspirations format:", rawInspirations);
    return [];
  };

  const [formData, setFormData] = useState<EditProjectFormData>({
    title: project.title,
    type: project.type,
    videoFormat: project.videoFormat,
    logline: project.logline,
    genres: project.genres,
    duration: project.duration,
    inspirations: normalizeInspirations(project.inspirations),
    coverImage: project.coverImage || undefined,
    narrativeStructure: project.narrativeStructure
  });
  
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    project.coverImage || null
  );
  
  const [structureOptions, setStructureOptions] = useState(
    getStructureOptions(project.type)
  );

  useEffect(() => {
    // Initialize form data when project changes
    setFormData({
      title: project.title,
      type: project.type,
      videoFormat: project.videoFormat,
      logline: project.logline,
      genres: project.genres,
      duration: project.duration,
      inspirations: normalizeInspirations(project.inspirations),
      coverImage: project.coverImage || undefined,
      narrativeStructure: project.narrativeStructure
    });
    setCoverImagePreview(project.coverImage || null);
    setStructureOptions(getStructureOptions(project.type));
  }, [project]);

  useEffect(() => {
    // Update narrative structure options when project type changes
    setStructureOptions(getStructureOptions(formData.type));
    
    // Reset narrative structure if the current one isn't available in the new options
    const availableValues = structureOptions.map(option => option.value);
    if (formData.narrativeStructure && !availableValues.includes(formData.narrativeStructure)) {
      setFormData(prev => ({ ...prev, narrativeStructure: 'none' }));
    }
  }, [formData.type, formData.videoFormat]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      type: value as ProjectType,
      // Reset videoFormat when not social_video 
      videoFormat: value === 'social_video' ? 'shortform' : undefined
    }));
  };

  const handleVideoFormatChange = (value: string) => {
    setFormData(prev => ({ ...prev, videoFormat: value as VideoFormat }));
  };

  const handleNarrativeStructureChange = (value: string) => {
    setFormData(prev => ({ ...prev, narrativeStructure: value as any }));
  };

  const handleGenreToggle = (genre: Genre) => {
    setFormData(prev => {
      if (prev.genres.includes(genre)) {
        return { ...prev, genres: prev.genres.filter(g => g !== genre) };
      } else {
        return { ...prev, genres: [...prev.genres, genre] };
      }
    });
  };

  const handleAddInspiration = () => {
    setFormData(prev => ({
      ...prev,
      inspirations: [...prev.inspirations, '']
    }));
  };

  const handleInspirationChange = (index: number, value: string) => {
    setFormData(prev => {
      const newInspirations = [...prev.inspirations];
      newInspirations[index] = value;
      return { ...prev, inspirations: newInspirations };
    });
  };

  const handleRemoveInspiration = (index: number) => {
    setFormData(prev => {
      const newInspirations = [...prev.inspirations];
      newInspirations.splice(index, 1);
      return { ...prev, inspirations: newInspirations };
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, coverImage: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter out any empty inspirations
    const cleanedData = {
      ...formData,
      inspirations: formData.inspirations.filter(inspiration => inspiration.trim() !== '')
    };
    onSubmit(cleanedData);
  };
  
  // Find the description for the current narrative structure
  const currentStructureDescription = structureOptions.find(
    option => option.value === formData.narrativeStructure
  )?.description || '';

  const getStructureTooltipDescription = (value: string) => {
    const template = narrativeStructureTemplates[value];
    if (!template) return '';
    return template.description || '';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-anime-purple">Edit Project</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter project title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Project Type</Label>
              <Select
                value={formData.type}
                onValueChange={handleTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  {projectTypeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Conditionally show video format selector for social_video */}
          {formData.type === 'social_video' && (
            <div className="space-y-2">
              <Label htmlFor="videoFormat">Video Format</Label>
              <Select
                value={formData.videoFormat || 'shortform'}
                onValueChange={handleVideoFormatChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select video format" />
                </SelectTrigger>
                <SelectContent>
                  {videoFormatOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="narrativeStructure">Narrative Structure</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-5 w-5">
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4">
                  <h4 className="font-medium mb-2">Narrative Structure</h4>
                  <p className="text-sm text-muted-foreground">
                    Die Plotstruktur bestimmt den grundlegenden Aufbau deiner Geschichte. 
                    Basierend auf dem gewählten Projekttyp werden passende Strukturen angezeigt.
                  </p>
                </PopoverContent>
              </Popover>
            </div>
            <Select
              value={formData.narrativeStructure}
              onValueChange={handleNarrativeStructureChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select narrative structure" />
              </SelectTrigger>
              <SelectContent>
                <TooltipProvider>
                  {structureOptions.map(option => (
                    <Tooltip key={option.value}>
                      <TooltipTrigger asChild>
                        <SelectItem value={option.value}>
                          {option.label}
                        </SelectItem>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-sm">
                        <p>{getStructureTooltipDescription(option.value) || option.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </TooltipProvider>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              {currentStructureDescription}
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="logline">Logline</Label>
            <Textarea
              id="logline"
              name="logline"
              value={formData.logline}
              onChange={handleChange}
              placeholder="A brief summary of your project..."
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Genres</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {genreOptions.map(option => (
                <Button
                  key={option.value}
                  type="button"
                  variant={formData.genres.includes(option.value) ? "default" : "outline"}
                  className={formData.genres.includes(option.value) 
                    ? "bg-anime-purple hover:bg-anime-dark-purple text-white" 
                    : ""}
                  onClick={() => handleGenreToggle(option.value)}
                  size="sm"
                >
                  {option.label}
                </Button>
              ))}
            </div>
            {formData.genres.length === 0 && (
              <p className="text-xs text-muted-foreground mt-1">Please select at least one genre</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              name="duration"
              type="number"
              min={1}
              value={formData.duration || ''}
              onChange={handleChange}
              placeholder="Project duration in minutes"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Inspirations</Label>
            {formData.inspirations && formData.inspirations.length > 0 ? (
              formData.inspirations.map((inspiration, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={inspiration}
                    onChange={(e) => handleInspirationChange(index, e.target.value)}
                    placeholder={`Inspiration ${index + 1}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveInspiration(index)}
                    disabled={formData.inspirations.length <= 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="flex items-center gap-2">
                <Input
                  value=""
                  onChange={(e) => handleInspirationChange(0, e.target.value)}
                  placeholder="Inspiration 1"
                />
              </div>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddInspiration}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Inspiration
            </Button>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="coverImage">Cover Image</Label>
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="w-full md:w-1/2">
                <div className="border-2 border-dashed border-border rounded-md p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <Input
                    id="coverImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Label htmlFor="coverImage" className="cursor-pointer flex flex-col items-center justify-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {coverImagePreview ? 'Change Image' : 'Upload Image'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Recommended: 1200×630px
                    </span>
                  </Label>
                </div>
              </div>
              
              {coverImagePreview && (
                <div className="w-full md:w-1/2">
                  <div className="aspect-video rounded-md overflow-hidden bg-anime-gray-200">
                    <img 
                      src={coverImagePreview} 
                      alt="Cover preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-anime-purple hover:bg-anime-dark-purple"
              disabled={!formData.title || formData.genres.length === 0 || !formData.logline || formData.duration <= 0}
            >
              Update Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProjectModal;
