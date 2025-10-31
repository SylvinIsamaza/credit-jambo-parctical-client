import { protectedApi } from '@/lib/axios';

export const adminService = {
  // Users Management
  async getUsers(filters?: {
    status?: string;
    registrationDateFrom?: string;
    registrationDateTo?: string;
    search?: string;
    role?: string;
  }): Promise<any[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.registrationDateFrom) params.append('registrationDateFrom', filters.registrationDateFrom);
    if (filters?.registrationDateTo) params.append('registrationDateTo', filters.registrationDateTo);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.role) params.append('role', filters.role);

    const response = await protectedApi.get(`/admin/users?${params.toString()}`);
    return response.data.data;
  },

  // Transactions Management
  async getTransactions(filters?: {
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
  }): Promise<any[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);
    if (filters?.search) params.append('search', filters.search);

    const response = await protectedApi.get(`/admin/transactions?${params.toString()}`);
    return response.data.data;
  },

  async reverseTransaction(transactionId: string, reason: string): Promise<void> {
    await protectedApi.post(`/admin/transactions/${transactionId}/reverse`, { reason });
  },

  // Device Management
  async getDevices(filters?: {
    isVerified?: boolean;
    platform?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
  }): Promise<any[]> {
    const params = new URLSearchParams();
    if (filters?.isVerified !== undefined) params.append('isVerified', filters.isVerified.toString());
    if (filters?.platform) params.append('platform', filters.platform);
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);
    if (filters?.search) params.append('search', filters.search);

    const response = await protectedApi.get(`/admin/devices?${params.toString()}`);
    return response.data.data;
  },

  async verifyDevice(deviceId: string): Promise<void> {
    await protectedApi.post(`/admin/devices/${deviceId}/verify`);
  },

  // Audit Logs
  async getAuditLogs(filters?: {
    actionType?: string;
    userId?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
  }): Promise<any[]> {
    const params = new URLSearchParams();
    if (filters?.actionType) params.append('actionType', filters.actionType);
    if (filters?.userId) params.append('userId', filters.userId);
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);
    if (filters?.search) params.append('search', filters.search);

    const response = await protectedApi.get(`/admin/audit-logs?${params.toString()}`);
    return response.data.data;
  },

  // Contacts
  async getContacts(filters?: {
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
  }): Promise<any[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);
    if (filters?.search) params.append('search', filters.search);

    const response = await protectedApi.get(`/admin/contacts?${params.toString()}`);
    return response.data.data;
  },

  async createModerator(data: { email: string; password: string; firstName: string; lastName: string }): Promise<void> {
    await protectedApi.post('/admin/moderators', data);
  },

  async createUser(data: { 
    firstName: string; 
    lastName: string; 
    email: string; 
    role: 'CLIENT' | 'ADMIN';
    phoneNumber?: string;
    dateOfBirth?: string;
  }): Promise<void> {
    await protectedApi.post('/admin/users', data);
  },

  async updateUser(userId: string, data: any): Promise<void> {
    await protectedApi.put(`/admin/users/${userId}`, data);
  },

  async activateUser(userId: string): Promise<void> {
    await protectedApi.post(`/admin/users/${userId}/activate`);
  },

  async deactivateUser(userId: string, reason: string): Promise<void> {
    await protectedApi.post(`/admin/users/${userId}/deactivate`, { reason });
  },

  async deleteUser(userId: string, reason: string): Promise<void> {
    await protectedApi.delete(`/admin/users/${userId}`, { data: { reason } });
  },

  async restoreUser(userId: string): Promise<void> {
    await protectedApi.post(`/admin/users/${userId}/restore`);
  },

  async updateContactStatus(contactId: string, status: string, reply?: string): Promise<void> {
    await protectedApi.patch(`/admin/contacts/${contactId}`, { status, reply });
  },

  // Dashboard Stats
  async getDashboardStats(): Promise<any> {
    const response = await protectedApi.get('/admin/dashboard');
    return response.data.data;
  }
};