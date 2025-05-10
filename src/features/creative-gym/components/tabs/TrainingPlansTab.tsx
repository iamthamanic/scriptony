
import React from 'react';
import { Button } from '@/components/ui/button';

const TrainingPlansTab = () => {
  return (
    <>
      <div className="mb-8 p-6 border rounded-lg bg-muted/20">
        <h3 className="text-lg font-medium mb-4">Your Training Plan</h3>
        <p className="text-muted-foreground mb-6">
          Create a personalized training plan to systematically improve your creative writing skills.
          Daily or weekly challenges will be generated based on your preferences.
        </p>
        <Button variant="outline">Create Training Plan</Button>
      </div>
      
      <div className="text-center p-12">
        <p className="text-muted-foreground">
          You don't have any active training plans yet.
          Create one to start improving your skills systematically!
        </p>
      </div>
    </>
  );
};

export default TrainingPlansTab;
