'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '@/services/notification.service';
import { toast } from 'sonner';

export function useNotifications(filters?: {
  type?: string;
  isRead?: boolean;
  dateFrom?: string;
  dateTo?: string;
}) {
  return useQuery({
    queryKey: ['notifications', filters],
    queryFn: () => notificationService.getNotifications(filters),
  });
}

export function useInfiniteNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationService.getNotifications(),
    select: (data) => ({
      pages: [{ notifications: data }]
    })
  });
}

export function useUnreadCount() {
  const { data: notifications = [] } = useNotifications({ isRead: false });
  return notifications.length;
}

export function useNotificationById(id: string) {
  return useQuery({
    queryKey: ['notification', id],
    queryFn: () => notificationService.getNotificationById(id),
    enabled: !!id,
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
     
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to mark notification as read');
    },
  });
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const notifications = await notificationService.getNotifications({ isRead: false });
      await Promise.all(notifications.map(n => notificationService.markAsRead(n.id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    
    },
    onError: (error: any) => {
      toast.error('Failed to mark all notifications as read');
    },
  });
}