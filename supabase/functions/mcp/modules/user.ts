
import { McpFunction } from '../router.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export const getUserInfo: McpFunction = {
  description: "Gets information about a user",
  parameters: {
    user_id: {
      type: "string",
      description: "The user ID",
      required: true
    }
  },
  execute: async (args: any) => {
    const { user_id } = args;
    
    if (!user_id) {
      throw new Error("User ID is required");
    }

    // Get user data from auth.users (using service role)
    const { data: userData, error: userError } = await supabase
      .auth
      .admin
      .getUserById(user_id);

    if (userError) {
      throw new Error(`Failed to get user: ${userError.message}`);
    }

    // Get projects count
    const { count: projectCount, error: projectError } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user_id);

    if (projectError) {
      console.error("Failed to get project count:", projectError);
    }

    // Get worlds count
    const { count: worldCount, error: worldError } = await supabase
      .from('worlds')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user_id);

    if (worldError) {
      console.error("Failed to get world count:", worldError);
    }

    return {
      id: userData.user.id,
      email: userData.user.email,
      created_at: userData.user.created_at,
      last_sign_in_at: userData.user.last_sign_in_at,
      projectCount: projectCount || 0,
      worldCount: worldCount || 0
    };
  }
};

export const listCharacters: McpFunction = {
  description: "Lists characters for a project",
  parameters: {
    project_id: {
      type: "string",
      description: "The project ID",
      required: true
    }
  },
  execute: async (args: any) => {
    const { project_id } = args;
    
    if (!project_id) {
      throw new Error("Project ID is required");
    }

    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .eq('project_id', project_id);

    if (error) {
      throw new Error(`Failed to list characters: ${error.message}`);
    }

    return data;
  }
};
