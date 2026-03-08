# React Query Server-Side Prefetching Guide

## Overview
Your application now supports prefetching APIs in server components with proper hydration to client components.

## How It Works

### 1. **Server Component** (Layout or Page)
- Prefetches data on the server
- Dehydrates the query state
- Passes it down to client components

### 2. **Client Component**
- Receives the dehydrated state
- Automatically hydrates the prefetched data
- Can use `useQuery` with the same `queryKey` to access the data

## Implementation Examples

### Example 1: Prefetch in Page Component

**app/(mainLayout)/products/page.js** (Server Component)
```javascript
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/utils/getQueryClient';
import ProductsList from '@/components/products/ProductsList'; // Client component

export default async function ProductsPage() {
  const queryClient = getQueryClient();

  // Prefetch products data on the server
  await queryClient.prefetchQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await fetch(`${process.env.API_PROD_URL}/products`, {
        cache: 'no-store', // For dynamic data
      });
      if (!res.ok) throw new Error('Failed to fetch products');
      return res.json();
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductsList />
    </HydrationBoundary>
  );
}
```

**components/products/ProductsList.jsx** (Client Component)
```javascript
'use client';
import { useQuery } from '@tanstack/react-query';

export default function ProductsList() {
  // This will use the prefetched data from the server
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await fetch(`${process.env.API_PROD_URL}/products`);
      return res.json();
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {products?.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

### Example 2: Prefetch Multiple Queries

```javascript
export default async function ProductDetailPage({ params }) {
  const queryClient = getQueryClient();

  // Prefetch multiple queries in parallel
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['product', params.id],
      queryFn: async () => {
        const res = await fetch(`${process.env.API_PROD_URL}/products/${params.id}`);
        return res.json();
      },
    }),
    queryClient.prefetchQuery({
      queryKey: ['product-reviews', params.id],
      queryFn: async () => {
        const res = await fetch(`${process.env.API_PROD_URL}/products/${params.id}/reviews`);
        return res.json();
      },
    }),
    queryClient.prefetchQuery({
      queryKey: ['related-products', params.id],
      queryFn: async () => {
        const res = await fetch(`${process.env.API_PROD_URL}/products/${params.id}/related`);
        return res.json();
      },
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductDetail productId={params.id} />
    </HydrationBoundary>
  );
}
```

### Example 3: Global Layout Prefetching

Your layout already supports this. To prefetch global data, uncomment and modify in **app/(mainLayout)/layout.js**:

```javascript
export default async function RootLayout({ children }) {
  const queryClient = getQueryClient();

  // Prefetch global data that all pages need
  await queryClient.prefetchQuery({
    queryKey: ['themeOptions'],
    queryFn: async () => {
      const res = await fetch(`${process.env.API_PROD_URL}/themeOptions`, {
        next: { revalidate: 3600 }, // Cache for 1 hour
      });
      return res.json();
    },
  });

  await queryClient.prefetchQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch(`${process.env.API_PROD_URL}/categories`, {
        next: { revalidate: 1800 }, // Cache for 30 minutes
      });
      return res.json();
    },
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <>
      <MainLayout dehydratedState={dehydratedState}>{children}</MainLayout>
    </>
  );
}
```

Then use in any client component:
```javascript
'use client';
import { useQuery } from '@tanstack/react-query';

export function CategoryMenu() {
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    // Data is already prefetched, this won't make a network request initially
  });

  return <div>{/* Render categories */}</div>;
}
```

## Important Notes

### Query Keys
- **MUST be identical** in server prefetch and client useQuery
- They're how React Query matches prefetched data to queries

### Caching Strategies

1. **No caching** (always fresh):
```javascript
fetch(url, { cache: 'no-store' })
```

2. **Time-based revalidation**:
```javascript
fetch(url, { next: { revalidate: 60 } }) // Revalidate every 60 seconds
```

3. **Static at build time**:
```javascript
fetch(url) // Default in Next.js
```

### When to Use Each Approach

#### Prefetch in Layout
- Global data needed across many pages
- Theme options, navigation menus, user settings
- Data that changes infrequently

#### Prefetch in Page
- Page-specific data
- Data that depends on route parameters
- Data that changes frequently

#### Client-only Fetching
- User-specific data (after authentication)
- Data that requires user interaction
- Real-time or frequently updating data

## Benefits

1. **Better SEO**: Data is available at render time
2. **Faster Initial Load**: No loading spinners for prefetched data
3. **Improved UX**: Instant page transitions with cached data
4. **Flexibility**: Can still fetch client-side when needed

## Troubleshooting

### Data not hydrating?
- Check that `queryKey` is identical in server and client
- Ensure `dehydratedState` is being passed correctly
- Verify the data is actually being fetched on the server

### Getting stale data?
- Adjust `staleTime` in QueryClient configuration
- Use appropriate `cache` or `next.revalidate` options in fetch

### Performance issues?
- Only prefetch data that's needed immediately
- Use parallel prefetching with `Promise.all`
- Consider using `prefetchInfiniteQuery` for paginated data
