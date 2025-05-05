
import { McpFunction } from '../router.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export const createProject: McpFunction = {
  description: "Creates a new script project",
  parameters: {
    title: {
      type: "string",
      description: "The title of the new project",
      required: true
    },
    description: {
      type: "string",
      description: "A description of the project"
    },
    type: {
      type: "string",
      description: "The type of project",
      enum: ["film", "series", "book", "audio", "social_video"]
    },
    user_id: {
      type: "string",
      description: "The user ID who owns this project",
      required: true
    }
  },
  execute: async (args: any) => {
    const { title, description, type = 'film', user_id } = args;
    
    if (!title) {
      throw new Error("Project title is required");
    }
    
    if (!user_id) {
      throw new Error("User ID is required");
    }

    // Create the project in the database
    const { data, error } = await supabase
      .from('projects')
      .insert({
        title,
        description,
        type,
        user_id
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create project: ${error.message}`);
    }

    return data;
  }
};

export const getProject: McpFunction = {
  description: "Retrieves a script project by ID",
  parameters: {
    project_id: {
      type: "string",
      description: "The ID of the project to retrieve",
      required: true
    }
  },
  execute: async (args: any) => {
    const { project_id } = args;
    
    if (!project_id) {
      throw new Error("Project ID is required");
    }

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', project_id)
      .single();

    if (error) {
      throw new Error(`Failed to retrieve project: ${error.message}`);
    }

    return data;
  }
};

export const listProjects: McpFunction = {
  description: "Lists all projects for a user",
  parameters: {
    user_id: {
      type: "string",
      description: "The user ID to list projects for",
      required: true
    }
  },
  execute: async (args: any) => {
    const { user_id } = args;
    
    if (!user_id) {
      throw new Error("User ID is required");
    }

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to list projects: ${error.message}`);
    }

    return data;
  }
};
