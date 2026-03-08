import { useQuery } from '@tanstack/react-query';

/**
 * Hook to fetch health concerns
 * @param {Object} params - Query parameters
 * @param {Object} options - React Query options
 * @returns {Object} React Query result
 */
export const useHome = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['health-concerns', params],
    queryFn: () => fetchHome(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
};
