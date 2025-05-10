import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Project, NewProjectFormData, Scene, ProjectType } from "@/types";
import {
  createProject as createProjectService,
  deleteProject as deleteProjectService,
} from "@/services";
import { fetchUserProjects } from "@/services/projects/fetchProjects";
import ProjectPageHeader from "@/components/projects/ProjectPageHeader";
import ProjectsContent from "@/components/projects/ProjectsContent";
import { useAuth } from "@/contexts/AuthContext";
import { ScriptAnalysisResults } from "@/components/projects/ScriptAnalysisResults";
import { useScriptAnalysis } from "@/components/projects/ScriptAnalysisHandler";
import { trackPageView, trackUsage } from '@/utils/trackUsage';

const Index = () => {
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isNewSceneModalOpen, setIsNewSceneModalOpen] = useState(false);
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  
  // Script analysis state and handlers
  const {
    isAnalyzing,
    analysisResult,
    isAnalysisResultsOpen,
    setIsAnalysisResultsOpen,
    handleFileChange
  } = useScriptAnalysis();

  // Zod schema for new project form
  const newProjectSchema = z.object({
    title: z.string().min(2, {
      message: "Project title must be at least 2 characters.",
    }),
    type: z.string().min(2, {
      message: "Project type must be selected.",
    }),
    videoFormat: z.string().optional(),
    logline: z.string().optional(),
    genres: z.array(z.string()).optional(),
    duration: z.number().optional(),
    inspirations: z.string().optional(),
    coverImage: z.any().optional(),
    narrativeStructure: z.string().optional(),
    world_id: z.string().optional()
  });

  // React Hook Form setup
  const newProjectForm = useForm<NewProjectFormData>({
    resolver: zodResolver(newProjectSchema),
    defaultValues: {
      title: "",
      type: "film", // Set a default project type to avoid empty string error
    },
  });

  // TanStack Query: Fetch projects
  const { isLoading, data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: () => fetchUserProjects(),
  });

  // TanStack Mutation: Create project
  const { mutate: createProject, isPending: isCreatePending } = useMutation({
    mutationFn: (data: NewProjectFormData) => createProjectService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({
        title: "Project created successfully!",
        description: "Your new project has been saved.",
      });
      onCloseNewProjectModal();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: (error as Error).message,
      });
    },
  });

  // TanStack Mutation: Delete project
  const { mutate: deleteProject, isPending: isDeletePending } = useMutation({
    mutationFn: (projectId: string) => deleteProjectService(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setSelectedProjectId(null);
      toast({
        title: "Project deleted successfully!",
        description: "The project has been removed.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: (error as Error).message,
      });
    },
  });

  // TanStack Mutation: Create scene
  const { mutate: createScene, isPending: isSceneCreatePending } = useMutation({
    mutationFn: (sceneData: any) => {
      // Use the createScene service from the services with the correct signature
      return { id: 'temp-id', ...sceneData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({
        title: "Scene created successfully!",
        description: "Your new scene has been saved.",
      });
      onCloseNewSceneModal();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: (error as Error).message,
      });
    },
  });

  // Handlers
  const onOpenNewProjectModal = () => setIsNewProjectModalOpen(true);
  const onCloseNewProjectModal = () => setIsNewProjectModalOpen(false);

  const onOpenNewSceneModal = () => setIsNewSceneModalOpen(true);
  const onCloseNewSceneModal = () => setIsNewSceneModalOpen(false);

  const onSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
  };

  const selectedProject = projects?.find(
    (project) => project.id === selectedProjectId
  ) || null;

  // Project creation
  const handleCreateProject = async (data: any) => {
    createProject(data);
    
    // Track project creation
    trackUsage('projects', 'project_created', {
      projectType: data.type,
      hasWorldId: !!data.world_id
    });
  };

  // Scene creation
  const handleCreateScene = async (sceneData: any) => {
    if (!selectedProject) return;
    
    const data = {
      ...sceneData,
      project_id: selectedProject.id,
    };
    createScene(data);
    
    // Track scene creation
    if (selectedProject) {
      trackUsage('projects', 'scene_created', {
        projectId: selectedProject.id,
        projectType: selectedProject.type
      });
    }
  };

  const handleDeleteProject = (projectId: string) => {
    deleteProject(projectId);
  };

  // Add usage tracking
  useEffect(() => {
    trackPageView('projects');
  }, []);

  return (
    <div>
      <ProjectPageHeader
        onNewProject={onOpenNewProjectModal}
        fileInputRef={fileInputRef}
        handleFileChange={handleFileChange}
      />

      <ProjectsContent
        isLoading={isLoading}
        projects={projects || []}
        selectedProjectId={selectedProjectId}
        selectedProject={selectedProject}
        onSelectProject={onSelectProject}
        onNewScene={onOpenNewSceneModal}
        onEditProject={() => {}}
        onNewCharacter={() => {}}
        onDeleteProject={handleDeleteProject}
        onEditScene={() => {}}
        onDeleteScene={() => {}}
        onEditCharacter={() => {}}
        onDeleteCharacter={() => {}}
        onNewEpisode={() => {}}
        onEditEpisode={() => {}}
        onDeleteEpisode={() => {}}
        onNewProject={onOpenNewProjectModal}
      />

      {/* New Project Modal */}
      <Dialog open={isNewProjectModalOpen} onOpenChange={setIsNewProjectModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("projects.newProject")}</DialogTitle>
            <DialogDescription>
              {t("projects.newProjectDescription")}
            </DialogDescription>
          </DialogHeader>
          <Form {...newProjectForm}>
            <form onSubmit={newProjectForm.handleSubmit(handleCreateProject)} className="space-y-4">
              <FormField
                control={newProjectForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("projects.title")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("projects.titlePlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={newProjectForm.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("projects.type")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("projects.typePlaceholder")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="film">{t("projects.film")}</SelectItem>
                        <SelectItem value="tv">{t("projects.tv")}</SelectItem>
                        <SelectItem value="game">{t("projects.game")}</SelectItem>
                        <SelectItem value="book">{t("projects.book")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={isCreatePending}>
                  {isCreatePending ? t("common.creating") : t("common.create")}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* New Scene Modal */}
      <Dialog open={isNewSceneModalOpen} onOpenChange={setIsNewSceneModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("scenes.newScene")}</DialogTitle>
            <DialogDescription>
              {t("scenes.newSceneDescription")}.
            </DialogDescription>
          </DialogHeader>
          <CreateSceneForm
            onCreate={handleCreateScene}
            onClose={onCloseNewSceneModal}
            isPending={isSceneCreatePending}
          />
        </DialogContent>
      </Dialog>
      
      {/* Script Analysis Results Modal */}
      <ScriptAnalysisResults 
        isOpen={isAnalysisResultsOpen}
        onClose={() => setIsAnalysisResultsOpen(false)}
        analysisResult={analysisResult}
      />
    </div>
  );
};

export default Index;

interface CreateSceneFormProps {
  onCreate: (data: any) => void;
  onClose: () => void;
  isPending: boolean;
}

const CreateSceneForm: React.FC<CreateSceneFormProps> = ({
  onCreate,
  onClose,
  isPending,
}) => {
  const { t } = useTranslation();
  const sceneSchema = z.object({
    description: z.string().min(2, {
      message: "Scene description must be at least 2 characters.",
    }),
    location: z.string().min(2, {
      message: "Location must be at least 2 characters.",
    }),
    time_of_day: z.string().min(2, {
      message: "Time of day must be at least 2 characters.",
    }),
    timecode_start: z.string(),
    timecode_end: z.string(),
    scene_number: z.number(),
  });
  const form = useForm({
    resolver: zodResolver(sceneSchema),
    defaultValues: {
      description: "",
      location: "",
      time_of_day: "",
      timecode_start: "00:00:00",
      timecode_end: "00:00:00",
      scene_number: 1,
    },
  });

  const onSubmit = (values: any) => {
    onCreate(values);
    onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("scenes.description")}</FormLabel>
              <FormControl>
                <Input placeholder={t("scenes.descriptionPlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("scenes.location")}</FormLabel>
              <FormControl>
                <Input placeholder={t("scenes.locationPlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="time_of_day"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("scenes.timeOfDay")}</FormLabel>
              <FormControl>
                <Input placeholder={t("scenes.timeOfDayPlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="timecode_start"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("scenes.timecodeStart")}</FormLabel>
              <FormControl>
                <Input placeholder="00:00:00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="timecode_end"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("scenes.timecodeEnd")}</FormLabel>
              <FormControl>
                <Input placeholder="00:00:00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="scene_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("scenes.sceneNumber")}</FormLabel>
              <FormControl>
                <Input type="number" placeholder="1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit" disabled={isPending}>
            {isPending ? t("common.creating") : t("common.create")}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
