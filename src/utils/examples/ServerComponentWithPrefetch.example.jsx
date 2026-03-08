// EXAMPLE SERVER COMPONENT WITH PREFETCHING
// This file demonstrates how to use prefetching in server components

import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/utils/getQueryClient';

// Example: Server Component (no 'use client' directive)
export default async function ExampleServerPage() {
  const queryClient = getQueryClient();

  // Prefetch data on the server
  await queryClient.prefetchQuery({
    queryKey: ['example-data'],
    queryFn: async () => {
      const res = await fetch(`${process.env.API_PROD_URL}/your-endpoint`, {
        // Important: Disable caching for dynamic data
        cache: 'no-store',
        // Or use Next.js revalidation
        // next: { revalidate: 60 }
      });
      if (!res.ok) throw new Error('Failed to fetch data');
      return res.json();
    },
  });

  // You can prefetch multiple queries
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['products'],
      queryFn: async () => {
        const res = await fetch(`${process.env.API_PROD_URL}/products`);
        return res.json();
      },
    }),
    queryClient.prefetchQuery({
      queryKey: ['categories'],
      queryFn: async () => {
        const res = await fetch(`${process.env.API_PROD_URL}/categories`);
        return res.json();
      },
    }),
  ]);

  // Dehydrate the query client state
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      {/* Your client components that use the prefetched data */}
      <YourClientComponent />
    </HydrationBoundary>
  );
}

// Example: Client Component that uses the prefetched data
// Save this in a separate file with 'use client' directive
/*
'use client';
import { useQuery } from '@tanstack/react-query';

export default function YourClientComponent() {
  // This will use the prefetched data from the server
  const { data, isLoading, error } = useQuery({
    queryKey: ['example-data'],
    queryFn: async () => {
      const res = await fetch(`${process.env.API_PROD_URL}/your-endpoint`);
      return res.json();
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{JSON.stringify(data)}</div>;
}
*/
