'use client';

import { useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnFiltersState,
  SortingState,
} from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { ReactNode } from 'react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  title?: string;
  searchKey?: string;
  searchPlaceholder?: string;
  actionButtons?: ReactNode;
  filters?: ReactNode;
  serverSide?: boolean;
  totalCount?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onSearchChange?: (search: string) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  title,
  searchKey,
  searchPlaceholder = 'Search...',
  actionButtons,
  filters,
  serverSide = false,
  totalCount = 0,
  currentPage = 1,
  onPageChange,
  onSearchChange,
  onPageSizeChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pageSize, setPageSize] = useState(10);

  const handleSearchChange = (value: string) => {
    setGlobalFilter(value);
    if (serverSide && onSearchChange) {
      onSearchChange(value);
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    if (serverSide && onPageSizeChange) {
      onPageSizeChange(newPageSize);
    }
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  return (
    <div className="border border-gray-200 rounded-lg bg-white">
      {/* Title Section */}
      {title && (
        <div className=" p-6 pb-2">
          <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        </div>
      )}
      
      {/* Filters Section */}
      {filters && (
        <div className="p-6 border m-4 rounded-lg">
          {filters}
        </div>
      )}
      
      {/* Search and Actions Bar */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={searchPlaceholder}
              value={globalFilter}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 border-gray-300"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rows per page:</span>
              <Select
                value={serverSide ? pageSize.toString() : table.getState().pagination.pageSize.toString()}
                onValueChange={(value) => serverSide ? handlePageSizeChange(Number(value)) : table.setPageSize(Number(value))}
              >
                <SelectTrigger className="w-20 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {actionButtons && (
              <div className="flex items-center gap-2">
                {actionButtons}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="">
        <div className="border border-gray-200  overflow-hidden">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-primary hover:bg-primary">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-white font-semibold py-4 px-6">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow 
                    key={row.id} 
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-4 px-6">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="py-12">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="text-gray-400 mb-2">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v1M7 8h10" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No data found</h3>
                      <p className="text-gray-500 text-sm">There are no records to display at the moment.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination - Always show if there are rows or multiple pages possible */}
      {(table.getRowModel().rows.length > 0 || table.getPageCount() > 1) && (
        <div className="p-6 pt-4 border-t bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{' '}
            of {table.getFilteredRowModel().rows.length} results
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="border-gray-300"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: table.getPageCount() }, (_, i) => i).map((pageIndex) => {
                const isCurrentPage = pageIndex === table.getState().pagination.pageIndex;
                const shouldShow = 
                  pageIndex === 0 || // First page
                  pageIndex === table.getPageCount() - 1 || // Last page
                  Math.abs(pageIndex - table.getState().pagination.pageIndex) <= 1; // Current page ± 1
                
                if (!shouldShow && pageIndex !== 1 && pageIndex !== table.getPageCount() - 2) {
                  // Show ellipsis
                  if (pageIndex === 1 || pageIndex === table.getPageCount() - 2) {
                    return (
                      <span key={pageIndex} className="px-2 text-gray-400">
                        ...
                      </span>
                    );
                  }
                  return null;
                }
                
                return (
                  <Button
                    key={pageIndex}
                    variant={isCurrentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => table.setPageIndex(pageIndex)}
                    className={`w-8 h-8 p-0 ${
                      isCurrentPage 
                        ? "bg-primary text-white" 
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageIndex + 1}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="border-gray-300"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}