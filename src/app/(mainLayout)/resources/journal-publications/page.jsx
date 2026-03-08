import JournalPublicationsContent from '@/components/pages/JournalPublicationsContent';
import { Suspense } from 'react';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import HydrateProvider from '@/helper/hydrateContext/HydrateProvider';
import { fetchJournalPublications } from '@/api/journal-publication.api';
import JournalPublicationsSkeleton from '@/components/pages/JournalPublicationsSkeleton';

export async function generateMetadata() {
  try {
    const response = await fetchJournalPublications();
    const publications = response?.data?.journalpublications || [];
    const total = publications.length || 0;

    return {  
      title: 'Journal Publications',
      description: `Explore ${total} journal publications, research papers, and academic documents from SDL India. Access PDF publications on various topics including marketing strategy, financial reports, and sustainability.`,
      keywords: [
        'journal publications',
        'research papers',
        'academic documents',
        'PDF publications',
        'SDL India',
        'scholarly articles',
        'research studies',
      ].join(', '),
      openGraph: {
        title: 'Journal Publications',
        description: `Explore ${total} journal publications and research papers from SDL India.`,
        type: 'website',
        siteName: 'SDL India',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Journal Publications',
        description: `Explore ${total} journal publications and research papers.`,
      }
    }
  } catch (error) {
    return {
      title: 'Journal Publications',
      description:
        'Browse our collection of journal publications, research papers, and academic documents. Access PDF publications on various topics.',
      keywords:
        'journal publications, research papers, academic documents, SDL India',
      openGraph: {
        title: 'Journal Publications',
        description:
          'Browse our collection of journal publications and research papers.',
        type: 'website',
        siteName: 'SDL India',
      },
    };
  }
}

export default async function Page() {
  const queryClient = new QueryClient();

  const prefetchResult = await queryClient.prefetchQuery({
    queryKey: ['journal-publications'],
    queryFn: fetchJournalPublications,
  });

  // console.log('✅ Server prefetch completed:', prefetchResult);

  const dehydratedState = dehydrate(queryClient);
  // console.log('📦 Dehydrated state:', dehydratedState);

  return (
    <section className="journal-publications-section section-t-space section-b-space">
      <div>
        <HydrateProvider state={dehydratedState}>
          <Suspense
            fallback={
              <div className="journal-publications-section section-t-space section-b-space">
                <JournalPublicationsSkeleton />
              </div>
            }
          >
            <JournalPublicationsContent />
          </Suspense>
        </HydrateProvider>
      </div>
    </section>
  );
}
