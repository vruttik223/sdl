import { useContext, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import ThemeOptionContext from '@/helper/themeOptionsContext';
import CookiesComponent from './cookies';
import MainFooter from './footer';
import MainHeader from './header';
import MobileMenu from './mobileMenu';
import NewsLetterModal from './newsLetter';
import RecentPurchase from './recentPurchase';
import StickyCompare from './StickyCompare';
import TapTop from './tapTop';
import ExitModal from './exitModal';
import Cookies from 'js-cookie';
import { isAppMode } from '@/utils/webview-detector';

const SubLayout = ({ children }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isNewsLetter = Cookies.get('newsLetterModal');
  const { themeOption } = useContext(ThemeOptionContext);
  // IMPORTANT: decide app-mode synchronously where possible
  // - `app=true` query param is our primary signal for WebView usage
  // - pathname.startsWith('/app') is a secondary, optional convention
  // - isAppMode() is a runtime fallback (React Native WebView detection)
  const hasAppParam = searchParams?.get('app') === 'true';
  const isApp =
    hasAppParam ||
    (pathname && pathname.startsWith('/app')) ||
    isAppMode();
  
  // Hide mobile menu on collection, shop and product detail pages
  const isCollectionPage =
    pathname?.includes('/collection') ||
    pathname?.includes('/shop') ||
    pathname?.includes('/product');
  
  useEffect(() => {
    // Set static page title
    const siteTitle = 'SDL India';
    document.title = siteTitle;
  }, [themeOption]);

  return (
    <>
      {/* Hide header and footer when in app mode */}
      {!isApp && <MainHeader />}
      {!isCollectionPage && !isApp && <MobileMenu />}
      {children}
      {/* <TapTop /> */}
      {!isApp && <MainFooter />}
      {/* <CookiesComponent /> */}
      {!isApp && <StickyCompare />}
      {/* <RecentPurchase /> */}
      {/* {!isNewsLetter && <NewsLetterModal />} */}
      {/* <ExitModal /> */}
    </>
  );
};

export default SubLayout;
