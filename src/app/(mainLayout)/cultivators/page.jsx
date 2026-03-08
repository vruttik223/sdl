import CultivatorsPageContent from '@/components/pages/CultivatorsPageContent';
import { Suspense } from 'react';

// Generate metadata for SEO
export async function generateMetadata() {
  return {
    title: 'Cultivators - Annual Herb Requirements | SDL India',
    description:
      'Partner with SDL India for medicinal herb cultivation. View annual herb requirements, download forms, and submit your cultivated crop offers. Join our network of trusted herb suppliers across India.',
    keywords: [
      'herb cultivation',
      'SDL India cultivators',
      'annual herb requirements',
      'medicinal herbs',
      'Ayurvedic herbs cultivation',
      'herb suppliers India',
      'crop offers',
      'herbal farming',
      'medicinal plant cultivation',
      'herb contract farming',
      'agricultural partnership',
      'organic herb farming',
    ].join(', '),
    openGraph: {
      title: 'Cultivators - Annual Herb Requirements | SDL India',
      description:
        'Partner with SDL India for herb cultivation. View annual requirements and submit your offers for cultivated medicinal herbs.',
      type: 'website',
      siteName: 'SDL India',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Cultivators - Annual Herb Requirements | SDL India',
      description:
        'Partner with SDL India for medicinal herb cultivation. Download forms and submit your cultivated crop offers.',
    },
    alternates: {
      canonical: '/cultivators',
    },
  };
}

// Server Component - Main Page
export default function CultivatorsPage() {
  return (
    <Suspense fallback={<div className="loader-wrapper"><div className="loader" /></div>}>
      <CultivatorsPageContent />
    </Suspense>
  );
}
