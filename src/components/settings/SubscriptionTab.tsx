
import React from 'react';
import { Button } from '@/components/ui/button';

const SubscriptionTab = () => {
  return (
    <div className="space-y-6">
      <div className="bg-muted/30 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Current Plan</h3>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-lg font-bold">Free Tier</span>
            <p className="text-sm text-muted-foreground">Basic access to Scriptony</p>
          </div>
          
          <Button variant="outline" className="border-anime-purple text-anime-purple">
            Upgrade
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="font-medium">Available Plans</h3>
        
        <div className="border rounded-lg p-4 hover:border-anime-purple transition-colors cursor-pointer">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-lg font-bold">Scriptony Pro</span>
              <p className="text-sm text-muted-foreground">$9.99/month</p>
            </div>
            
            <Button className="bg-anime-purple hover:bg-anime-dark-purple">
              Select Plan
            </Button>
          </div>
          <ul className="mt-3 text-sm space-y-1">
            <li>✓ Unlimited projects</li>
            <li>✓ Advanced AI assistance</li>
            <li>✓ PDF exports</li>
            <li>✓ Team collaboration</li>
          </ul>
        </div>
        
        <div className="border rounded-lg p-4 hover:border-anime-purple transition-colors cursor-pointer">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-lg font-bold">Scriptony Enterprise</span>
              <p className="text-sm text-muted-foreground">$29.99/month</p>
            </div>
            
            <Button className="bg-anime-purple hover:bg-anime-dark-purple">
              Select Plan
            </Button>
          </div>
          <ul className="mt-3 text-sm space-y-1">
            <li>✓ All Pro features</li>
            <li>✓ Priority support</li>
            <li>✓ Custom branding</li>
            <li>✓ API access</li>
            <li>✓ Advanced analytics</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionTab;
