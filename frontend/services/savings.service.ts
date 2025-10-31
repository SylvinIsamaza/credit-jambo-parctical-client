import { protectedApi } from '@/lib/axios';

export const savingsService = {
  async deposit(data: TransactionRequest): Promise<Transaction> {
    const response = await protectedApi.post('/savings/deposit', data);
    return response.data.data;
  },

  async withdraw(data: TransactionRequest): Promise<Transaction> {
    const response = await protectedApi.post('/savings/withdraw', data);
    return response.data.data;
  },

  async getBalance(): Promise<Balance> {
    const response = await protectedApi.get('/savings/balance');
    return response.data.data;
  },

  async getTransactionHistory(page = 1, limit = 10): Promise<TransactionHistory> {
    const response = await protectedApi.get('/savings/transactions', {
      params: { page, limit }
    });
    return response.data.data;
  },

  async confirmTransaction(id: string, pin: string): Promise<Transaction> {
    const response = await protectedApi.post(`/savings/transactions/${id}/confirm`, { pin });
    return response.data.data;
  },

  async cancelTransaction(id: string): Promise<void> {
    await protectedApi.post(`/savings/transactions/${id}/cancel`);
  },
};