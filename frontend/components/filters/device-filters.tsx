'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DeviceFiltersProps {
  statusFilter: string;
  platformFilter: string;
  startDate: string;
  endDate: string;
  onStatusChange: (value: string) => void;
  onPlatformChange: (value: string) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onApply?: () => void;
  onClear?: () => void;
}

export function DeviceFilters({
  statusFilter,
  platformFilter,
  startDate,
  endDate,
  onStatusChange,
  onPlatformChange,
  onStartDateChange,
  onEndDateChange,
  onApply,
  onClear,
}: DeviceFiltersProps) {
  const handleClear = () => {
    onStatusChange('all');
    onPlatformChange('all');
    onStartDateChange('');
    onEndDateChange('');
    onClear?.();
  };

  return (
    <div className="flex flex-row flex-wrap gap-4 items-end">
      <div className="flex flex-1 flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Status</label>
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex flex-1 flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Platform</label>
        <Select value={platformFilter} onValueChange={onPlatformChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Platforms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            <SelectItem value="Windows">Windows</SelectItem>
            <SelectItem value="macOS">macOS</SelectItem>
            <SelectItem value="Linux">Linux</SelectItem>
            <SelectItem value="Android">Android</SelectItem>
            <SelectItem value="iOS">iOS</SelectItem>
            <SelectItem value="Unknown">Unknown</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex flex-1 flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">From</label>
        <Input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="w-full"
        />
      </div>
      
      <div className="flex flex-1 flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">To</label>
        <Input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="w-full"
        />
      </div>
      
      <div className="flex gap-2">
        <Button size="sm" className="flex-1" onClick={onApply}>
          Apply
        </Button>
        <Button size="sm" variant="outline" className="flex-1" onClick={handleClear}>
          Clear
        </Button>
      </div>
    </div>
  );
}