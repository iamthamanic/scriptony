import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NewProjectFormData, ProjectType, Genre, VideoFormat, World } from '../types';
import { genreOptions, projectTypeOptions, videoFormatOptions } from '../utils/mockData';
import { X, Plus, Upload } from 'lucide-react';
import WorldSelector from './worlds/WorldSelector';
import { fetchUserWorlds, createWorld } from '../services/worlds';
import { useToast } from '@/hooks/use-toast';
import NewWorldModal from './worlds/NewWorldModal';
import NarrativeStructureSelector from './narrative-structures/NarrativeStructureSelector';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewProjectFormData) => void;
}

const NewProjectModal = ({ isOpen, onClose, onSubmit }: NewProjectModalProps) => {
  const [formData, setFormData] = useState<NewProjectFormData>({
    title: '',
    type: 'movie',
    logline: '',
    genres: [],
    duration: 0,
    inspirations: [''],
    narrativeStructure: 'none'
  });
  
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [worlds, setWorlds] = useState<World[]>([]);
  const [isNewWorldModalOpen, setIsNewWorldModalOpen] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    if (isOpen) {
      // Load worlds when modal opens
      const loadWorlds = async () => {
        try {
          const worldsData = await fetchUserWorlds();
          setWorlds(worldsData);
        } catch (error) {
          console.error('Error loading worlds:', error);
        }
      };
      
      loadWorlds();
    }
  }, [isOpen]);

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
    setFormData(prev => ({ 
      ...prev, 
      narrativeStructure: value as any 
    }));
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
  
  const handleWorldSelection = (worldId: string | null) => {
    setFormData(prev => ({ ...prev, world_id: worldId }));
  };
  
  const handleCreateWorld = async (worldData) => {
    try {
      const newWorld = await createWorld(worldData);
      setWorlds([newWorld, ...worlds]);
      setFormData(prev => ({ ...prev, world_id: newWorld.id }));
      setIsNewWorldModalOpen(false);
      
      toast({
        title: 'Welt erstellt',
        description: `"${worldData.name}" wurde erfolgreich erstellt und mit dem Projekt verknüpft.`
      });
    } catch (error) {
      console.error('Error creating world:', error);
      toast({
        title: 'Fehler',
        description: 'Die Welt konnte nicht erstellt werden.',
        variant: 'destructive'
      });
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-anime-purple">Create New Project</DialogTitle>
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
          
          <NarrativeStructureSelector
            value={formData.narrativeStructure}
            onValueChange={handleNarrativeStructureChange}
            projectType={formData.type}
            videoFormat={formData.videoFormat}
          />
          
          <div className="space-y-2">
            <Label htmlFor="worldId">Welt verknüpfen (optional)</Label>
            <WorldSelector
              worlds={worlds}
              selectedWorldId={formData.world_id}
              onSelectWorld={handleWorldSelection}
              onCreateWorld={() => setIsNewWorldModalOpen(true)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Verknüpfe dein Projekt mit einer Welt für umfangreiches Worldbuilding.
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
            {formData.inspirations.map((inspiration, index) => (
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
            ))}
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
            <Label htmlFor="coverImage">Cover Image (Optional)</Label>
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
              Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
      
      <NewWorldModal
        isOpen={isNewWorldModalOpen}
        onClose={() => setIsNewWorldModalOpen(false)}
        onSubmit={handleCreateWorld}
      />
    </Dialog>
  );
};

export default NewProjectModal;
