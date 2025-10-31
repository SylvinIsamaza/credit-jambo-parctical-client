'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ContactFiltersProps {
  statusFilter: string;
  startDate: string;
  endDate: string;
  onStatusChange: (value: string) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onApply?: () => void;
  onClear?: () => void;
}

export function ContactFilters({
  statusFilter,
  startDate,
  endDate,
  onStatusChange,
  onStartDateChange,
  onEndDateChange,
  onApply,
  onClear,
}: ContactFiltersProps) {
  const handleClear = () => {
    onStatusChange('all');
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
            <SelectItem value="OPEN">Open</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="RESOLVED">Resolved</SelectItem>
            <SelectItem value="CLOSED">Closed</SelectItem>
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