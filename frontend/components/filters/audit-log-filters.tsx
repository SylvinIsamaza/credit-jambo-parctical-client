'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AuditLogFiltersProps {
  actionFilter: string;
  startDate: string;
  endDate: string;
  onActionChange: (value: string) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onApply?: () => void;
  onClear?: () => void;
}

export function AuditLogFilters({
  actionFilter,
  startDate,
  endDate,
  onActionChange,
  onStartDateChange,
  onEndDateChange,
  onApply,
  onClear,
}: AuditLogFiltersProps) {
  const handleClear = () => {
    onActionChange('all');
    onStartDateChange('');
    onEndDateChange('');
    onClear?.();
  };

  return (
    <div className="flex flex-row flex-wrap gap-4 items-end">
      <div className="flex flex-1 flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Action Type</label>
        <Select value={actionFilter} onValueChange={onActionChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Actions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="LOGIN">Login</SelectItem>
            <SelectItem value="LOGOUT">Logout</SelectItem>
            <SelectItem value="REGISTER">Register</SelectItem>
            <SelectItem value="PASSWORD">Password</SelectItem>
            <SelectItem value="EMAIL">Email</SelectItem>
            <SelectItem value="DEVICE">Device</SelectItem>
            <SelectItem value="SESSION">Session</SelectItem>
            <SelectItem value="TRANSACTION">Transaction</SelectItem>
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