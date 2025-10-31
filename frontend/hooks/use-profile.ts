'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/user.service';
import { useAuth } from '@/hooks/use-auth';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { refreshUser } = useAuth();
  
  return useMutation({
    mutationFn: (data: { firstName: string; lastName: string; dateOfBirth?: string }) => 
      userService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      refreshUser();
    },
  });
};

export const useUploadProfileImage = () => {
  const queryClient = useQueryClient();
  const { refreshUser } = useAuth();
  
  return useMutation({
    mutationFn: (file: File) => userService.uploadProfileImage(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      refreshUser();
    },
  });
};