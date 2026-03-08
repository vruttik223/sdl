import BrowserFaq from '@/components/faq';

export const metadata = {
  title: 'Frequently Asked Questions - SDL India',
  description:
    'Find answers to the most commonly asked questions about SDL India, our services, processes, appointments, and support.',
  keywords: [
    'SDL FAQ',
    'SDL India questions',
    'help and support',
    'appointments FAQ',
    'services FAQ',
    'SDL contact information',
    'patient support',
    'customer support',
  ].join(', '),
  openGraph: {
    title: 'Frequently Asked Questions - SDL India',
    description:
      'Browse detailed answers to frequently asked questions about SDL India, our offerings, and how we work.',
    type: 'website',
    siteName: 'SDL India',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAQs - SDL India',
    description:
      'Get quick answers to frequently asked questions about SDL India and our services.',
  },
};

const Faqs = () => {
  return <BrowserFaq />;
};

export default Faqs;
