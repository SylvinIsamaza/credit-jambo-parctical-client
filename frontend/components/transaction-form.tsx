'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDeposit, useWithdraw } from '@/hooks/use-savings';
import { WithdrawalValidation } from './withdrawal-validation';
import { Loader2 } from 'lucide-react';

const transactionSchema = z.object({
  amount: z.number().min(1, 'Amount must be greater than 0'),
});

type TransactionForm = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  type: 'deposit' | 'withdraw';
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function TransactionForm({ type, isOpen, onClose, onSuccess }: TransactionFormProps) {
  const [showWithdrawalValidation, setShowWithdrawalValidation] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState(0);
  
  const depositMutation = useDeposit();
  const withdrawMutation = useWithdraw();
  
  const currentMutation = type === 'deposit' ? depositMutation : withdrawMutation;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransactionForm>({
    resolver: zodResolver(transactionSchema),
  });

  const onSubmit = (data: TransactionForm) => {
    if (type === 'withdraw') {
      setWithdrawalAmount(data.amount);
      setShowWithdrawalValidation(true);
    } else {
      currentMutation.mutate(data, {
        onSuccess: () => {
          reset();
          onClose();
          onSuccess();
        }
      });
    }
  };

  const handleWithdrawalValidated = () => {
    withdrawMutation.mutate({ amount: withdrawalAmount }, {
      onSuccess: () => {
        reset();
        onClose();
        onSuccess();
      }
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {type === 'deposit' ? 'Make a Deposit' : 'Make a Withdrawal'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="amount">Amount (RWF)</Label>
            <Input
              {...register('amount', { valueAsNumber: true })}
              type="number"
              step="1"
              min="1"
              className="mt-1"
              placeholder="Enter amount"
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
            )}
          </div>



          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={currentMutation.isPending}
              className="flex-1"
            >
              {currentMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `${type === 'deposit' ? 'Deposit' : 'Withdraw'}`
              )}
            </Button>
          </div>
        </form>
        
        <WithdrawalValidation
          isOpen={showWithdrawalValidation}
          onClose={() => setShowWithdrawalValidation(false)}
          onValidated={handleWithdrawalValidated}
          amount={withdrawalAmount}
        />
      </DialogContent>
    </Dialog>
  );
}