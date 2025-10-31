import { protectedApi } from '@/lib/axios';

export const statementService = {
  async downloadStatement(startDate: string, endDate: string): Promise<Blob> {
    const response = await protectedApi.get('/statements/download', {
      params: { startDate, endDate },
      responseType: 'blob'
    });
    return response.data;
  },
};