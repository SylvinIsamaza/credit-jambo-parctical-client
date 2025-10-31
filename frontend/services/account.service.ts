import { protectedApi } from '@/lib/axios';

export interface AccountInfo {
  id: string;
  balance: string;
  dailyLimit?: string;
  monthlyLimit?: string;
  isActive: boolean;
  createdAt: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isVerified: boolean;
  };
}

export const accountService = {
  async getAccountInfo(): Promise<AccountInfo> {
    const response = await protectedApi.get('/account/info');
    return response.data.data;
  },
};