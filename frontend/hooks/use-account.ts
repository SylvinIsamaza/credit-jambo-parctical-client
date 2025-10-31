import { accountService } from '@/services/account.service';
import { useQuery } from '@tanstack/react-query';

export const useGetAccountInfo = () => {
  return useQuery({
    queryKey: ['account'],
    queryFn: accountService.getAccountInfo,
  });
};