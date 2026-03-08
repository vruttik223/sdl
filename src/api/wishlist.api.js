// @ts-check

/**
 * Get auth headers from sessionStorage
 * @returns {Object} Authorization headers
 */
const getAuthHeaders = () => {
  if (typeof window === 'undefined') return {};
  const token = sessionStorage.getItem('userToken');
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
};

/**
 * -----------------------------
 * FETCH WISHLIST
 * -----------------------------
 */

/**
 * @typedef {Object} ProductVariant
 * @property {string} uid
 * @property {string} name
 * @property {string|null} coverImage
 * @property {string|null} coverImageAlt
 * @property {number} mrp
 * @property {number} disPrice
 * @property {number|null} basePrice
 * @property {boolean} inStockFlag
 * @property {number|null} consumeDays
 */

/**
 * @typedef {Object} Department
 * @property {string} uid
 * @property {string|null} companyUuid
 * @property {string} image
 * @property {string} name
 * @property {string} slug
 * @property {string} description
 * @property {boolean} status
 * @property {boolean} isDeleted
 * @property {string} created_at
 * @property {string} updated_at
 * @property {string} imageAlt
 */

/**
 * @typedef {Object} Category
 * @property {string} uid
 * @property {string} departmentUid
 * @property {string|null} image
 * @property {string} name
 * @property {string} slug
 * @property {string|null} description
 * @property {boolean} status
 * @property {boolean} isDeleted
 * @property {string} created_at
 * @property {string} updated_at
 * @property {string|null} imageAlt
 */

/**
 * @typedef {Object} Brand
 * @property {string} uid
 * @property {string} logo
 * @property {string} imageAlt
 * @property {string} name
 * @property {string} description
 * @property {boolean} status
 * @property {boolean} isDeleted
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} ProductReview
 * @property {string} uid
 * @property {string} orderUid
 * @property {string} productUid
 * @property {string} variantUid
 * @property {string} customerUid
 * @property {number} ratings
 * @property {string} reasons
 * @property {string} comments
 * @property {boolean} status
 * @property {boolean} verifiedFlag
 * @property {string} verifiedBy
 * @property {string} verifiedAt
 */

/**
 * @typedef {Object} Product
 * @property {string} uid
 * @property {string} name
 * @property {string} slug
 * @property {number} gstPercent
 * @property {string} coverImage
 * @property {string|null} coverImageAlt
 * @property {string} tagUids
 * @property {string} LabelUids
 * @property {ProductVariant[]} productVariants
 * @property {Department} department
 * @property {Category} category
 * @property {Brand} brand
 * @property {ProductReview[]} productReviews
 */

/**
 * @typedef {Object} WishlistItem
 * @property {string} uid
 * @property {string} productUid
 * @property {string} created_at
 * @property {Product} product
 */

/**
 * @typedef {Object} Pagination
 * @property {number} currentPage
 * @property {number} totalPages
 * @property {number} totalItems
 * @property {number} itemsPerPage
 * @property {boolean} hasNextPage
 * @property {boolean} hasPreviousPage
 */

/**
 * @typedef {Object} WishlistData
 * @property {WishlistItem[]} wishlist
 * @property {Pagination} pagination
 */

/**
 * @typedef {Object} WishlistResponse
 * @property {boolean} success
 * @property {string} message
 * @property {WishlistData} [data]
 */

/**
 * Fetch user's wishlist
 * @param {Object} params
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=10] - Items per page
 * @returns {Promise<WishlistResponse>}
 */
export const fetchWishlist = async ({ page = 1, limit = 10 } = {}) => {
  const authHeaders = getAuthHeaders();
  
  if (!authHeaders.Authorization) {
    throw new Error('Authentication required');
  }

  const url = `https://sdlserver.hyplap.com/api/wishlist?page=${page}&limit=${limit}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch wishlist');
  }

  const data = await response.json();
  return data;
};

/**
 * -----------------------------
 * TOGGLE WISHLIST (ADD/REMOVE)
 * -----------------------------
 */

/**
 * @typedef {Object} WishlistUpdateResponse
 * @property {boolean} success
 * @property {string} message
 * @property {Object} [data]
 */

/**
 * Toggle product in wishlist (add if not exists, remove if exists)
 * This endpoint handles both adding and removing from wishlist
 * @param {Object} params
 * @param {string} params.productUid - Product UID to toggle
 * @returns {Promise<WishlistUpdateResponse>}
 */
export const toggleWishlist = async ({ productUid }) => {
  const authHeaders = getAuthHeaders();
  
  if (!authHeaders.Authorization) {
    throw new Error('Authentication required');
  }

  const url = `https://sdlserver.hyplap.com/api/wishlistUpdate/${productUid}`;
    
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update wishlist');
  }

  const data = await response.json();
  return data;
};

/**
 * -----------------------------
 * ADD TO WISHLIST (Alias)
 * -----------------------------
 */

/**
 * Add product to wishlist (uses toggleWishlist)
 * @param {Object} params
 * @param {string} params.productUid - Product UID to add
 * @returns {Promise<WishlistUpdateResponse>}
 */
export const addToWishlist = async ({ productUid }) => {
  return toggleWishlist({ productUid });
};

/**
 * -----------------------------
 * REMOVE FROM WISHLIST (Alias)
 * -----------------------------
 */

/**
 * Remove product from wishlist (uses toggleWishlist)
 * @param {Object} params
 * @param {string} params.productUid - Product UID to remove
 * @returns {Promise<WishlistUpdateResponse>}
 */
export const removeFromWishlist = async ({ productUid }) => {
  return toggleWishlist({ productUid });
};
