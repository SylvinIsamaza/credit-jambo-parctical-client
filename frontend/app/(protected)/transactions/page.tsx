'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { transactionsColumns } from '@/components/tables/transactions-columns';
import { TransactionFilters } from '@/components/filters/transaction-filters';
import { useGetTransactions } from '@/hooks/use-savings';
import { TransactionForm } from '@/components/transaction-form';
import { PlusCircle, MinusCircle } from 'lucide-react';

export default function TransactionsPage() {
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [typeFilter, setTypeFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const { data: transactionData, isLoading } = useGetTransactions(1, 100);
  const allTransactions = transactionData?.transactions || [];

  // Filter transactions based on type and date range
  const transactions = useMemo(() => {
    let filtered = allTransactions;
    
    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(t => t.type === typeFilter);
    }
    
    // Filter by date range
    if (startDate) {
      filtered = filtered.filter(t => new Date(t.createdAt) >= new Date(startDate));
    }
    if (endDate) {
      filtered = filtered.filter(t => new Date(t.createdAt) <= new Date(endDate));
    }
    
    return filtered;
  }, [allTransactions, typeFilter, startDate, endDate]);

  const handleTransactionSuccess = () => {
    // The table will reload automatically via React Query
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">

      <DataTable
        title='All Transactions'
        columns={transactionsColumns}
        data={transactions}
        searchPlaceholder="Search transactions..."
        actionButtons={
          <>
            <Button onClick={() => setShowDepositForm(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Deposit
            </Button>
            <Button variant="outline" onClick={() => setShowWithdrawForm(true)}>
              <MinusCircle className="mr-2 h-4 w-4" />
              Withdraw
            </Button>
          </>
        }
        filters={
          <TransactionFilters
            typeFilter={typeFilter}
            startDate={startDate}
            endDate={endDate}
            onTypeChange={setTypeFilter}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
        }
      />

      <TransactionForm
        type="deposit"
        isOpen={showDepositForm}
        onClose={() => setShowDepositForm(false)}
        onSuccess={handleTransactionSuccess}
      />
      
      <TransactionForm
        type="withdraw"
        isOpen={showWithdrawForm}
        onClose={() => setShowWithdrawForm(false)}
        onSuccess={handleTransactionSuccess}
      />
    </div>
  );
}