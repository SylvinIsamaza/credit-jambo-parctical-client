'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { authService } from '@/services/auth.service';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

const otpSchema = z.object({
  otp: z.string().min(6, 'OTP must be 6 digits'),
});

type OtpForm = z.infer<typeof otpSchema>;

export default function VerifyEmailPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');

  const otpForm = useForm<OtpForm>({
    resolver: zodResolver(otpSchema),
  });

  useEffect(() => {
    if (!userId) {
      router.push('/login');
    }
  }, [userId, router]);

  const handleVerifyEmail = async (data: OtpForm) => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      await authService.verifyEmail(userId, data.otp);
      toast.success('Email verified successfully!');
      router.push('/set-pin?userId=' + userId);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to verify email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!userId) return;
    
    try {
      await authService.resendVerification(userId);
      toast.success('Verification code sent to your email');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to resend verification');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white md:bg-gradient-to-br md:from-primary/5 md:to-slate-200 py-6 md:py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-6 md:mb-8">
          <Image
            src="/logo.png"
            alt="Credit Ijambo"
            height={100}
            width={200}
            className="mx-auto"
          />
        </div>
        
        <div className="bg-white md:rounded-[4px] border p-4 md:p-8 space-y-6 md:space-y-8">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Verify your email
            </h2>
            <p className="text-sm text-gray-500">
              We sent a 6-digit verification code to your email address
            </p>
          </div>

          <form onSubmit={otpForm.handleSubmit(handleVerifyEmail)} className="space-y-6">
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

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-base font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Email'
              )}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                Resend verification code
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}