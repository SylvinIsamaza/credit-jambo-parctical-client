'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UserFiltersProps {
  statusFilter: string;
  roleFilter: string;
  startDate: string;
  endDate: string;
  onStatusChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onApply?: () => void;
  onClear?: () => void;
}

export function UserFilters({
  statusFilter,
  roleFilter,
  startDate,
  endDate,
  onStatusChange,
  onRoleChange,
  onStartDateChange,
  onEndDateChange,
  onApply,
  onClear,
}: UserFiltersProps) {
  const handleClear = () => {
    onStatusChange('all');
    onRoleChange('all');
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
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex flex-1 flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Role</label>
        <Select value={roleFilter} onValueChange={onRoleChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="CLIENT">Client</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>

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