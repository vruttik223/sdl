import ClinicFinderPage from '@/components/clinic/ClinicFinderPage';
import { Suspense } from 'react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/utils/getQueryClient';
import { fetchClinics } from '@/api/clinics.api';
import Loader from '@/layout/loader';

export async function generateMetadata() {
  try {
    const response = await fetchClinics({ limit: 12, page: 1 });
    const clinics = response?.data?.clinics || [];
    const specializations = response?.data?.specializations || [];
    const totalClinics = response?.data?.pagination?.total || 0;
    const totalSpecializations = specializations.length || 0;

    return {
      title: 'Find Vaidyas Nearby - Healthcare Services Near You',
      description: `Search and find ${totalClinics} clinics near you. Browse by location, ${totalSpecializations} specializations, and doctor. Get contact information and directions to our healthcare centers.`,
      keywords: [
        'clinic finder',
        'healthcare centers',
        'medical clinics',
        'doctor search',
        'clinic locations',
        'specializations',
        'healthcare services',
        'SDL India clinics',
        'find doctors',
      ].join(', '),
      openGraph: {
        title: 'Find Vaidyas Nearby - Healthcare Services Near You',
        description: `Search and find ${totalClinics} clinics near you. Browse by location, specialization, and doctor.`,
        type: 'website',
        siteName: 'SDL India',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Find Vaidyas Nearby - Healthcare Services Near You',
        description: `Search and find ${totalClinics} clinics near you. Browse by location, specialization, and doctor.`,
      },
    };
  } catch (error) {
    return {
      title: 'Find Vaidyas Nearby - Healthcare Services Near You',
      description: 'Search and find our clinics near you. Browse by location, specialization, and doctor. Get contact information and directions to our healthcare centers.',
      keywords: 'clinic finder, healthcare centers, medical clinics, doctor search, clinic locations, specializations, healthcare services',
      openGraph: {
        title: 'Find Vaidyas Nearby - Healthcare Services Near You',
        description: 'Search and find our clinics near you. Browse by location, specialization, and doctor.',
        type: 'website',
        siteName: 'SDL India',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Find Vaidyas Nearby - Healthcare Services Near You',
        description: 'Search and find our clinics near you. Browse by location, specialization, and doctor.',
      },
    };
  }
}

export default async function ClinicFinder() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['clinics', { limit: 12, page: 1, search: '', specialization: '' }],
    queryFn: () => fetchClinics({ limit: 12, page: 1 }),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Suspense fallback={<Loader />}>
        <ClinicFinderPage />
      </Suspense>
    </HydrationBoundary>
  );
}