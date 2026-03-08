export const fetchFaqs = async ({ categoryUid } = {}) => {
  const params = new URLSearchParams();

  if (categoryUid) {
    params.set('categoryUid', categoryUid);
  }

  const queryString = params.toString() ? `?${params.toString()}` : '';

  const res = await fetch(
    `https://sdlserver.hyplap.com/api/faqs${queryString}`,
    {
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch FAQs');
  }

  return res.json();
};

