
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Calendar, BarChart2, Users } from "lucide-react";
import { FeatureUsage } from '@/hooks/useUsageData';

interface MetricsCardsProps {
  totalEvents: number;
  last24Hours: number;
  last7Days: number;
  uniqueUsers: number;
  isLoading?: boolean;
}

export const UsageMetricsCards: React.FC<MetricsCardsProps> = ({
  totalEvents,
  last24Hours,
  last7Days,
  uniqueUsers,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <CardTitle className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const metrics = [
    {
      title: "Total Events",
      value: totalEvents.toLocaleString(),
      icon: Activity,
      description: "Total tracked events",
      color: "text-blue-500"
    },
    {
      title: "Last 24 Hours",
      value: last24Hours.toLocaleString(),
      icon: Calendar,
      description: "Events in the last day",
      color: "text-green-500"
    },
    {
      title: "Last 7 Days",
      value: last7Days.toLocaleString(),
      icon: BarChart2,
      description: "Events in the last week",
      color: "text-purple-500"
    },
    {
      title: "Unique Users",
      value: uniqueUsers.toLocaleString(),
      icon: Users,
      description: "Different users tracked",
      color: "text-orange-500"
    }
  ];

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card key={index}>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <Icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">{metric.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
