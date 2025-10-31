'use client';

import { useAuth } from '@/hooks/use-auth';
import { useSessionTimeout } from '@/hooks/use-session-timeout';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  // Auto logout after 2 minutes of inactivity
  useSessionTimeout(2);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    } else if (!isLoading && user) {
      // Check if user is trying to access admin routes without proper role
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/admin') && user.role !== 'ADMIN') {
        router.push('/dashboard');
      }
    }
  }, [user, isLoading, router]);



  if (!user) {
    return null;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}