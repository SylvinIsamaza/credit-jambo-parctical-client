'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { useGetDevices, useVerifyDevice } from '@/hooks/use-security';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Monitor, Smartphone, CheckCircle, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

export default function DevicesPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  
  const queryParams = {
    ...(statusFilter !== 'all' && { isVerified: statusFilter === 'true' }),
    ...(platformFilter !== 'all' && { platform: platformFilter }),
    ...(dateFrom && { dateFrom }),
    ...(dateTo && { dateTo }),
  };
  
  const { data: devices = [], refetch } = useGetDevices(queryParams);
  const verifyDeviceMutation = useVerifyDevice();

  const handleVerifyDevice = (deviceId: string) => {
    verifyDeviceMutation.mutate(deviceId, {
      onSuccess: () => {
        toast.success('Device verified successfully');
        refetch();
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to verify device');
      },
    });
  };

  const getPlatformFromUserAgent = (userAgent?: string) => {
    if (!userAgent) return 'Unknown';
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Unknown';
  };

  // Filtering is now handled by the backend

  const columns: ColumnDef<Device>[] = [
    {
      accessorKey: 'name',
      header: 'Device',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            {row.original.userAgent?.includes('Mobile') ? (
              <Smartphone className="h-4 w-4" />
            ) : (
              <Monitor className="h-4 w-4" />
            )}
          </div>
          <div>
            <p className="font-medium">{row.original.name}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'platform',
      header: 'Platform',
      cell: ({ row }) => (
        <span className="text-sm">
          {row.original.platform || 'Unknown'}
        </span>
      ),
    },
    {
      accessorKey: 'isVerified',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.isVerified ? 'default' : 'secondary'}>
          {row.original.isVerified ? 'Verified' : 'Pending'}
        </Badge>
      ),
    },
    {
      accessorKey: 'lastUsed',
      header: 'Last Used',
      cell: ({ row }) => (
        <div>
          <p className="text-sm">{new Date(row.original.lastUsed).toLocaleDateString()}</p>
          <p className="text-xs text-gray-500">{new Date(row.original.lastUsed).toLocaleTimeString()}</p>
        </div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Registered',
      cell: ({ row }) => (
        <div>
          <p className="text-sm">{new Date(row.original.createdAt).toLocaleDateString()}</p>
          <p className="text-xs text-gray-500">{new Date(row.original.createdAt).toLocaleTimeString()}</p>
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        !row.original.isVerified ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleVerifyDevice(row.original.id)}
            disabled={verifyDeviceMutation.isPending}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Verify
          </Button>
        ) : null
      ),
    },
  ];

  const platforms = [...new Set(devices.map(device => getPlatformFromUserAgent(device.userAgent)))];

  const clearFilters = () => {
    setStatusFilter('all');
    setPlatformFilter('all');
    setDateFrom('');
    setDateTo('');
  };

  const hasActiveFilters = statusFilter !== 'all' || platformFilter !== 'all' || dateFrom || dateTo;

  const filters = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="true">Verified</SelectItem>
              <SelectItem value="false">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="platform">Platform</Label>
          <Select value={platformFilter} onValueChange={setPlatformFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All platforms" />
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
        <div>
          <Label htmlFor="dateFrom">From Date</Label>
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="dateTo">To Date</Label>
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>
      </div>
      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6">
    
      
      <DataTable
        columns={columns}
        data={devices}
        title="Device Management"
        searchPlaceholder="Search devices..."
        filters={filters}
      />
    </div>
  );
}