'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { Loader2, Mail } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { getDeviceId } from '@/lib/device';
import { OtpInput } from '@/components/otp-input';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const otpSchema = z.object({
  otp: z.string().min(6, 'Please enter the complete verification code').max(6, 'Verification code must be 6 digits'),
});

type LoginForm = z.infer<typeof loginSchema>;
type OtpForm = z.infer<typeof otpSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [loginData, setLoginData] = useState<LoginForm | null>(null);
  const [otpValue, setOtpValue] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const otpForm = useForm<OtpForm>({
    resolver: zodResolver(otpSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const deviceId = await getDeviceId();
      const response = await login(data.email, data.password, deviceId);
      
      if (response?.requiresOtp) {
        setShowOtpStep(true);
        setUserId(response.userId!);
        setLoginData(data);
      } else {
        const redirectPath = response?.role === 'ADMIN' 
          ? '/admin/dashboard' 
          : '/dashboard';
        router.push(redirectPath);
      }
    } catch (error) {
      // Error handled by useAuth hook
    } finally {
      setIsLoading(false);
    }
  };

  const onOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData || !userId || otpValue.length !== 6) return;
    
    setIsLoading(true);
    try {
      const deviceId = await getDeviceId();
      const response = await login(loginData.email, loginData.password, deviceId, otpValue);
      const redirectPath = response?.role === 'ADMIN' 
        ? '/admin/dashboard' 
        : '/dashboard';
      router.push(redirectPath);
    } catch (error) {
      // Error handled by useAuth hook
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!loginData) return;
    
    try {
      const deviceId = await getDeviceId();
      await login(loginData.email, loginData.password, deviceId);
      toast.success('Verification code resent to your email');
    } catch (error) {
      // Error handled by useAuth hook
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white md:bg-gradient-to-br md:from-primary/5 md:to-slate-200 py-6 md:py-12 px-4">
      <div className="max-w-[500px] w-full">
        <div className="text-center mb-6 md:mb-8">
          <Image
            src="/logo.png"
            alt="Credit Ijambo"
            height={100}
            width={200}
            className="mx-auto"
          />
        </div>
        
        <div className="bg-white md:rounded-[4px] md:border  p-3 md:p-8 space-y-6 md:space-y-8">
          {/* Logo and Header */}
         {!showOtpStep&& <div className="text-center">
          
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Welcome back
            </h2>
            <p className="text-sm text-gray-500">
              Sign in to your account to continue
            </p>
          </div>}

          {!showOtpStep ? (
            <form className="space-y-6" onSubmit={loginForm.handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                {...loginForm.register('email')}
                type="email"
                autoComplete="email"
                className="mt-1"
                placeholder="Enter your email"
              />
              {loginForm.formState.errors.email && (
                <p className="mt-1 text-sm text-red-600">{loginForm.formState.errors.email.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                {...loginForm.register('password')}
                type="password"
                autoComplete="current-password"
                className="mt-1"
                placeholder="Enter your password"
              />
              {loginForm.formState.errors.password && (
                <p className="mt-1 text-sm text-red-600">{loginForm.formState.errors.password.message}</p>
              )}
            </div>
          </div>

          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-500 font-medium"
            >
              Forgot your password?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-primary text-base font-semibold"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </Button>
          </form>
          ) : (
            <div className="space-y-6">
              <div className="text-center mb-6">
                
              
                <p className="text-sm text-gray-500 mb-1">
                  We've sent a 6-digit verification code to
                </p>
                <p className="text-sm font-medium text-gray-700">
                  {loginData?.email}
                </p>
              </div>
              
              <form onSubmit={onOtpSubmit} className="space-y-6">
                <div>
                  <Label className="block text-center mb-4">Enter Verification Code</Label>
                  <OtpInput
                    length={6}
                    value={otpValue}
                    onChange={setOtpValue}
                    disabled={isLoading}
                    error={otpValue.length === 6 && otpValue.length < 6}
                  />
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Code expires in 10 minutes
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || otpValue.length !== 6}
                  className="w-full h-12 bg-primary text-base font-semibold"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify & Sign In'
                  )}
                </Button>
                
                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-500">
                    Didn't receive the code?
                  </p>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Resend Code
                  </button>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowOtpStep(false);
                        setOtpValue('');
                      }}
                      className="text-sm text-gray-600 hover:text-gray-800 font-medium"
                    >
                      ← Back to login
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Footer */}
          {!showOtpStep&&<div className="text-center pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                href="/register"
                className="font-semibold text-blue-600 hover:text-blue-500"
              >
                Create account
              </Link>
            </p>
          </div>}
        </div>
      </div>
    </div>
  );
}