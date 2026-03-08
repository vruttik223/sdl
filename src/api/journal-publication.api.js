export const fetchJournalPublications = async ({ page = 1, limit = 12 } = {}) => {
  const res = await fetch(
    `https://sdlserver.hyplap.com/api/journalpublication?page=${page}&limit=${limit}`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch journal publications');
  }
  return res.json();
};
