import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EditProjectFormData, Genre, Project, ProjectType } from '../types';
import { genres, projectTypes } from '../utils/constants';

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EditProjectFormData) => void;
  project: Project;
}

const EditProjectModal = ({ isOpen, onClose, onSubmit, project }: EditProjectModalProps) => {
  const form = useForm<EditProjectFormData & { inspirations: string }>({
    defaultValues: {
      title: project.title,
      type: project.type,
      logline: project.logline,
      genres: project.genres,
      duration: project.duration,
      inspirations: project.inspirations.join(", "),
    }
  });

  const handleSubmit = (data: EditProjectFormData & { inspirations: string }) => {
    // Parse the comma-separated inspirations into an array
    const inspirationsArray = data.inspirations.split(',').map(item => item.trim()).filter(Boolean);
    
    onSubmit({
      ...data,
      inspirations: inspirationsArray,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter project title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {projectTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="logline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logline</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter a brief summary of your project" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="genres"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Genres</FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {genres.map(genre => (
                      <Button
                        key={genre}
                        type="button"
                        variant={field.value.includes(genre as Genre) ? "default" : "outline"}
                        className={field.value.includes(genre as Genre) ? "bg-anime-purple hover:bg-anime-dark-purple" : ""}
                        onClick={() => {
                          const updatedGenres = field.value.includes(genre as Genre)
                            ? field.value.filter(g => g !== genre)
                            : [...field.value, genre as Genre];
                          field.onChange(updatedGenres);
                        }}
                        size="sm"
                      >
                        {genre.charAt(0).toUpperCase() + genre.slice(1)}
                      </Button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="inspirations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inspirations</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter inspirations, separated by commas" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" className="bg-anime-purple hover:bg-anime-dark-purple">Update Project</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProjectModal;
