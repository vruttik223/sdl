import EventsPage from '@/components/events/EventsPage';
import { Suspense } from 'react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/utils/getQueryClient';
import { fetchEvents } from '@/api/events.api';
import Loader from '@/layout/loader';

export async function generateMetadata() {
  try {
    const response = await fetchEvents();
    const events = response?.data?.events || [];
    const eventCategories = response?.data?.eventCategories || [];
    const totalEvents = response?.data?.pagination?.total || events.length || 0;
    const totalCategories = eventCategories.length || 0;

    return {
      title: 'Events by SDL - Conferences, Workshops & Networking Meetups',
      description: `Join ${totalEvents} SDL events across ${totalCategories} categories happening across India. Explore technology conferences, hands-on workshops, professional networking meetups, and training programs designed for growth and innovation.`,
      keywords: [
        'SDL events',
        'technology conferences',
        'workshops',
        'networking events',
        'training programs',
        'tech meetups',
        'professional development',
        'Bengaluru events',
        'innovation summit',
        'career development',
        'Ayurvedic conferences',
        'prayer meetings',
      ].join(', '),
      openGraph: {
        title: 'Events by SDL - Conferences, Workshops & Networking Meetups',
        description: `Discover ${totalEvents} upcoming SDL events including technology conferences, workshops, and networking opportunities. Connect with industry leaders and expand your professional network.`,
        type: 'website',
        siteName: 'SDL India',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Events by SDL - Conferences, Workshops & Networking Meetups',
        description: `Join ${totalEvents} SDL events happening across India. Technology conferences, workshops, and networking meetups for professionals.`,
      },
    };
  } catch (error) {
    return {
      title: 'Events by SDL - Conferences, Workshops & Networking Meetups',
      description:
        'Join SDL events happening across India. Explore technology conferences, hands-on workshops, professional networking meetups, and training programs designed for growth and innovation.',
      keywords:
        'SDL events, technology conferences, workshops, networking events, training programs, tech meetups, professional development, Bengaluru events, innovation summit, career development',
      openGraph: {
        title: 'Events by SDL - Conferences, Workshops & Networking Meetups',
        description:
          'Discover upcoming SDL events including technology conferences, workshops, and networking opportunities. Connect with industry leaders and expand your professional network.',
        type: 'website',
        siteName: 'SDL India',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Events by SDL - Conferences, Workshops & Networking Meetups',
        description:
          'Join SDL events happening across India. Technology conferences, workshops, and networking meetups for professionals.',
      },
    };
  }
}

export default async function Page() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['events', {}],
    queryFn: () => fetchEvents(),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Suspense fallback={<Loader />}>
        <EventsPage />
      </Suspense>
    </HydrationBoundary>
  );
}
