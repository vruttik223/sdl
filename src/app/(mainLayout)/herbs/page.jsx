import HerbsPageContent from './HerbsPageContent';
import { Suspense } from 'react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/utils/getQueryClient';
import { fetchHerbs } from '@/api/herbs.api';
import Loader from '@/layout/loader';

export async function generateMetadata() {
  try {
    const response = await fetchHerbs();
    const herbs = response?.data?.herbs || [];
    const herbCategories = response?.data?.herbCategories || [];
    const totalHerbs = response?.data?.pagination?.total || herbs.length || 0;
    const totalCategories = herbCategories.length || 0;

    // Generate description based on whether we have category information
    const description = totalCategories > 0
      ? `Explore ${totalHerbs} premium quality herbs across ${totalCategories} categories sourced from trusted suppliers across India. High-grade herbal products for various applications including Ayurvedic medicine, wellness, and natural remedies.`
      : `Explore ${totalHerbs} premium quality herbs sourced from trusted suppliers across India. High-grade herbal products for various applications including Ayurvedic medicine, wellness, and natural remedies.`;

    return {
      title: 'Premium Herbs & Natural Ingredients',
      description: description,
      keywords: [
        'herbs',
        'natural ingredients',
        'herbal products',
        'SDL India',
        'ayurvedic herbs',
        'medicinal plants',
        'herbal extracts',
        'traditional herbs',
        'wellness herbs',
        'organic herbs',
        'herbal remedies',
        'botanical ingredients',
      ].join(', '),
      openGraph: {
        title: 'Premium Herbs & Natural Ingredients',
        description: `Discover ${totalHerbs} premium herbs and natural ingredients. High-grade herbal products for wellness and traditional medicine applications.`,
        type: 'website',
        siteName: 'SDL India',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Premium Herbs & Natural Ingredients',
        description: `Explore ${totalHerbs} premium quality herbs and natural ingredients sourced from trusted suppliers across India.`,
      },
    };
  } catch (error) {
    console.error('Error fetching herbs metadata:', error);
    return {
      title: 'Premium Herbs & Natural Ingredients',
      description:
        'Explore our extensive collection of premium quality herbs and natural ingredients sourced from trusted suppliers across India. High-grade herbal products for various applications.',
      keywords:
        'herbs, natural ingredients, herbal products, SDL India, ayurvedic herbs, medicinal plants, herbal extracts',
      openGraph: {
        title: 'Premium Herbs & Natural Ingredients',
        description:
          'Explore our extensive collection of premium quality herbs and natural ingredients.',
        type: 'website',
        siteName: 'SDL India',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Premium Herbs & Natural Ingredients',
        description:
          'Explore our premium quality herbs and natural ingredients sourced from trusted suppliers.',
      },
    };
  }
}

export default async function HerbsPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['herbs', {}],
    queryFn: () => fetchHerbs(),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Suspense fallback={<Loader />}>
        <HerbsPageContent />
      </Suspense>
    </HydrationBoundary>
  );
}