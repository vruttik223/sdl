import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  addToWishlist,
  fetchWishlist,
  removeFromWishlist,
  toggleWishlist,
} from '@/api/wishlist.api';
import { useState, useEffect } from 'react';

/**
 * Hook to fetch wishlist data
 * @param {Object} params
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=10] - Items per page
 * @param {Object} options - React Query options
 * @returns {Object} Query result
 */
export const useWishlist = (
  { page = 1, limit = 10 } = {},
  options = {}
) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('userToken');
      setIsAuthenticated(!!token);
    }
  }, []);

  return useQuery({
    queryKey: ['wishlist', page, limit],
    queryFn: () => fetchWishlist({ page, limit }),
    enabled: isAuthenticated, // Only run query if authenticated
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (error?.message?.includes('Authentication')) {
        return false;
      }
      return failureCount < 3;
    },
    ...options,
  });
};

/**
 * Hook to add product to wishlist
 * @param {Object} options - React Query mutation options
 * @returns {Object} Mutation result
 */
export const useAddToWishlist = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['addToWishlist'],
    mutationFn: ({ productUid }) => addToWishlist({ productUid }),
    onSuccess: (data, variables) => {
      // Invalidate and refetch wishlist
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      
      // Call user's onSuccess if provided
      options.onSuccess?.(data, variables);
    },
    onError: (error) => {
      console.error('Error adding to wishlist:', error);
      options.onError?.(error);
    },
    ...options,
  });
};

/**
 * Hook to remove product from wishlist
 * @param {Object} options - React Query mutation options
 * @returns {Object} Mutation result
 */
export const useRemoveFromWishlist = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['removeFromWishlist'],
    mutationFn: ({ productUid }) => removeFromWishlist({ productUid }),
    onSuccess: (data, variables) => {
      // Invalidate and refetch wishlist
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      
      // Call user's onSuccess if provided
      options.onSuccess?.(data, variables);
    },
    onError: (error) => {
      console.error('Error removing from wishlist:', error);
      options.onError?.(error);
    },
    ...options,
  });
};

/**
 * Hook to toggle product in wishlist
 * @param {Object} options - React Query mutation options
 * @returns {Object} Mutation result
 */
export const useToggleWishlist = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['toggleWishlist'],
    mutationFn: ({ productUid }) => 
      toggleWishlist({ productUid }),
    onSuccess: (data, variables) => {
      // Invalidate and refetch wishlist
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      
      // Call user's onSuccess if provided
      options.onSuccess?.(data, variables);
    },
    onError: (error) => {
      console.error('Error toggling wishlist:', error);
      options.onError?.(error);
    },
    ...options,
  });
};

/**
 * Helper hook to check if product is in wishlist
 * @param {string} productUid - Product UID to check
 * @returns {boolean} Whether product is in wishlist
 */
export const useIsInWishlist = (productUid) => {
  const { data: wishlistData } = useWishlist({ page: 1, limit: 1000 }); // Fetch all items

  if (!productUid || !wishlistData?.success) {
    return false;
  }

  return wishlistData.data?.wishlist?.some(
    (item) => item.productUid === productUid
  ) ?? false;
};
