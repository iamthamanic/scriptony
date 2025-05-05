
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ProfileTabProps {
  accountName: string;
  accountEmail: string;
}

const ProfileTab = ({ accountName, accountEmail }: ProfileTabProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" defaultValue={accountName} />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" defaultValue={accountEmail} />
      </div>
      
      <div className="flex justify-end">
        <Button className="bg-anime-purple hover:bg-anime-dark-purple">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default ProfileTab;
