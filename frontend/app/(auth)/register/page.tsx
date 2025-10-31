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
import { DayPicker } from 'react-day-picker';
import Image from 'next/image';
import 'react-day-picker/dist/style.css';
import { useAuth } from '@/hooks/use-auth';
import { Loader2, ArrowLeft, CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { Step1Form, Step2Form, RegisterRequest } from '@/types/auth';
import { Calendar } from '@/components/ui/calendar';
import { getDeviceId } from '@/lib/device';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

const step1Schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

const step2Schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [step1Data, setStep1Data] = useState<Step1Form | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [phone, setPhone] = useState('');
  const { register: registerUser } = useAuth();
  const router = useRouter();

  const step1Form = useForm<Step1Form>({
    resolver: zodResolver(step1Schema),
  });

  const step2Form = useForm<Step2Form>({
    resolver: zodResolver(step2Schema),
  });

  const onStep1Submit = (data: Step1Form) => {
    if (!phone) {
   setPhoneError('Phone number is required');
   return;
    }

    if (!dateOfBirth) {
      step1Form.setError('dateOfBirth', { message: 'Date of birth is required' });
      return;
    }
    const formData = { ...data, dateOfBirth, phoneNumber: phone };
    setStep1Data(formData);
    setCurrentStep(2);
  };

  const onStep2Submit = async (data: Step2Form) => {
    if (!step1Data) return;
    
    setIsLoading(true);
    try {
      const deviceId = await getDeviceId();
      const fullData: RegisterRequest = { ...step1Data, ...data, deviceId };
      const result = await registerUser(fullData);
    
        router.push('/login');
      
    } catch (error) {
      // Error handled by useAuth hook
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white md:bg-gradient-to-br md:from-primary/5 md:to-slate-200 py-6 md:py-12 px-4">
         <div className="max-w-[580px] w-full">
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
          {/* Header */}
          <div className="text-center">
            {currentStep === 1 ? (
              <h2 className="text-lg font-semibold text-gray-700 mb-6">
                Create your account
              </h2>
            ) : (
              <div className="flex items-center justify-between mb-6">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={goBack}
                  className="p-0 h-auto font-normal text-primary hover:text-primary/80"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
                <h2 className="text-lg font-semibold text-gray-700">
                  Create your account
                </h2>
                <div className="w-16"></div>
              </div>
            )}
            
            {/* Step Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-center space-x-4">
                {/* Step 1 */}
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    currentStep >= 1 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    1
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    currentStep >= 1 ? 'text-primary' : 'text-gray-500'
                  }`}>
                    Personal Info
                  </span>
                </div>
                
                {/* Connector */}
                <div className={`w-12 h-0.5 transition-colors ${
                  currentStep >= 2 ? 'bg-primary' : 'bg-gray-300'
                }`} />
                
                {/* Step 2 */}
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    currentStep >= 2 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    2
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    currentStep >= 2 ? 'text-primary' : 'text-gray-500'
                  }`}>
                    Credentials
                  </span>
                </div>
              </div>
              
            
            </div>
          </div>

          {currentStep === 1 ? (
            <form className="space-y-6" onSubmit={step1Form.handleSubmit(onStep1Submit)}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    {...step1Form.register('firstName')}
                    className="mt-1"
                    placeholder="John"
                  />
                  {step1Form.formState.errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{step1Form.formState.errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    {...step1Form.register('lastName')}
                    className="mt-1"
                    placeholder="Doe"
                  />
                  {step1Form.formState.errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{step1Form.formState.errors.lastName.message}</p>
                  )}
                </div>
              </div>

          <div>
                  <Label >Phone Number</Label>
                  <div className='mt-3 flex-1  w-full'>
                    <PhoneInput
                    enableSearch={true}
                      country={"rw"}
                  value={phone}
  onChange={setPhone}
                    inputClass='!h-[40px] !w-full  '
                  placeholder="+250 123 456 789"
                />
                  </div>
                  {phoneError && <p className="mt-1 text-sm text-red-600">{phoneError}</p>}

                
                
              </div>

              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <input  type='date' className='w-full border h-[42px] rounded-[6px] px-3 text-base font-normal text-gray-700 outline-none placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-inset focus:ring-primary-600' id='dateOfBirth' onChange={(e)=>setDateOfBirth(new Date(e.target.value))} />
                {step1Form.formState.errors.dateOfBirth && (
                  <p className="mt-1 text-sm text-red-600">{step1Form.formState.errors.dateOfBirth.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full h-12 text-base font-semibold">
                Continue
              </Button>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={step2Form.handleSubmit(onStep2Submit)}>

              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  {...step2Form.register('email')}
                  type="email"
                  autoComplete="email"
                  className="mt-1"
                  placeholder="john@example.com"
                />
                {step2Form.formState.errors.email && (
                  <p className="mt-1 text-sm text-red-600">{step2Form.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  {...step2Form.register('password')}
                  type="password"
                  autoComplete="new-password"
                  className="mt-1"
                  placeholder="Enter your password"
                />
                {step2Form.formState.errors.password && (
                  <p className="mt-1 text-sm text-red-600">{step2Form.formState.errors.password.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  {...step2Form.register('confirmPassword')}
                  type="password"
                  autoComplete="new-password"
                  className="mt-1"
                  placeholder="Confirm your password"
                />
                {step2Form.formState.errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{step2Form.formState.errors.confirmPassword.message}</p>
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
                    Creating account...
                  </>
                ) : (
                  'Create account'
                )}
              </Button>
            </form>
          )}

          {/* Footer */}
          <div className="text-center pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-semibold text-blue-600 hover:text-blue-500"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}