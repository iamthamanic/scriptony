
import React from 'react';
import { Button } from '@/components/ui/button';
import { Code2Icon } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import McpManager from '../mcp/McpManager';

interface McpWorldIntegrationProps {}

const McpWorldIntegration: React.FC<McpWorldIntegrationProps> = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2">
          <Code2Icon className="h-4 w-4 mr-2" /> MCP Interface
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Model Context Protocol (MCP) Interface</DialogTitle>
          <DialogDescription>
            Connect external AI assistants to ScriptBuddy via the Model Context Protocol
          </DialogDescription>
        </DialogHeader>
        
        <McpManager />
      </DialogContent>
    </Dialog>
  );
};

export default McpWorldIntegration;
