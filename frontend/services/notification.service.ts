import { protectedApi } from '@/lib/axios';

export const notificationService = {
  async getNotifications(filters?: {
    type?: string;
    isRead?: boolean;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<any[]> {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.isRead !== undefined) params.append('isRead', filters.isRead.toString());
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);

    const response = await protectedApi.get(`/notifications?${params.toString()}`);
    return response.data.data;
  },

  async getNotificationById(id: string): Promise<any> {
    const response = await protectedApi.get(`/notifications/${id}`);
    return response.data.data;
  },

  async markAsRead(id: string): Promise<void> {
    await protectedApi.patch(`/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await protectedApi.patch('/notifications/mark-all-read');
  },

  async getUnreadCount(): Promise<{ count: number }> {
    const response = await protectedApi.get('/notifications/unread-count');
    console.log(response.data.data);
    return response.data.data;
  },
};