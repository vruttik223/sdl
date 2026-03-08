import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { footerMenuItems } from '../../data/Footer';
import MobileCategoryBrowser from '@/components/common/MobileCategoryBrowser';

const MD_BREAKPOINT = 768; // matches Bootstrap md / d-md-none

const MobileMenu = () => {
  const pathName = usePathname();
  const router = useRouter();
  const [active, setActive] = useState({});
  const [categoryOpen, setCategoryOpen] = useState(false);

  useEffect(() => {
    const newPath = pathName;
    if (newPath) {
      let found = false;
      footerMenuItems?.forEach((footerMenu) => {
        if (footerMenu?.path.toString() == newPath.toString()) {
          setActive(footerMenu);
          found = true;
        }
      });
      if (!found) {
        setActive(''); // Set to an empty string if the path is not found
      }
    }
  }, [pathName, footerMenuItems]);

  // If the viewport widens past the mobile breakpoint while the category
  // browser is open, close it and fall through to the collections page.
  useEffect(() => {
    if (!categoryOpen) return;

    const handleResize = () => {
      if (typeof window !== 'undefined' && window.innerWidth >= MD_BREAKPOINT) {
        setCategoryOpen(false);
        router.push('/collections');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [categoryOpen, router]);

  const handleItemClick = useCallback(
    (e, data) => {
      // Intercept the Category button on mobile
      if (data.className?.includes('mobile-category')) {
        e.preventDefault();
        setActive(data);
        setCategoryOpen(true);
        return;
      }
      setActive(data);
    },
    [],
  );

  return (
    <>
      <div className="mobile-menu d-md-none d-block mobile-cart">
        <ul>
          {footerMenuItems.map((data, index) => (
            <li
              className={`${active?.title == data?.title ? 'active' : ''} ${data.className ? data.className : ''}`}
              key={index}
              onClick={(e) => handleItemClick(e, data)}
            >
              {data.className?.includes('mobile-category') ? (
                <a
                  href={data.path}
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick(e, data);
                  }}
                >
                  {active?.title == data?.title ? data.fillIcon : data.lineIcon}
                  <span>{data.title}</span>
                </a>
              ) : (
                <Link href={`${data.path}`}>
                  {active?.title == data?.title ? data.fillIcon : data.lineIcon}
                  <span>{data.title}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>

      <MobileCategoryBrowser
        isOpen={categoryOpen}
        onClose={() => setCategoryOpen(false)}
      />
    </>
  );
};

export default MobileMenu;
