
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchUserProjects } from '@/services';
import { ProjectType } from '@/types';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Define form schema for new project
const newProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.custom<ProjectType>((val) => {
    // Custom validator to ensure type is a valid ProjectType
    return ["movie", "series", "short", "theaterstück", "hörspiel", "buch", "social_video"].includes(val as string);
  }, "Please select a valid project type")
});

type NewProjectFormData = z.infer<typeof newProjectSchema>;

const Index = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Setup form with react-hook-form
  const newProjectForm = useForm<NewProjectFormData>({
    resolver: zodResolver(newProjectSchema),
    defaultValues: {
      title: "",
      type: "movie" // Using the correct ProjectType enum value
    }
  });

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      try {
        const userProjects = await fetchUserProjects();
        setProjects(userProjects);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  // Handle form submission
  const onSubmit = async (data: NewProjectFormData) => {
    try {
      // Implementation for project creation
      console.log('Creating project:', data);
      // After project creation, navigate to projects page
      navigate('/projects');
    } catch (err) {
      console.error('Error creating project:', err);
      setError('Failed to create project. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Welcome to Scriptony</CardTitle>
          <CardDescription>Your screenplay management platform</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <p className="mb-4">
            Get started by creating a new project or accessing your existing ones.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            onClick={() => navigate('/projects')}
            className="w-full"
          >
            Go to Projects
          </Button>
          <Button 
            onClick={() => navigate('/worldbuilding')}
            variant="outline" 
            className="w-full"
          >
            Explore Worldbuilding
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Index;
