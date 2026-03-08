// @ts-check

/**
 * @typedef {Object} HealthConcern
 * @property {string} uid
 * @property {string} name
 * @property {string} slug
 * @property {string} image
 * @property {string} imageAlt
 * @property {string|null} description
 * @property {boolean} status
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} HealthConcernsData
 * @property {HealthConcern[]} healthConcerns
 */

/**
 * @typedef {Object} HealthConcernsResponse
 * @property {boolean} success
 * @property {string} message
 * @property {HealthConcernsData} data
 */

/**
 * Fetch health concerns list
 * @returns {Promise<HealthConcernsResponse>} API response with health concerns data
 */
export const fetchHome = async () => {
  const url = `https://sdlserver.hyplap.com/api/home`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch health concerns');
  }

  return res.json();
};
