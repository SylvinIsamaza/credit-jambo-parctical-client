'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useGetBalance, useGetTransactions } from '@/hooks/use-savings';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatDateTime, formatAccountNumber } from '@/lib/utils';
import { PlusCircle, MinusCircle, Eye, EyeOff, DollarSign } from 'lucide-react';
import { TransactionForm } from '@/components/transaction-form';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [showBalance, setShowBalance] = useState(true);
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);

  const { data: balance, isLoading: balanceLoading } = useGetBalance();
  const { data: transactionData, isLoading: transactionsLoading } = useGetTransactions(1, 5);
  const transactions = transactionData?.transactions || [];
  
  const isLoading = balanceLoading || transactionsLoading;
  const accountNumber = user?.accounts?.[0]?.accountNumber;

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
        return <PlusCircle className="h-4 w-4 text-green-600" />;
      case 'WITHDRAWAL':
        return <MinusCircle className="h-4 w-4 text-red-600" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-400" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
        return 'text-green-600';
      case 'WITHDRAWAL':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-gray-600">Manage your savings account</p>
      </div>
        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account Balance</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBalance(!showBalance)}
              >
                {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {showBalance ? formatCurrency(balance?.balance || '0') : '****'}
              </div>
              <p className="text-xs text-muted-foreground">
                Account: {formatAccountNumber(accountNumber || '')}
              </p>
            </CardContent>
          </Card>

       

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                className="w-full" 
                size="sm"
                onClick={() => setShowDepositForm(true)}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Deposit
              </Button>
              <Button 
                className="w-full" 
                variant="outline" 
                size="sm"
                onClick={() => setShowWithdrawForm(true)}
              >
                <MinusCircle className="mr-2 h-4 w-4" />
                Withdraw
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <DollarSign />
                  </EmptyMedia>
                  <EmptyTitle>No Transactions Yet</EmptyTitle>
                  <EmptyDescription>
                    No transactions yet
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <div className="rounded-md border">
                <div className="overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-primary text-white">
                        <th className="text-left p-3 font-medium">Type</th>
                        <th className="text-left p-3 font-medium">Amount</th>
                        <th className="text-left p-3 font-medium">Description</th>
                        <th className="text-left p-3 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction, index) => (
                        <tr 
                          key={transaction.id} 
                          className={`border-b hover:bg-blue-50 transition-colors ${
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                          }`}
                        >
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              {getTransactionIcon(transaction.type)}
                              <span className="font-medium capitalize">
                                {transaction.type.toLowerCase()}
                              </span>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                              {transaction.type === 'DEPOSIT' ? '+' : '-'}
                              {formatCurrency(transaction.amount)}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="max-w-[200px] truncate text-sm text-gray-600">
                              {transaction.description || 'No description'}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="text-sm text-gray-600">
                              {formatDateTime(transaction.createdAt)}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      {/* Transaction Forms */}
      <TransactionForm
        type="deposit"
        isOpen={showDepositForm}
        onClose={() => setShowDepositForm(false)}
        onSuccess={() => {}}
      />
      
      <TransactionForm
        type="withdraw"
        isOpen={showWithdrawForm}
        onClose={() => setShowWithdrawForm(false)}
        onSuccess={() => {}}
      />
    </div>
  );
}