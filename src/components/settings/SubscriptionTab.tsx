import React from 'react';
import { Button } from '@/components/ui/button';
const SubscriptionTab = () => {
  return <div className="space-y-6">
      <div className="bg-muted/30 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Current Plan</h3>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-lg font-bold">Free Tier</span>
            <p className="text-sm text-muted-foreground">✓ 5 Skript-Projekte</p>
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
              <p className="text-sm text-muted-foreground">€14.99/month</p>
            </div>
            
            <Button className="bg-anime-purple hover:bg-anime-dark-purple">
              Select Plan
            </Button>
          </div>
          <ul className="mt-3 text-sm space-y-1">
            <li>✓ 5 Skript-Projekte</li>
            <li>✓ 25 Welten</li>
            <li>✓ PDF Dossier Export</li>
            <li>✓ AI-MCP Integration</li>
          </ul>
        </div>
        
        <div className="border rounded-lg p-4 hover:border-anime-purple transition-colors cursor-pointer">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-lg font-bold">Scriptony Studio
            </span>
              <p className="text-sm text-muted-foreground">€49.99/month</p>
            </div>
            
            <Button className="bg-anime-purple hover:bg-anime-dark-purple">
              Select Plan
            </Button>
          </div>
          <ul className="mt-3 text-sm space-y-1">
            <li>✓ Unlimited Skript-Projekte</li>
            <li>✓ Unlimited Welten</li>
            <li>✓ PDF Dossier Export</li>
            <li>✓ AI-MCP Integration</li>
            <li>✓ 5 Teammitglieder inklusive (4,99€ pro weiteren)</li>
          </ul>
        </div>
      </div>
    </div>;
};
export default SubscriptionTab;