import { protectedApi } from '@/lib/axios';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  profileImage?: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
  accounts: Array<{
    id: string;
    accountNumber: string;
    accountType: string;
    balance: string;
  }>;
}

export const profileService = {
  async getProfile(): Promise<UserProfile> {
    const response = await protectedApi.get('/auth/profile');
    return response.data.data;
  }
};