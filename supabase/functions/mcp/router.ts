
import { functionModules } from './modules/index.ts';

export type McpFunction = {
  execute: (args: any) => Promise<any>;
  description: string;
  parameters: Record<string, {
    type: string;
    description: string;
    required?: boolean;
    enum?: string[];
  }>;
};

class FunctionRouter {
  private functions: Map<string, McpFunction> = new Map();

  constructor() {
    this.registerFunctions();
  }

  private registerFunctions() {
    // Register all functions from our modules
    for (const [namespace, module] of Object.entries(functionModules)) {
      for (const [funcName, func] of Object.entries(module)) {
        const fullName = `${namespace}.${funcName}`;
        this.functions.set(fullName, func as McpFunction);
        console.log(`Registered MCP function: ${fullName}`);
      }
    }
  }

  async executeFunction(name: string, args: any): Promise<any> {
    const func = this.functions.get(name);
    
    if (!func) {
      throw new Error(`Function ${name} not found`);
    }
    
    try {
      // Execute the function with the provided arguments
      const result = await func.execute(args);
      return { success: true, data: result };
    } catch (error) {
      console.error(`Error executing function ${name}:`, error);
      return { 
        success: false, 
        error: error.message || 'Unknown error',
        name 
      };
    }
  }

  listFunctions(): string[] {
    return Array.from(this.functions.keys());
  }

  getFunctionDetails(name: string): McpFunction | undefined {
    return this.functions.get(name);
  }

  getAllFunctions(): Map<string, McpFunction> {
    return this.functions;
  }
}

export const router = new FunctionRouter();
