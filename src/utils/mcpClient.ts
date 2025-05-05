
import { supabase } from "@/integrations/supabase/client";

export type McpResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

export class McpClient {
  private apiKey: string;
  
  constructor(apiKey?: string) {
    this.apiKey = apiKey || '';
  }
  
  /**
   * Set the API key for authentication
   */
  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    return this;
  }
  
  /**
   * Get the MCP manifest with available functions
   */
  async getManifest(): Promise<McpResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('mcp/manifest');
      
      if (error) {
        throw error;
      }
      
      return { success: true, data };
    } catch (err) {
      console.error('Failed to fetch MCP manifest:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Unknown error' 
      };
    }
  }
  
  /**
   * Execute a function through the MCP API
   */
  async execute(functionName: string, args: any = {}): Promise<McpResponse> {
    if (!this.apiKey) {
      return { 
        success: false, 
        error: 'API key not set. Use setApiKey() before making requests.' 
      };
    }
    
    try {
      const { data, error } = await supabase.functions.invoke('mcp/execute', {
        body: { function: functionName, args },
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (err) {
      console.error(`Failed to execute MCP function ${functionName}:`, err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Unknown error' 
      };
    }
  }
  
  /**
   * Get the status of the MCP API
   */
  async getStatus(): Promise<McpResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('mcp/status');
      
      if (error) {
        throw error;
      }
      
      return { success: true, data };
    } catch (err) {
      console.error('Failed to fetch MCP status:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Unknown error' 
      };
    }
  }
}

// Create a default instance
export const mcpClient = new McpClient();

// Export a factory function to create new instances
export const createMcpClient = (apiKey?: string) => new McpClient(apiKey);
