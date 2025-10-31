'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { formatDateTime } from '@/lib/utils';
import { MessageCircle, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface Contact {
  id: string;
  title: string;
  message: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
  transaction?: {
    refId: string;
  };
}

const statusIcons = {
  OPEN: <AlertCircle className="h-4 w-4 text-blue-600" />,
  IN_PROGRESS: <Clock className="h-4 w-4 text-yellow-600" />,
  RESOLVED: <CheckCircle className="h-4 w-4 text-green-600" />,
  CLOSED: <CheckCircle className="h-4 w-4 text-gray-600" />,
};

export const contactsColumns: ColumnDef<Contact>[] = [
  {
    header: 'Subject',
    accessorKey: 'title',
    cell: ({ row }) => (
      <div className="font-medium text-gray-900 max-w-xs">
        {row.original.title}
      </div>
    ),
  },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div className="flex items-center gap-2">
          {statusIcons[status]}
          <Badge
            variant={
              status === 'RESOLVED' || status === 'CLOSED'
                ? 'default'
                : status === 'IN_PROGRESS'
                ? 'secondary'
                : 'outline'
            }
          >
            {status.replace(/_/g, ' ')}
          </Badge>
        </div>
      );
    },
  },
  {
    header: 'Transaction ID',
    accessorKey: 'transaction',
    cell: ({ row }) => (
      <div className="text-gray-600 font-mono text-sm">
        {row.original.transaction?.refId || 'N/A'}
      </div>
    ),
  },
  {
    header: 'Date',
    accessorKey: 'createdAt',
    cell: ({ row }) => (
      <div className="text-sm text-gray-600">
        {formatDateTime(row.original.createdAt)}
      </div>
    ),
  },
  {
    header: 'Message',
    accessorKey: 'message',
    cell: ({ row }) => (
      <div className="text-gray-600 line-clamp-2 max-w-sm">
        {row.original.message}
      </div>
    ),
  },
];