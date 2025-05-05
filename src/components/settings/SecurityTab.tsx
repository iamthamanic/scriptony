
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { LogOut } from 'lucide-react';

interface SecurityTabProps {
  onSignOut?: () => void;
}

const SecurityTab = ({ onSignOut }: SecurityTabProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="current-password">Current Password</Label>
        <Input id="current-password" type="password" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="new-password">New Password</Label>
        <Input id="new-password" type="password" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm New Password</Label>
        <Input id="confirm-password" type="password" />
      </div>
      
      <div className="flex justify-between items-center pt-4">
        <Button 
          variant="outline" 
          className="text-red-500 hover:bg-red-50"
          onClick={onSignOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
        
        <Button className="bg-anime-purple hover:bg-anime-dark-purple">
          Update Password
        </Button>
      </div>
    </div>
  );
};

export default SecurityTab;
