import HerbDetailContent from './HerbDetailContent';
import { Suspense } from 'react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/utils/getQueryClient';
import { fetchHerbDetail } from '@/api/herbs.api';
import Loader from '@/layout/loader';

export async function generateMetadata({ params }) {
  try {
    const { herbId: herbSlug } = await params;
    const response = await fetchHerbDetail({ herbSlug });

    if (!response.success || !response.data?.herb) {
      return {
        title: 'Herb Not Found',
        description: 'The herb you are looking for could not be found.',
      };
    }

    const herb = response.data.herb;
    const firstInfo = herb.herbInfos?.[0];
    const description =
      herb.subtitle ||
      firstInfo?.description?.substring(0, 160) ||
      `Learn about ${herb.name} and its benefits.`;

    return {
      title: `${herb.name} - Premium Herbs`,
      description: description,
      keywords: [
        herb.name,
        herb.subtitle,
        'herbs',
        'natural medicine',
        'ayurvedic herbs',
        'SDL India',
        'herbal products',
      ]
        .filter(Boolean)
        .join(', '),
      openGraph: {
        title: `${herb.name} - Premium Herbs`,
        description: description,
        type: 'website',
        siteName: 'SDL India',
        images: herb.coverImage
          ? [
              {
                url: herb.coverImage,
                alt: herb.coverImageAlt || herb.name,
              },
            ]
          : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${herb.name} - Premium Herbs`,
        description: description,
        images: herb.coverImage ? [herb.coverImage] : [],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Herb Details - SDL India',
      description: 'Explore premium quality herbs and natural ingredients.',
    };
  }
}

export default async function page({ params }) {
  const { herbId: herbSlug } = await params;
  console.log('herbSlug', herbSlug);
  const queryClient = getQueryClient();

  // Prefetch herb detail data
  await queryClient.prefetchQuery({
    queryKey: ['herb-detail', { herbSlug }],
    queryFn: () => fetchHerbDetail({ herbSlug }),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Suspense fallback={<Loader />}>
        <HerbDetailContent herbSlug={herbSlug} />
      </Suspense>
    </HydrationBoundary>
  );
}
