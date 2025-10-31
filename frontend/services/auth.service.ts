import { publicApi, protectedApi } from '@/lib/axios';

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await publicApi.post('/auth/login', data);
    return response.data.data;
  },

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await publicApi.post('/auth/register', data);
    return response.data.data;
  },

  async logout(): Promise<void> {
    await protectedApi.post('/auth/logout');
  },

  async forgotPassword(email: string): Promise<void> {
    await publicApi.post('/auth/forgot-password', { email });
  },

  async resetPassword(token: string, password: string): Promise<void> {
    await publicApi.post('/auth/reset-password', { token, password });
  },

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    const response = await publicApi.post('/auth/refresh-token', { refreshToken });
    return response.data.data;
  },

  async verifyEmail(userId: string, otp: string): Promise<void> {
    await publicApi.post('/auth/verify-email', { userId, otp });
  },

  async resendVerification(userId: string): Promise<void> {
    await publicApi.post('/auth/resend-verification', { userId });
  },

  async validateWithdrawal(amount: number, pin?: string, password?: string): Promise<{ validated: boolean }> {
    const response = await protectedApi.post('/auth/validate-withdrawal', { amount, pin, password });
    return response.data.data;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await protectedApi.post('/auth/change-password', { currentPassword, newPassword });
  },

  async changeEmail(newEmail: string, password: string): Promise<void> {
    await protectedApi.post('/auth/change-email', { newEmail, password });
  },
};

export type { LoginRequest, RegisterRequest, AuthResponse, RegisterResponse };