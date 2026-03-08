import { fetchClinics } from '@/api/clinics.api';
import { useQuery } from '@tanstack/react-query';

export const useClinics = (params = {}, options = {}) => {
  const { limit = 12, page = 1, search = '', specialization = '', sortBy = 'asc', field = 'created_at' } = params;

  return useQuery({
    queryKey: ['clinics', { limit, page, search, specialization, sortBy, field }],
    queryFn: () => fetchClinics({ limit, page, search, specialization, sortBy, field }),
    refetchOnWindowFocus: false,
    staleTime: 60 * 1000, // 1 minute
    ...options,
  });
};
