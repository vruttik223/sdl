import StoreFinderPage from '@/components/stores/StoreFinderPage';
import { Suspense } from 'react';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import HydrateProvider from '@/helper/hydrateContext/HydrateProvider';
import { fetchStores } from '@/api/stores.api';
import Loader from '@/layout/loader';

export async function generateMetadata({ searchParams }) {
  try {
    const sp = await searchParams;
    const search = sp?.search || '';
    const response = await fetchStores({ search, limit: 15 });
    const stores = response?.data?.stores || [];
    const total = response?.data?.pagination?.total || 0;

    return {
      title: search
        ? `Store Finder - Results for "${search}"`
        : 'Store Finder - Find SDL India Stores Near You',
      description: search
        ? `Found ${total} SDL India stores matching "${search}". Locate authorized retailers and distributors across India.`
        : `Find SDL India stores, authorized retailers, and distributors across India. Discover ${total} locations with detailed addresses, contact information, and directions.`,
      keywords: [
        'SDL India stores',
        'store locator',
        'find stores',
        'authorized retailers',
        'distributors',
        'store finder',
        'SDL locations',
        search && `${search} stores`,
      ]
        .filter(Boolean)
        .join(', '),
      openGraph: {
        title: search
          ? `Store Finder - Results for "${search}"`
          : 'Store Finder - Find SDL India Stores',
        description: search
          ? `Found ${total} SDL India stores matching "${search}".`
          : `Find SDL India stores and authorized retailers across India. ${total} locations available.`,
        type: 'website',
        siteName: 'SDL India',
      },
      twitter: {
        card: 'summary_large_image',
        title: search ? `Store Finder - "${search}"` : 'Store Finder',
        description: search
          ? `Found ${total} stores matching your search.`
          : 'Find SDL India stores near you.',
      },
    };
  } catch (error) {
    return {
      title: 'Store Finder - Find SDL India Stores Near You',
      description:
        'Find SDL India stores, authorized retailers, and distributors across India. Get detailed addresses, contact information, and directions.',
      keywords:
        'SDL India stores, store locator, find stores, authorized retailers, distributors',
      openGraph: {
        title: 'Store Finder',
        description: 'Find SDL India stores and authorized retailers across India.',
        type: 'website',
        siteName: 'SDL India',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Store Finder',
        description: 'Find SDL India stores near you.',
      },
    };
  }
}

const StoreFinder = async ({ searchParams }) => {
  const queryClient = new QueryClient();
  const sp = await searchParams;
  const search = sp?.search || '';
  const limit = 15;

  // Prefetch stores data
  await queryClient.prefetchQuery({
    queryKey: ['stores', search, limit],
    queryFn: () => fetchStores({ search, limit }),
  });

  return (
    <HydrateProvider state={dehydrate(queryClient)}>
      <Suspense fallback={<Loader />}>
        <StoreFinderPage />
      </Suspense>
    </HydrateProvider>
  );
};

export default StoreFinder;
