
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from 'date-fns';
import { FeatureUsage } from '@/hooks/useUsageData';

interface UsageDataTableProps {
  usageData: FeatureUsage[];
  isLoading?: boolean;
}

export const UsageDataTable: React.FC<UsageDataTableProps> = ({
  usageData,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></CardTitle>
          <CardDescription className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/4 animate-pulse mt-2"></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  {['Feature', 'Action', 'User', 'Date', 'Context'].map((header) => (
                    <TableHead key={header} className="h-10 bg-gray-100 dark:bg-gray-800"></TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array(5).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    {Array(5).fill(0).map((_, j) => (
                      <TableCell key={j} className="h-12">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Usage Data</CardTitle>
        <CardDescription>
          The most recent user activities tracked in the system.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Feature</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead className="w-[180px]">Date & Time</TableHead>
                <TableHead>Context</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usageData.length > 0 ? (
                usageData.slice(0, 10).map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.feature}</TableCell>
                    <TableCell>{item.action}</TableCell>
                    <TableCell className="font-mono text-xs">{item.user_id.substring(0, 8)}...</TableCell>
                    <TableCell>{format(new Date(item.created_at), 'PPp')}</TableCell>
                    <TableCell>
                      <pre className="text-xs max-h-20 overflow-auto p-2 bg-slate-100 dark:bg-slate-800 rounded">
                        {JSON.stringify(item.context, null, 2)}
                      </pre>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                    No usage data found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {usageData.length > 10 && (
          <div className="text-center text-sm text-muted-foreground mt-4">
            Showing 10 of {usageData.length} records. Export to CSV to view all data.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
