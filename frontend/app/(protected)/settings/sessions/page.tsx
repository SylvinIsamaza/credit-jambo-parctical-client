'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { useGetActiveSessions, useRevokeSession, useRevokeAllSessions } from '@/hooks/use-security';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Monitor, Smartphone, X, Calendar, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

export default function SessionsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  
  const queryParams = {
    ...(statusFilter !== 'all' && { isActive: statusFilter === 'true' }),
    ...(platformFilter !== 'all' && { platform: platformFilter }),
    ...(dateFrom && { dateFrom }),
    ...(dateTo && { dateTo }),
  };
  
  const { data: sessions = [], refetch } = useGetActiveSessions(queryParams);
  const revokeSessionMutation = useRevokeSession();
  const revokeAllSessionsMutation = useRevokeAllSessions();

  const handleRevokeSession = (sessionId: string) => {
    revokeSessionMutation.mutate(sessionId, {
      onSuccess: () => {
        toast.success('Session revoked successfully');
        refetch();
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to revoke session');
      },
    });
  };

  const handleRevokeAllSessions = () => {
    revokeAllSessionsMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success('All sessions revoked successfully');
        refetch();
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to revoke sessions');
      },
    });
  };

  // Filtering is now handled by the backend

  const columns: ColumnDef<Session>[] = [
    {
      accessorKey: 'deviceName',
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
            <p className="font-medium">{row.original.deviceName}</p>
            <p className="text-sm text-gray-600">{row.original.ipAddress}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? "default" : "secondary"}>
          {row.original.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      accessorKey: 'lastActivity',
      header: 'Last Activity',
      cell: ({ row }) => (
        <div>
          <p className="text-sm">{new Date(row.original.lastActivity).toLocaleDateString()}</p>
          <p className="text-xs text-gray-500">{new Date(row.original.lastActivity).toLocaleTimeString()}</p>
        </div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
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
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleRevokeSession(row.original.id)}
          disabled={revokeSessionMutation.isPending}
        >
          <X className="h-4 w-4" />
        </Button>
      ),
    },
  ];

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
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
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

  const actionButtons = (
    <Button 
      variant="destructive" 
      size="sm"
      onClick={handleRevokeAllSessions}
      disabled={revokeAllSessionsMutation.isPending || sessions.length === 0}
    >
      Revoke All Sessions
    </Button>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Active Sessions</h1>
      
      <DataTable
        columns={columns}
        data={sessions}
        title="Session Management"
        searchPlaceholder="Search sessions..."
        filters={filters}
        actionButtons={actionButtons}
      />
    </div>
  );
}