import EventDetailPage from '@/components/events/EventDetailPage';
import { Suspense } from 'react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/utils/getQueryClient';
import { fetchEventDetail } from '@/api/events.api';
import Loader from '@/layout/loader';

export async function generateMetadata() {
  try {
    return {
      title: '',
      description: ``,
      keywords: [
        'SDL events',
        'technology conferences',
        'workshops',
        'networking events',
        'training programs',
      ].join(', '),
      openGraph: {
        title: '',
        description: ``,
        type: 'website',
        siteName: 'SDL India',
      },
      twitter: {
        card: 'summary_large_image',
        title: '',
        description: ``,
      },
    };
  } catch (error) {
    return {
      title: '',
      description: '',
      keywords: '',
      openGraph: {
        title: '',
        description: '',
        type: 'website',
        siteName: 'SDL India',
      },
      twitter: {
        card: 'summary_large_image',
        title: '',
        description: '',
      },
    };
  }
}

export default async function Page({ params }) {
  const { eventSlug } = await params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['event-detail', { eventSlug }],
    queryFn: () => fetchEventDetail({ eventSlug }),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Suspense fallback={<Loader />}>
        <EventDetailPage />
      </Suspense>
    </HydrationBoundary>
  );
}
