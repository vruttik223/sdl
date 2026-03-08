import React, { useContext, useEffect, useRef } from 'react';
import { Col, Row } from 'reactstrap';
// import TopbarLeft from './TopbarLeft';
import TopbarSlider from './TopbarSlider';
import ThemeOptionContext from '@/helper/themeOptionsContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { RiPhoneLine } from 'react-icons/ri';
import HeaderGetApp from './HeaderGetApp';
const HeaderTopBar = ({ isHidden }) => {
  const { themeOption } = useContext(ThemeOptionContext);
  const addClass = useRef(null);
  const pathName = usePathname();
  useEffect(() => {
    if (pathName == `/theme/tokyo`) {
      addClass.current?.classList.add('bg-dark');
    }

    return () => {
      addClass.current?.classList.remove('bg-dark');
    };
  }, [pathName]);
  return (
    <div
      // className={`header-top ${themeOption?.header?.page_top_bar_dark ? ' bg-dark' : ''} header-top-bar ${isHidden ? 'is-hidden' : ''}`}
      className={`header-top ${themeOption?.header?.page_top_bar_dark ? ' bg-dark' : ''} ${isHidden ? 'is-hidden' : ''}`}
      ref={addClass}
    >
      <div className="container-fluid-lg header-top-bar__inner">
        <Row className="align-items-center">
          <TopbarSlider />
          <Col xs={5} sm={3} xxl={3}>
            <ul className="about-list right-nav-about">
              <li className="right-nav-list d-none d-sm-inline-block">
                <Link
                  href="/store-locator"
                  className="text-reset text-nowrap"
                >
                  Store Locator
                </Link>
              </li>
              <li className="right-nav-list d-none d-sm-inline-block">
                <Link href="/track-order" className="text-reset text-nowrap">
                  Track Order
                </Link>
              </li>
              <li className="right-nav-list">
                <HeaderGetApp />
              </li>
              {/* <li className="right-nav-list d-lg-flex align-items-center d-none">
                <Link
                  href="/contact-us"
                  className="text-reset text-nowrap d-flex align-items-center gap-1"
                >
                  <RiPhoneLine className="text-white" /> Contact Us
                </Link>
              </li> */}
            </ul>
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default HeaderTopBar;
