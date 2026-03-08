import PressPage from '@/components/press/PressPage';

export const metadata = {
  title: 'The Press Release',
  description: '',
  keywords: '',
  openGraph: {
    title: '',
    description: '',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '',
    description: '',
  },
};

const Press = () => {
  return <PressPage />;
};

export default Press;
