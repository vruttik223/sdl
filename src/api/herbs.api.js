// @ts-check

/**
 * Fetch herbs from the API
 * @param {Object} params - Query parameters
 * @param {string} params.category - Filter by category
 * @param {string} params.limit - Items per page
 * @param {string} params.search - Search query
 * @param {string} params.filter - Additional filters
 * @param {string} params.page - Page number
 * @param {string} params.sortBy - Sort order (date-desc, date-asc, name-asc, name-desc)
 * @returns {Promise<{success: boolean, message: string, data: Object}>} - The API response
 */
export const fetchHerbs = async (params = { category: '', limit: '', search: '', filter: '', page: '1', sortBy: '' }) => {
  const { category = '', limit = '', search = '', filter = '', page = '1', sortBy = '' } = params;

  // Build query parameters
  const queryParams = new URLSearchParams();
  if (search) queryParams.append('search', search);
  if (category) queryParams.append('category', category);
  if (filter) queryParams.append('filter', filter);
  if (page) queryParams.append('page', page.toString());
  if (limit) queryParams.append('limit', limit.toString());
  if (sortBy) queryParams.append('sortBy', sortBy);

  const queryString = queryParams.toString();
  const url = `https://sdlserver.hyplap.com/api/herbs${queryString ? `?${queryString}` : ''}`;

  try {
    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch herbs: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();

    if (!json.success) {
      console.warn('API returned unsuccessful response:', json.message);
      return {
        success: false,
        message: json.message || 'Failed to fetch herbs',
        data: {
          herbs: [],
          pagination: {
            total: 0,
            page: 1,
            limit: parseInt(params.limit) || 12,
            totalPages: 0,
          },
        },
      };
    }

    return json;
  } catch (error) {
    console.error('Error fetching herbs:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch herbs',
      data: {
        herbs: [],
        pagination: {
          total: 0,
          page: 1,
          limit: parseInt(limit) || 12,
          totalPages: 0,
        },
      },
    };
  }
};

/**
 * Fetch herb suggestions for search autocomplete
 * @param {string} searchTerm
 * @returns {Promise<Herb[]>}
 */
export const fetchHerbSuggestions = async (searchTerm) => {
  if (!searchTerm || !searchTerm.trim()) {
    return [];
  }

  const url = `https://sdlserver.hyplap.com/api/herb/search?search=${encodeURIComponent(
    searchTerm
  )}`;

  const res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error('Failed to fetch herb suggestions');
  }

  const json = await res.json();

  if (!json.success) {
    console.warn(json.message);
    return [];
  }

  if (!json.data || !Array.isArray(json.data.herbs)) {
    return [];
  }

  return json.data.herbs;
};

/**
 * @typedef {Object} Herb
 * @property {string} uid - Unique identifier for the herb
 * @property {string} slug - URL-friendly identifier for the herb
 * @property {string} name - Common name of the herb
 * @property {string} subtitle - Brief subtitle or tagline
 * @property {string} coverImage - URL to the herb's cover image
 * @property {string} coverImageAlt - Alt text for the herb's cover image
 * @property {Array} herbInfos - Array of detailed information sections
 * @property {boolean} verifiedFlag - Whether the herb is verified
 * @property {string} verifiedBy - Who verified the herb
 * @property {string} verifiedAt - When the herb was verified
 * @property {boolean} status - Active status
 * @property {string} created_at - Creation timestamp
 * @property {string} updated_at - Update timestamp
 */

/**
 * @typedef {Object} HerbInfoResponse
 * @property {boolean} success
 * @property {string} message
 * @property {Herb} data
 */

/**
 * Fetch detailed information about a specific herb
 * @param {Object} params - The parameters object
 * @param {string} params.herbSlug - The unique slug identifier for the herb to fetch details for 
 * @returns {Promise<HerbInfoResponse>} - The herb detail object
 */
export const fetchHerbDetail = async ({ herbSlug }) => {
  if (!herbSlug) throw new Error('Herb slug is required to fetch herb detail');

  const url = `https://sdlserver.hyplap.com/api/herbs/${herbSlug}`;

  try {
    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch herb detail: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();

    if (!json.success) {
      return {
        success: false,
        message: json.message || 'Herb not found',
        data: null,
      };
    }

    return json;
  } catch (error) {
    console.error('Error fetching herb detail:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch herb detail',
      data: null,
    };
  }
};

/**
 * Fetch annual requirement of herbs with pagination
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 9)
 * @returns {Promise<{success: boolean, message: string, data: Object}>}
 */
export const fetchAnnualHerbRequirements = async (params = { page: 1, limit: 9 }) => {
  const { page = 1, limit = 9 } = params;

  // Dummy data for annual herb requirements
  const DUMMY_REQUIREMENTS = [
    {
      id: 1,
      herbName: 'Adarak',
      EnglishName: 'Ginger',
      partUsed: 'Rhizome',
      nameInDevnagari: 'अदरक',
      partUsedinDevnagari: 'जड़',
      quanity: '5000',
    },
    {
      id: 2,
      herbName: 'Tulsi',
      EnglishName: 'Holy Basil',
      partUsed: 'Leaves',
      nameInDevnagari: 'तुलसी',
      partUsedinDevnagari: 'पत्ते',
      quanity: '3000',
    },
  ];

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Calculate pagination
  const total = DUMMY_REQUIREMENTS.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = DUMMY_REQUIREMENTS.slice(startIndex, endIndex);

  return {
    success: true,
    message: 'Annual herb requirements fetched successfully',
    data: {
      requirements: paginatedData,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: endIndex < total,
        hasPrevPage: page > 1,
      },
    },
  };
};
