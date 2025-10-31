'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { securityService } from '@/services/security.service';
import { toast } from 'sonner';

const pinSchema = z.object({
  newPin: z.string().min(4, 'PIN must be at least 4 digits').max(6, 'PIN must be at most 6 digits'),
  confirmPin: z.string(),
}).refine((data) => data.newPin === data.confirmPin, {
  message: "PINs don't match",
  path: ["confirmPin"],
});

const otpSchema = z.object({
  otp: z.string().min(6, 'OTP must be 6 digits'),
});

type PinForm = z.infer<typeof pinSchema>;
type OtpForm = z.infer<typeof otpSchema>;

interface PinChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function PinChangeModal({ isOpen, onClose, onSuccess }: PinChangeModalProps) {
  const [step, setStep] = useState<'pin' | 'otp'>('pin');
  const [otpValue, setOtpValue] = useState('');
  const [newPin, setNewPin] = useState('');

  const pinForm = useForm<PinForm>({
    resolver: zodResolver(pinSchema),
  });

  const otpForm = useForm<OtpForm>({
    resolver: zodResolver(otpSchema),
  });

  const handlePinSubmit = async (data: PinForm) => {
    try {
      await securityService.requestPinChange();
      setNewPin(data.newPin);
      setStep('otp');
      toast.success('OTP sent to your email');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to request PIN change');
    }
  };

  const handleOtpSubmit = async (data: OtpForm) => {
    try {
      await securityService.verifyPinChange(data.otp, newPin);
      toast.success('PIN changed successfully');
      onSuccess();
      handleClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to verify OTP');
    }
  };

  const handleClose = () => {
    setStep('pin');
    setOtpValue('');
    setNewPin('');
    pinForm.reset();
    otpForm.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Change Transaction PIN</DialogTitle>
        </DialogHeader>
        
        {step === 'pin' ? (
          <form onSubmit={pinForm.handleSubmit(handlePinSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="newPin">New PIN</Label>
              <Input
                {...pinForm.register('newPin')}
                type="password"
                maxLength={6}
                className="mt-1"
                placeholder="Enter new PIN"
              />
              {pinForm.formState.errors.newPin && (
                <p className="mt-1 text-sm text-red-600">
                  {pinForm.formState.errors.newPin.message}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="confirmPin">Confirm PIN</Label>
              <Input
                {...pinForm.register('confirmPin')}
                type="password"
                maxLength={6}
                className="mt-1"
                placeholder="Confirm new PIN"
              />
              {pinForm.formState.errors.confirmPin && (
                <p className="mt-1 text-sm text-red-600">
                  {pinForm.formState.errors.confirmPin.message}
                </p>
              )}
            </div>
            
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Send OTP
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Enter the OTP sent to your email to confirm PIN change
            </p>
            
            <form onSubmit={otpForm.handleSubmit(handleOtpSubmit)} className="space-y-4">
              <div className="flex justify-center">
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
                <p className="text-center text-sm text-red-600">
                  {otpForm.formState.errors.otp.message}
                </p>
              )}
              
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setStep('pin')} className="flex-1">
                  Back
                </Button>
                <Button type="submit" className="flex-1">
                  Change PIN
                </Button>
              </div>
              
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="w-full"
                onClick={() => securityService.requestPinChange()}
              >
                Resend OTP
              </Button>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}