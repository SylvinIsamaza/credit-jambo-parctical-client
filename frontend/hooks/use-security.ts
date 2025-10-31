'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { securityService } from '@/services/security.service';

export const useGetPinStatus = () => {
  return useQuery({
    queryKey: ['pin-status'],
    queryFn: () => securityService.getPinStatus(),
  });
};

export const useGetDevices = (params?: {
  isVerified?: boolean;
  platform?: string;
  dateFrom?: string;
  dateTo?: string;
}) => {
  return useQuery({
    queryKey: ['devices', params],
    queryFn: () => securityService.getDevices(params),
  });
};

export const useGetActiveSessions = (params?: {
  isActive?: boolean;
  dateFrom?: string;
  dateTo?: string;
}) => {
  return useQuery({
    queryKey: ['active-sessions', params],
    queryFn: () => securityService.getActiveSessions(params),
  });
};

export const useSetPin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (pin: string) => securityService.setPin(pin),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pin-status'] });
    },
  });
};

export const useChangePin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ currentPin, newPin }: { currentPin: string; newPin: string }) => 
      securityService.changePin(currentPin, newPin),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pin-status'] });
    },
  });
};

export const useRevokeSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (sessionId: string) => securityService.revokeSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-sessions'] });
    },
  });
};

export const useRevokeAllSessions = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => securityService.revokeAllSessions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-sessions'] });
    },
  });
};

export const useVerifyDevice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (deviceId: string) => securityService.verifyDevice(deviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) => 
      securityService.changePassword(currentPassword, newPassword),
  });
};

export const useChangeEmail = () => {
  return useMutation({
    mutationFn: ({ newEmail, password }: { newEmail: string; password: string }) => 
      securityService.changeEmail(newEmail, password),
  });
};