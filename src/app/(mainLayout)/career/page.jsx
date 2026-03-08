import { CareerHero } from '@/components/career/Careerhero';
import CareerOpportunities from '@/components/career/CareerOpportunities';
import CareerBenefits from '@/components/career/CareerBenefits';
import CareerStats from '@/components/career/CareerStats';
import CareerImageSection from '@/components/career/CareerImageSection';
import CareerDisclaimer from '@/components/career/CareerDisclaimer';
import CareerWhySection from '@/components/career/CareerWhySection';
import Breadcrumb from '@/components/common/Breadcrumb';
import React from 'react';
import HeaderAppPromo from '@/layout/header/widgets/common/HeaderAppPromo';
import ProductReviewShowcase from '@/components/productDetails/common/ProductReviewShowcase';

export const metadata = {
  title: 'Careers at SDL India - Join Our Growing Team',
  description:
    'Explore rewarding career opportunities at SDL India. Join a team focused on innovation, learning, and growth with roles across technology, operations, research, and support.',
  keywords: [
    'SDL careers',
    'SDL India jobs',
    'career opportunities',
    'work at SDL',
    'technology jobs',
    'healthcare careers',
    'Ayurveda careers',
    'research jobs',
    'Fresher jobs',
    'professional growth',
  ].join(', '),
  openGraph: {
    title: 'Careers at SDL India - Explore Job Opportunities',
    description:
      'Discover open positions at SDL India across multiple domains. Build a meaningful career with learning, mentorship, and growth opportunities.',
    type: 'website',
    siteName: 'SDL India',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Careers at SDL India - Explore Job Opportunities',
    description:
      'Apply for rewarding career opportunities at SDL India and be part of a mission-driven team.',
  },
};

const page = () => {
  return (
    <>
      {/* <Breadcrumb title="Career" subNavigation={[{ name: 'Career' }]} /> */}
      <CareerHero />
      <CareerOpportunities />
      <HeaderAppPromo />
      <CareerWhySection />
      <CareerBenefits />
      <CareerStats />
      <CareerImageSection />
      <CareerDisclaimer />

    </>
  );
};

export default page;