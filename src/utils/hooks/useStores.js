import { fetchStores } from '@/api/stores.api';
import { useQuery } from '@tanstack/react-query';

export const useStores = (search = '', limit = 15, sortBy = 'asc', field = 'created_at', options = {}) => {
  return useQuery({
    queryKey: ['stores', search, limit, sortBy, field],
    queryFn: () => fetchStores({ search, limit, sortBy, field }),
    refetchOnWindowFocus: false,
    staleTime: 60 * 1000, // 1 minute
    enabled: true, // Always enabled, search can be empty
    ...options,
  });
};
