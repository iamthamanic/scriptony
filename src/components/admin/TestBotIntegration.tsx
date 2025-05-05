
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TestTubeIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';

interface TestBotIntegrationProps {
  isAdmin: boolean;
}

const TestBotIntegration: React.FC<TestBotIntegrationProps> = ({ isAdmin }) => {
  const [open, setOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  
  const handleOpenDashboard = () => {
    setOpen(false);
    navigate('/admin/tests');
  };
  
  if (!isAdmin) return null;
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2">
          <TestTubeIcon className="h-4 w-4 mr-2" /> TestBot
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ScriptonyTestBot</DialogTitle>
          <DialogDescription>
            Automated testing system for Scriptony features
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <p>
            The ScriptonyTestBot automatically tests all features in Scriptony to ensure everything works as expected.
          </p>
          
          <h3 className="font-medium">Core Functions:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Automatically detects new features and creates test cases</li>
            <li>Runs tests on a scheduled basis (daily at 3:00 AM)</li>
            <li>Provides detailed reports on test results</li>
            <li>Captures screenshots of test failures for debugging</li>
          </ul>
          
          <div className="border rounded-md p-4 bg-muted">
            <h4 className="font-medium mb-2">Current Status</h4>
            <p className="text-sm">
              The TestBot dashboard provides real-time information about test coverage and results.
            </p>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleOpenDashboard}>
            Open TestBot Dashboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TestBotIntegration;
