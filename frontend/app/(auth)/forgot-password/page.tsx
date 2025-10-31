'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { authService } from '@/services/auth.service';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Mail, Shield, Key } from 'lucide-react';

const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const otpSchema = z.object({
  otp: z.string().min(6, 'OTP must be 6 digits'),
});

const passwordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type EmailForm = z.infer<typeof emailSchema>;
type OtpForm = z.infer<typeof otpSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

type Step = 'email' | 'otp' | 'password' | 'success';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');

  const emailForm = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
  });

  const otpForm = useForm<OtpForm>({
    resolver: zodResolver(otpSchema),
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const handleEmailSubmit = async (data: EmailForm) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(data.email);
      setEmail(data.email);
      setStep('otp');
      toast.success('OTP sent to your email');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (data: OtpForm) => {
    setIsLoading(true);
    try {
      // In a real implementation, you'd verify the OTP with the backend
      // For now, we'll simulate this and move to password reset
      setResetToken(data.otp); // Using OTP as token for demo
      setStep('password');
      toast.success('OTP verified successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (data: PasswordForm) => {
    setIsLoading(true);
    try {
      await authService.resetPassword(resetToken, data.password);
      setStep('success');
      toast.success('Password reset successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'email':
        return (
          <div className="space-y-6">
            <div className="text-center">
             
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Forgot your password?
              </h2>
              <p className="text-sm text-gray-500">
                Enter your email address and we'll send you an OTP to reset your password.
              </p>
            </div>

            <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  {...emailForm.register('email')}
                  type="email"
                  className="mt-1"
                  placeholder="Enter your email"
                />
                {emailForm.formState.errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {emailForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-base font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  'Send OTP'
                )}
              </Button>
            </form>
          </div>
        );

      case 'otp':
        return (
          <div className="space-y-6">
            <div className="text-center">
             
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Enter verification code
              </h2>
              <p className="text-sm text-gray-500">
                We sent a 6-digit code to <span className="font-medium">{email}</span>
              </p>
            </div>

            <form onSubmit={otpForm.handleSubmit(handleOtpSubmit)} className="space-y-6">
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otpForm.watch('otp') || ''}
                  onChange={(value) => otpForm.setValue('otp', value)}
                >
                  <InputOTPGroup className='flex gap-2' >
                    <InputOTPSlot index={0} className='rounded-md focus-visible:border-primary focus-visible:ring-primary/20 border' />
                    <InputOTPSlot index={1}  className='rounded-md focus-visible:border-primary focus-visible:ring-primary/20 border' />
                    <InputOTPSlot index={2} className='rounded-md focus-visible:border-primary focus-visible:ring-primary/20 border' />
                    <InputOTPSlot index={3} className='rounded-md focus-visible:border-primary focus-visible:ring-primary/20 border' />
                    <InputOTPSlot index={4} className='rounded-md focus-visible:border-primary focus-visible:ring-primary/20 border' />
                    <InputOTPSlot index={5} className='rounded-md focus-visible:border-primary focus-visible:ring-primary/20 border' />
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
                  'Verify OTP'
                )}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => handleEmailSubmit({ email })}
                  className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                >
                  Resend OTP
                </button>
              </div>
            </form>
          </div>
        );

      case 'password':
        return (
          <div className="space-y-6">
            <div className="text-center">
             
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Set new password
              </h2>
              <p className="text-sm text-gray-500">
                Create a strong password for your account
              </p>
            </div>

            <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="password">New Password</Label>
                <Input
                  {...passwordForm.register('password')}
                  type="password"
                  className="mt-1"
                  placeholder="Enter new password"
                />
                {passwordForm.formState.errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {passwordForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  {...passwordForm.register('confirmPassword')}
                  type="password"
                  className="mt-1"
                  placeholder="Confirm new password"
                />
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-base font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Resetting password...
                  </>
                ) : (
                  'Reset password'
                )}
              </Button>
            </form>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Password reset successful!
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Your password has been successfully reset. You can now sign in with your new password.
              </p>
            </div>
            <Link href="/login">
              <Button className="w-full h-12 text-base font-semibold">
                Sign in to your account
              </Button>
            </Link>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white md:bg-gradient-to-br md:from-primary/5 md:to-slate-200 py-6 md:py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
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

          {renderStep()}

          {/* Back to login */}
          <div className="text-center pt-6 border-t border-gray-100">
            <Link
              href="/login"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}