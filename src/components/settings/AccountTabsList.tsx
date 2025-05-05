
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, CreditCard, Shield, Key, Code2, Cloud } from 'lucide-react';

const AccountTabsList = () => {
  return (
    <TabsList className="grid grid-cols-6 mb-6">
      <TabsTrigger value="profile" className="flex items-center gap-1">
        <User className="h-4 w-4" /> Profile
      </TabsTrigger>
      <TabsTrigger value="subscription" className="flex items-center gap-1">
        <CreditCard className="h-4 w-4" /> Subscription
      </TabsTrigger>
      <TabsTrigger value="security" className="flex items-center gap-1">
        <Shield className="h-4 w-4" /> Security
      </TabsTrigger>
      <TabsTrigger value="storage" className="flex items-center gap-1">
        <Cloud className="h-4 w-4" /> Speicher
      </TabsTrigger>
      <TabsTrigger value="unlock" className="flex items-center gap-1">
        <Key className="h-4 w-4" /> Unlock
      </TabsTrigger>
      <TabsTrigger value="mcp-integration" className="flex items-center gap-1">
        <Code2 className="h-4 w-4" /> KI-Integration
      </TabsTrigger>
    </TabsList>
  );
};

export default AccountTabsList;
