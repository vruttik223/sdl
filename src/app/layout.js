import '../../public/assets/scss/app.scss';
import NoSSR from '@/utils/NoSSR';
import LenisProvider from '@/providers/LenisProvider';

export const metadata = {
  title: 'SDL India',
  description: 'SDL India - Ayurvedic Products & Herbal Remedies',
  icons: {
    icon: '/favicon.jpeg',
    shortcut: '/favicon.jpeg',
    apple: '/favicon.jpeg',
  },
};

export default async function RootLayout({ children }) {
  return (
    <>
      <html lang="en">
        <head>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&family=Public+Sans:wght@100;200;300;400;500;600;700;800;900&display=swap"
          />
        </head>
        <body suppressHydrationWarning={true}>
          <NoSSR>
            <LenisProvider>{children}</LenisProvider>
          </NoSSR>
        </body>
      </html>
    </>
  );
}
