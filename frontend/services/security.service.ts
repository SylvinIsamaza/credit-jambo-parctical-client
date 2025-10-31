import { protectedApi } from '@/lib/axios';

export const securityService = {
  async setPin(pin: string): Promise<void> {
    await protectedApi.post('/security/pin/set', { pin });
  },

  async changePin(currentPin: string, newPin: string): Promise<void> {
    await protectedApi.post('/security/pin/change', { currentPin, newPin });
  },

  async getPinStatus(): Promise<{ hasPin: boolean }> {
    const response = await protectedApi.get('/security/pin/status');
    return response.data.data;
  },

  async generateOtp(type: string): Promise<void> {
    await protectedApi.post('/security/otp/generate', { type });
  },

  async verifyOtp(code: string, type: string): Promise<void> {
    await protectedApi.post('/security/otp/verify', { code, type });
  },

  async getDevices(params?: {
    isVerified?: boolean;
    platform?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<Device[]> {
    const response = await protectedApi.get('/auth/devices', { params });
    return response.data.data;
  },

  async getActiveSessions(params?: {
    isActive?: boolean;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<Session[]> {
    const response = await protectedApi.get('/auth/sessions', { params });
    return response.data.data;
  },

  async revokeAllSessions(): Promise<void> {
    await protectedApi.delete('/auth/sessions');
  },

  async revokeSession(sessionId: string): Promise<void> {
    await protectedApi.delete(`/auth/sessions/${sessionId}`);
  },

  async verifyDevice(deviceId: string): Promise<void> {
    await protectedApi.post(`/auth/devices/${deviceId}/verify`);
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await protectedApi.post('/auth/change-password', { currentPassword, newPassword });
  },

  async changeEmail(newEmail: string, password: string): Promise<void> {
    await protectedApi.post('/auth/change-email', { newEmail, password });
  },

  async requestPinChange(): Promise<void> {
    await protectedApi.post('/security/pin/request-change');
  },

  async verifyPinChange(otp: string, newPin: string): Promise<void> {
    await protectedApi.post('/security/pin/verify-change', { otp, newPin });
  },
};