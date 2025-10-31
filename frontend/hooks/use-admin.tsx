'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';
import { toast } from 'sonner';

// Dashboard hooks
export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminService.getDashboardStats(),
  });
}

// Users hooks
export function useAdminUsers(filters?: any) {
  return useQuery({
    queryKey: ['admin-users', filters],
    queryFn: () => adminService.getUsers(filters),
  });
}

export function useCreateModerator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { email: string; password: string; firstName: string; lastName: string }) =>
      adminService.createModerator(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Moderator created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create moderator');
    },
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { 
      firstName: string; 
      lastName: string; 
      email: string; 
      role: 'CLIENT' | 'ADMIN';
      phoneNumber?: string;
      dateOfBirth?: string;
    }) => adminService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User created successfully. Password setup email sent.');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create user');
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: any }) =>
      adminService.updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update user');
    },
  });
}

export function useActivateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminService.activateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User activated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to activate user');
    },
  });
}

export function useDeactivateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason: string }) =>
      adminService.deactivateUser(userId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User deactivated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to deactivate user');
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason: string }) =>
      adminService.deleteUser(userId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    },
  });
}

export function useRestoreUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminService.restoreUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User restored successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to restore user');
    },
  });
}

// Transactions hooks
export function useAdminTransactions(filters?: any) {
  return useQuery({
    queryKey: ['admin-transactions', filters],
    queryFn: () => adminService.getTransactions(filters),
  });
}

export function useReverseTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ transactionId, reason }: { transactionId: string; reason: string }) =>
      adminService.reverseTransaction(transactionId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-transactions'] });
      toast.success('Transaction reversed successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to reverse transaction');
    },
  });
}

// Devices hooks
export function useAdminDevices(filters?: any) {
  return useQuery({
    queryKey: ['admin-devices', filters],
    queryFn: () => adminService.getDevices(filters),
  });
}

export function useVerifyDevice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminService.verifyDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-devices'] });
      toast.success('Device verified successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to verify device');
    },
  });
}

// Contacts hooks
export function useAdminContacts(filters?: any) {
  return useQuery({
    queryKey: ['admin-contacts', filters],
    queryFn: () => adminService.getContacts(filters),
  });
}

export function useUpdateContactStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contactId, status, reply }: { contactId: string; status: string; reply?: string }) =>
      adminService.updateContactStatus(contactId, status, reply),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contacts'] });
      toast.success( 'Contact updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update contact');
    },
  });
}

// Audit logs hooks
export function useAdminAuditLogs(filters?: any) {
  return useQuery({
    queryKey: ['admin-audit-logs', filters],
    queryFn: () => adminService.getAuditLogs(filters),
  });
}