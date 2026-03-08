import MainLayout from '@/layout';
import { dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/utils/getQueryClient';

export const metadata = {
  title: {
    default: 'SDL India',
    template: '%s | SDL India',
  },
  description: 'This is a global description for the website.',
};

export default async function RootLayout({ children }) {
  // Get the cached QueryClient instance for this request
  const queryClient = getQueryClient();

  // Prefetch any global data here that you want available across all pages
  // Example:
  // await queryClient.prefetchQuery({
  //   queryKey: ['themeOptions'],
  //   queryFn: async () => {
  //     const res = await fetch(`${process.env.API_PROD_URL}themeOptions`, {
  //       cache: 'no-store', // or next: { revalidate: 60 }
  //     });
  //     if (!res.ok) throw new Error('Failed to fetch theme options');
  //     return res.json();
  //   },
  // });

  // Dehydrate the query client state
  const dehydratedState = dehydrate(queryClient);

  return (
    <>
      <MainLayout dehydratedState={dehydratedState}>{children}</MainLayout>
    </>
  );
}
