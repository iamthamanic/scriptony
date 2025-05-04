
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AudioReference } from '../../types';
import { Play, Pause, Plus, X, Link, Upload, Music } from 'lucide-react';

interface AudioReferenceSelectorProps {
  references: AudioReference[];
  onChange: (references: AudioReference[]) => void;
  maxReferences?: number;
}

const AudioReferenceSelector = ({
  references,
  onChange,
  maxReferences = 5
}: AudioReferenceSelectorProps) => {
  const [isPlaying, setIsPlaying] = useState<Record<string, boolean>>({});
  const [showAddUrl, setShowAddUrl] = useState(false);
  const [newRefName, setNewRefName] = useState('');
  const [newRefUrl, setNewRefUrl] = useState('');
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handlePlayPause = (id: string, url: string) => {
    if (!audioRefs.current[id]) {
      audioRefs.current[id] = new Audio(url);
      
      // Add event listeners
      audioRefs.current[id]?.addEventListener('ended', () => {
        setIsPlaying(prev => ({ ...prev, [id]: false }));
      });
    }
    
    if (isPlaying[id]) {
      audioRefs.current[id]?.pause();
      setIsPlaying(prev => ({ ...prev, [id]: false }));
    } else {
      // Pause any currently playing audio
      Object.keys(isPlaying).forEach(key => {
        if (isPlaying[key]) {
          audioRefs.current[key]?.pause();
        }
      });
      
      // Reset all playing states
      setIsPlaying(Object.keys(isPlaying).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {} as Record<string, boolean>));
      
      // Play the selected audio
      audioRefs.current[id]?.play();
      setIsPlaying(prev => ({ ...prev, [id]: true }));
    }
  };
  
  const handleRemoveReference = (id: string) => {
    // Stop playing if it's playing
    if (isPlaying[id]) {
      audioRefs.current[id]?.pause();
    }
    
    // Remove from audio refs
    delete audioRefs.current[id];
    
    // Remove from playing state
    const newIsPlaying = { ...isPlaying };
    delete newIsPlaying[id];
    setIsPlaying(newIsPlaying);
    
    // Update references
    onChange(references.filter(ref => ref.id !== id));
  };
  
  const handleAddUrlReference = () => {
    if (!newRefName || !newRefUrl) return;
    
    const newReference: AudioReference = {
      id: `audio-${Date.now()}`,
      name: newRefName,
      url: newRefUrl,
      isExternal: true
    };
    
    onChange([...references, newReference]);
    setNewRefName('');
    setNewRefUrl('');
    setShowAddUrl(false);
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    const newReference: AudioReference = {
      id: `audio-${Date.now()}`,
      name: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
      file: URL.createObjectURL(file),
      isExternal: false
    };
    
    onChange([...references, newReference]);
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>Audio References ({references.length}/{maxReferences})</Label>
        
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setShowAddUrl(!showAddUrl)}
            disabled={references.length >= maxReferences}
            className="flex items-center gap-1"
          >
            <Link className="h-3.5 w-3.5" />
            Add URL
          </Button>
          
          <Input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
            disabled={references.length >= maxReferences}
          />
          
          <Button
            type="button"
            size="sm"
            variant="default"
            onClick={() => fileInputRef.current?.click()}
            disabled={references.length >= maxReferences}
            className="bg-anime-purple hover:bg-anime-dark-purple flex items-center gap-1"
          >
            <Upload className="h-3.5 w-3.5" />
            Upload Audio
          </Button>
        </div>
      </div>
      
      {/* Add URL Form */}
      {showAddUrl && (
        <div className="bg-muted/40 p-3 rounded-md space-y-3">
          <div>
            <Label htmlFor="refName">Reference Name</Label>
            <Input
              id="refName"
              value={newRefName}
              onChange={(e) => setNewRefName(e.target.value)}
              placeholder="e.g., Fight Scene Music"
            />
          </div>
          
          <div>
            <Label htmlFor="refUrl">URL (YouTube, SoundCloud, direct link to audio)</Label>
            <Input
              id="refUrl"
              value={newRefUrl}
              onChange={(e) => setNewRefUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowAddUrl(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="default"
              size="sm"
              className="bg-anime-purple hover:bg-anime-dark-purple"
              onClick={handleAddUrlReference}
              disabled={!newRefName || !newRefUrl}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Reference
            </Button>
          </div>
        </div>
      )}
      
      {/* Audio References List */}
      {references.length > 0 ? (
        <div className="space-y-2">
          {references.map(ref => (
            <div 
              key={ref.id}
              className="flex items-center justify-between bg-muted/30 p-2 rounded-md"
            >
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handlePlayPause(ref.id, ref.url || ref.file || '')}
                  disabled={!ref.url && !ref.file}
                >
                  {isPlaying[ref.id] ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                
                <div>
                  <div className="font-medium text-sm">{ref.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Music className="h-3 w-3" />
                    {ref.isExternal ? 'External URL' : 'Uploaded Audio'}
                  </div>
                </div>
              </div>
              
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                onClick={() => handleRemoveReference(ref.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-muted/30 p-4 rounded-md text-center text-muted-foreground">
          <Music className="h-12 w-12 mx-auto mb-2 opacity-40" />
          <p>No audio references added yet.</p>
          <p className="text-sm">Add URLs or upload audio files for reference.</p>
        </div>
      )}
    </div>
  );
};

export default AudioReferenceSelector;
