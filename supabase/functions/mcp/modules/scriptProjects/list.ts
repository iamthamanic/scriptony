
import { McpFunction } from '../../router.ts';
import { supabase } from './utils.ts';

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
