'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useGetPinStatus } from '@/hooks/use-security';
import { authService } from '@/services/auth.service';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from 'sonner';

const passwordSchema = z.object({
  password: z.string().min(1, 'Password is required'),
});

const otpSchema = z.object({
  otp: z.string().min(6, 'OTP must be 6 digits'),
});

type PasswordForm = z.infer<typeof passwordSchema>;
type OtpForm = z.infer<typeof otpSchema>;

interface WithdrawalValidationProps {
  isOpen: boolean;
  onClose: () => void;
  onValidated: () => void;
  amount: number;
}

export function WithdrawalValidation({ isOpen, onClose, onValidated, amount }: WithdrawalValidationProps) {
  const { data: pinStatus } = useGetPinStatus();
  const [otpValue, setOtpValue] = useState('');
  const hasPin = pinStatus?.hasPin || false;

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const otpForm = useForm<OtpForm>({
    resolver: zodResolver(otpSchema),
  });

  const handlePasswordSubmit = async (data: PasswordForm) => {
    try {
      await authService.validateWithdrawal(amount, undefined, data.password);
      onValidated();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid password');
    }
  };

  const handleOtpSubmit = async (data: OtpForm) => {
    try {
      await authService.validateWithdrawal(amount, data.otp);
      onValidated();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid PIN');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Withdrawal</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Withdrawal Amount</p>
            <p className="text-lg font-semibold">RWF {amount.toLocaleString()}</p>
          </div>

          {hasPin ? (
            <form onSubmit={otpForm.handleSubmit(handleOtpSubmit)} className="space-y-4">
              <div>
                <Label>Enter Transaction PIN</Label>
                <div className="flex justify-center mt-2">
                  <InputOTP
                    maxLength={6}
                    value={otpValue}
                    onChange={(value) => {
                      setOtpValue(value);
                      otpForm.setValue('otp', value);
                    }}
                  >
                    <InputOTPGroup className="flex gap-2">
                      <InputOTPSlot index={0} className="rounded-md border" />
                      <InputOTPSlot index={1} className="rounded-md border" />
                      <InputOTPSlot index={2} className="rounded-md border" />
                      <InputOTPSlot index={3} className="rounded-md border" />
                      <InputOTPSlot index={4} className="rounded-md border" />
                      <InputOTPSlot index={5} className="rounded-md border" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                {otpForm.formState.errors.otp && (
                  <p className="mt-1 text-sm text-red-600 text-center">
                    {otpForm.formState.errors.otp.message}
                  </p>
                )}
              </div>
              
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Confirm Withdrawal
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="password">Enter Password to Confirm</Label>
                <Input
                  {...passwordForm.register('password')}
                  type="password"
                  className="mt-1"
                  placeholder="Enter your password"
                />
                {passwordForm.formState.errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {passwordForm.formState.errors.password.message}
                  </p>
                )}
              </div>
              
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Confirm Withdrawal
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}