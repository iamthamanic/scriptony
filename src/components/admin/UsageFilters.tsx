
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Download, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { UsageFilter } from '@/hooks/useUsageData';

interface UsageFiltersProps {
  filter: UsageFilter;
  onFilterChange: (filter: UsageFilter) => void;
  onRefresh: () => void;
  onExport: () => void;
  features: string[];
  actions: string[];
  isLoading?: boolean;
}

export const UsageFilters: React.FC<UsageFiltersProps> = ({
  filter,
  onFilterChange,
  onRefresh,
  onExport,
  features,
  actions,
  isLoading = false
}) => {
  const [startDate, setStartDate] = useState<Date | undefined>(filter.startDate);
  const [endDate, setEndDate] = useState<Date | undefined>(filter.endDate);

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    onFilterChange({ ...filter, startDate: date });
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    onFilterChange({ ...filter, endDate: date });
  };

  const handleFeatureChange = (value: string) => {
    onFilterChange({ ...filter, feature: value === 'all' ? undefined : value });
  };

  const handleActionChange = (value: string) => {
    onFilterChange({ ...filter, action: value === 'all' ? undefined : value });
  };

  const clearFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    onFilterChange({});
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="space-y-1">
            <span className="text-sm font-medium">Start Date</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  disabled={isLoading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, 'PP') : 'Select date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={handleStartDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1">
            <span className="text-sm font-medium">End Date</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  disabled={isLoading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, 'PP') : 'Select date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={handleEndDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1">
            <span className="text-sm font-medium">Feature</span>
            <Select 
              onValueChange={handleFeatureChange} 
              value={filter.feature || 'all'}
              disabled={isLoading}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Features" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Features</SelectItem>
                {features.map(feature => (
                  <SelectItem key={feature} value={feature}>{feature}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <span className="text-sm font-medium">Action</span>
            <Select 
              onValueChange={handleActionChange} 
              value={filter.action || 'all'}
              disabled={isLoading}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {actions.map(action => (
                  <SelectItem key={action} value={action}>{action}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 ml-auto">
            <Button 
              variant="outline" 
              onClick={clearFilters}
              disabled={isLoading || (!filter.startDate && !filter.endDate && !filter.feature && !filter.action)}
            >
              Clear
            </Button>
            <Button 
              variant="outline" 
              onClick={onRefresh}
              disabled={isLoading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button 
              onClick={onExport}
              disabled={isLoading}
              variant="secondary"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
