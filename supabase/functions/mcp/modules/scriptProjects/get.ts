
import { McpFunction } from '../../router.ts';
import { supabase } from './utils.ts';

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
