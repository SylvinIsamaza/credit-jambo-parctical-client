import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { savingsService } from '@/services/savings.service';
import { toast } from 'sonner';

export const useGetBalance = () => {
  return useQuery({
    queryKey: ['balance'],
    queryFn: savingsService.getBalance,
  });
};

export const useGetTransactions = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['transactions', page, limit],
    queryFn: () => savingsService.getTransactionHistory(page, limit),
  });
};

export const useDeposit = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: savingsService.deposit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Deposit successful');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Deposit failed');
    },
  });
};

export const useWithdraw = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: savingsService.withdraw,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Withdrawal successful');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Withdrawal failed');
    },
  });
};

export const useConfirmTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, pin }: { id: string; pin: string }) => 
      savingsService.confirmTransaction(id, pin),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      toast.success('Transaction confirmed');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to confirm transaction');
    },
  });
};

export const useCancelTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: savingsService.cancelTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transaction cancelled');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to cancel transaction');
    },
  });
};