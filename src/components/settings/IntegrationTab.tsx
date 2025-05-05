
import React from 'react';
import TokenList from '../mcp/TokenList';
import TokenConnectionHelp from '../mcp/TokenConnectionHelp';

const IntegrationTab = () => {
  return (
    <div className="space-y-6">
      <TokenList />
      
      <div className="pt-4 border-t">
        <TokenConnectionHelp />
      </div>
    </div>
  );
};

export default IntegrationTab;
