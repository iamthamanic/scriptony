
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { customSupabase } from "@/integrations/supabase/customClient";
import { toast } from "sonner";

export interface UsageFilter {
  startDate?: Date;
  endDate?: Date;
  feature?: string;
  action?: string;
}

export interface FeatureUsage {
  id: string;
  user_id: string;
  feature: string;
  action: string;
  context: Record<string, any>;
  created_at: string;
}

export const useUsageData = (initialFilter: UsageFilter = {}) => {
  const [filter, setFilter] = useState<UsageFilter>(initialFilter);
  
  // Fetch usage data with filters
  const { data: usageData, isLoading, error, refetch } = useQuery({
    queryKey: ['usage-data', filter],
    queryFn: async () => {
      let query = customSupabase
        .from('feature_usage')
        .select('*');
      
      // Apply filters
      if (filter.startDate) {
        query = query.gte('created_at', filter.startDate.toISOString());
      }
      
      if (filter.endDate) {
        query = query.lte('created_at', filter.endDate.toISOString());
      }
      
      if (filter.feature) {
        query = query.eq('feature', filter.feature);
      }
      
      if (filter.action) {
        query = query.eq('action', filter.action);
      }
      
      // Order by creation date, newest first
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) {
        throw new Error(`Failed to fetch usage data: ${error.message}`);
      }
      
      return data as FeatureUsage[];
    },
    refetchOnWindowFocus: false,
  });

  // Export usage data as CSV
  const exportCsv = () => {
    if (!usageData || usageData.length === 0) {
      toast.error("No data to export");
      return;
    }

    try {
      // Format the data for CSV
      const headers = ['id', 'user_id', 'feature', 'action', 'context', 'created_at'];
      const csvData = usageData.map(item => {
        return [
          item.id,
          item.user_id,
          item.feature,
          item.action,
          JSON.stringify(item.context),
          item.created_at
        ].join(',');
      });

      // Create and download the CSV file
      const csvContent = [headers.join(','), ...csvData].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `usage-data-${new Date().toISOString()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("CSV exported successfully");
    } catch (error) {
      console.error("Failed to export CSV:", error);
      toast.error("Failed to export CSV");
    }
  };

  // Get unique features and actions for filter options
  const features = usageData ? [...new Set(usageData.map(item => item.feature))].sort() : [];
  const actions = usageData ? [...new Set(usageData.map(item => item.action))].sort() : [];
  
  return {
    usageData,
    isLoading,
    error,
    filter,
    setFilter,
    refetch,
    exportCsv,
    features,
    actions
  };
};

export const useUsageMetrics = (usageData: FeatureUsage[] = []) => {
  // Calculate key metrics from usage data
  
  // Total count of events
  const totalEvents = usageData.length;
  
  // Events in the last 24 hours
  const last24Hours = usageData.filter(item => {
    const date = new Date(item.created_at);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    return diff <= 24 * 60 * 60 * 1000;
  }).length;
  
  // Events in the last 7 days
  const last7Days = usageData.filter(item => {
    const date = new Date(item.created_at);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    return diff <= 7 * 24 * 60 * 60 * 1000;
  }).length;
  
  // Feature breakdown
  const featureBreakdown = usageData.reduce((acc, item) => {
    acc[item.feature] = (acc[item.feature] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Action breakdown
  const actionBreakdown = usageData.reduce((acc, item) => {
    acc[item.action] = (acc[item.action] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // User activity - top users by event count
  const userActivity = usageData.reduce((acc, item) => {
    acc[item.user_id] = (acc[item.user_id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Daily activity for chart
  const dailyActivity = usageData.reduce((acc, item) => {
    const date = new Date(item.created_at);
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    if (!acc[dateStr]) {
      acc[dateStr] = {
        date: dateStr,
        count: 0
      };
    }
    
    acc[dateStr].count++;
    return acc;
  }, {} as Record<string, { date: string, count: number }>);
  
  // Convert to array and sort by date
  const dailyActivityArray = Object.values(dailyActivity).sort((a, b) => a.date.localeCompare(b.date));
  
  return {
    totalEvents,
    last24Hours,
    last7Days,
    featureBreakdown,
    actionBreakdown,
    userActivity,
    dailyActivityArray
  };
};
