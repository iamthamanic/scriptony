
import React, { useEffect } from 'react';
import { useUsageData, useUsageMetrics } from '@/hooks/useUsageData';
import { UsageMetricsCards } from '@/components/admin/UsageMetricsCards';
import { UsageFilters } from '@/components/admin/UsageFilters';
import { UsageCharts } from '@/components/admin/UsageCharts';
import { UsageDataTable } from '@/components/admin/UsageDataTable';
import { trackPageView } from '@/utils/trackUsage';

const AdminUsage: React.FC = () => {
  const {
    usageData,
    isLoading,
    error,
    filter,
    setFilter,
    refetch,
    exportCsv,
    features,
    actions
  } = useUsageData();
  
  const {
    totalEvents,
    last24Hours,
    last7Days,
    featureBreakdown,
    actionBreakdown,
    userActivity,
    dailyActivityArray
  } = useUsageMetrics(usageData || []);
  
  // Track page view when component mounts
  useEffect(() => {
    trackPageView('admin_usage');
  }, []);
  
  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Usage Analytics</h1>
      </div>
      
      <UsageFilters 
        filter={filter}
        onFilterChange={setFilter}
        onRefresh={refetch}
        onExport={exportCsv}
        features={features}
        actions={actions}
        isLoading={isLoading}
      />
      
      <UsageMetricsCards 
        totalEvents={totalEvents}
        last24Hours={last24Hours}
        last7Days={last7Days}
        uniqueUsers={Object.keys(userActivity).length}
        isLoading={isLoading}
      />
      
      <UsageCharts 
        dailyActivity={dailyActivityArray}
        featureBreakdown={featureBreakdown}
        actionBreakdown={actionBreakdown}
        isLoading={isLoading}
      />
      
      <UsageDataTable 
        usageData={usageData || []}
        isLoading={isLoading}
      />

      {error && (
        <div className="p-4 border border-red-500 bg-red-50 dark:bg-red-900/20 rounded-md">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-400">Error Loading Usage Data</h3>
          <p className="text-red-600 dark:text-red-300">{(error as Error).message}</p>
        </div>
      )}
    </div>
  );
};

export default AdminUsage;
