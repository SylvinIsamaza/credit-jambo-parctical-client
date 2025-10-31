'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { securityService } from '@/services/security.service';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

const pinSchema = z.object({
  pin: z.string().min(4, 'PIN must be at least 4 digits').max(6, 'PIN must be at most 6 digits'),
  confirmPin: z.string(),
}).refine((data) => data.pin === data.confirmPin, {
  message: "PINs don't match",
  path: ["confirmPin"],
});

type PinForm = z.infer<typeof pinSchema>;

export default function SetPinPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');

  const pinForm = useForm<PinForm>({
    resolver: zodResolver(pinSchema),
  });

  useEffect(() => {
    if (!userId) {
      router.push('/login');
    }
  }, [userId, router]);

  const handleSetPin = async (data: PinForm) => {
    setIsLoading(true);
    try {
      await securityService.setPin(data.pin);
      toast.success('Transaction PIN set successfully!');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to set PIN');
    } finally {
      setIsLoading(false);
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
              Set Transaction PIN
            </h2>
            <p className="text-sm text-gray-500">
              Create a 4-6 digit PIN to secure your transactions
            </p>
          </div>

          <form onSubmit={pinForm.handleSubmit(handleSetPin)} className="space-y-6">
            <div>
              <Label htmlFor="pin">Transaction PIN</Label>
              <Input
                {...pinForm.register('pin')}
                type="password"
                maxLength={6}
                className="mt-1"
                placeholder="Enter 4-6 digit PIN"
              />
              {pinForm.formState.errors.pin && (
                <p className="mt-1 text-sm text-red-600">
                  {pinForm.formState.errors.pin.message}
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
                placeholder="Confirm your PIN"
              />
              {pinForm.formState.errors.confirmPin && (
                <p className="mt-1 text-sm text-red-600">
                  {pinForm.formState.errors.confirmPin.message}
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
                  Setting PIN...
                </>
              ) : (
                'Set PIN'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}