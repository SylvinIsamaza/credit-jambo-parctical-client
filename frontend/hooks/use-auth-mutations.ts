'use client';

import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { toast } from 'sonner';

export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) => 
      authService.changePassword(currentPassword, newPassword),
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to change password');
    },
  });
};

export const useChangeEmail = () => {
  return useMutation({
    mutationFn: ({ newEmail, password }: { newEmail: string; password: string }) => 
      authService.changeEmail(newEmail, password),
    onSuccess: () => {
      toast.success('Email changed successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to change email');
    },
  });
};