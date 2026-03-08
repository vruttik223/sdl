export const fetchPreclinicalStudies = async () => {
  const res = await fetch(
    'https://sdlserver.hyplap.com/api/peclinicalstudies',
    { cache: 'no-store' }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch preclinical studies');
  }
  return res.json();
};
