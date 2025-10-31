'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { Eye, PlusCircle, MinusCircle } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  amount: string;
  description?: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
  refId: string;
}

export const transactionsColumns: ColumnDef<Transaction>[] = [
  {
    header: 'Type',
    accessorKey: 'type',
    cell: ({ row }) => {
      const type = row.original.type;
      return (
        <div className="flex items-center gap-2">
          {type === 'DEPOSIT' ? (
            <PlusCircle className="h-4 w-4 text-green-600" />
          ) : (
            <MinusCircle className="h-4 w-4 text-red-600" />
          )}
          <span className="font-medium capitalize">
            {type.toLowerCase()}
          </span>
        </div>
      );
    },
  },
  {
    header: 'Amount',
    accessorKey: 'amount',
    cell: ({ row }) => {
      const amount = row.original.amount;
      const type = row.original.type;
      return (
        <div className={`font-semibold ${
          type === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'
        }`}>
          {type === 'DEPOSIT' ? '+' : '-'}{formatCurrency(amount)}
        </div>
      );
    },
  },
  {
    header: 'Description',
    accessorKey: 'description',
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate">
        {row.original.description || 'No description'}
      </div>
    ),
  },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          variant={
            status === 'COMPLETED'
              ? 'default'
              : status === 'PENDING'
              ? 'secondary'
              : 'destructive'
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    header: 'Reference',
    accessorKey: 'refId',
    cell: ({ row }) => (
      <div className="font-mono text-sm text-gray-600">
        {row.original.refId}
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
    header: 'Actions',
    id: 'actions',
    cell: ({ row }) => (
      <Button variant="ghost" size="sm">
        <Eye className="h-4 w-4" />
      </Button>
    ),
  },
];