import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  addToWishlist,
  fetchWishlist,
  removeFromWishlist,
  toggleWishlist,
} from '@/api/wishlist.api';
import { useState, useEffect } from 'react';
import { getAppAuthToken, notifyWishlistUpdated, requestAuth } from '@/utils/app-bridge';

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
      // Prefer token coming from React Native app (WebView bridge)
      const appToken = getAppAuthToken();
      const token = appToken || sessionStorage.getItem('userToken');
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
    mutationFn: async ({ productUid }) => {
      return toggleWishlist({ productUid });
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch wishlist
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });

      // Notify React Native app about wishlist change (if we know product)
      if (variables?.productUid) {
        try {
          // data.isWishlisted: backend could return final state; if not, assume toggle
          const isWishlisted = data?.data?.isWishlisted ?? true;
          notifyWishlistUpdated(variables.productUid, isWishlisted);
        } catch (e) {
          // Non-fatal: just log
          // eslint-disable-next-line no-console
          console.error('Failed to notify app about wishlist update:', e);
        }
      }
      
      // Call user's onSuccess if provided
      options.onSuccess?.(data, variables);
    },
    onError: (error) => {
      if (error?.message === 'AUTH_REQUIRED') {
        // Auth flow will be handled by the host app; don't spam console
        return;
      }
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
