'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AdminTransactionFiltersProps {
  statusFilter: string;
  typeFilter: string;
  startDate: string;
  endDate: string;
  onStatusChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onApply?: () => void;
  onClear?: () => void;
}

export function AdminTransactionFilters({
  statusFilter,
  typeFilter,
  startDate,
  endDate,
  onStatusChange,
  onTypeChange,
  onStartDateChange,
  onEndDateChange,
  onApply,
  onClear,
}: AdminTransactionFiltersProps) {
  const handleClear = () => {
    onStatusChange('all');
    onTypeChange('all');
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
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="REVERSED">Reversed</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex flex-1 flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Type</label>
        <Select value={typeFilter} onValueChange={onTypeChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="DEPOSIT">Deposit</SelectItem>
            <SelectItem value="WITHDRAWAL">Withdrawal</SelectItem>
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
       
        <Button size="sm" variant="outline" className="flex-1" onClick={handleClear}>
          Clear
        </Button>
      </div>
    </div>
  );
}