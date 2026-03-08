import React, { useContext, useState, useEffect } from 'react';
import Btn from '@/elements/buttons/Btn';
import MainHeaderMenu from './MainHeaderMenu';
import ThemeOptionContext from '@/helper/themeOptionsContext';
import { RiCloseLine } from 'react-icons/ri';
import Image from 'next/image';
import Avatar from '@/components/common/Avatar';
import Link from 'next/link';
import playstoreImage from '../../../../../public/assets/images/playstore.svg';
import appstoreImage from '../../../../../public/assets/images/appstore.svg';
import Dhootapapeshwar from '../../../../../public/assets/images/logo/doothpappeshwarLogo.gif';


const ClassicHeaderMenu = () => {
  const [logo, setLogo] = useState('');
  const { mobileSideBar, setMobileSideBar, themeOption } =
    useContext(ThemeOptionContext);

  useEffect(() => {
    setLogo(Dhootapapeshwar);
  }, [Dhootapapeshwar]);
  return (
    <div className="header-nav-middle d-xl-none">
      <div className="main-nav navbar navbar-expand-xl navbar-light navbar-sticky">
        <div
          className={`offcanvas offcanvas-collapse order-xl-2 ${mobileSideBar ? 'show' : ''}`}
          id="primaryMenu"
        >
          <div className="offcanvas-header navbar-shadow">
            {/* <h5>Menu</h5> */}
            <Link href="/" className="web-logo nav-logo">
              <Avatar
                data={logo}
                placeHolder={Dhootapapeshwar}
                name={'Header'}
                customImageClass={'img-fluid'}
                height={28}
                width={162}
              />
            </Link>
            <button
              className="btn-close lead"
              type="button"
              onClick={() => setMobileSideBar(!mobileSideBar)}
            >
              <RiCloseLine />
            </button>
          </div>
          <div className="offcanvas-body">
            <div
              className="d-flex flex-column overflow-auto overflow-xl-visible h-100 hide-scrollbar"
              style={{ height: 'fit-content' }}
            >
              <div className="flex-grow-1">
                <MainHeaderMenu />
              </div>
              <div className="d-flex d-xl-none gap-2 flex-nowrap">
                {themeOption?.footer?.app_store_url && (
                  <div className="position-relative sidebar-appstore-image">
                    <Link
                      href={themeOption?.footer?.play_store_url}
                      className="d-inline-block w-100"
                      target="_blank"
                    >
                      <Image
                        src={playstoreImage}
                        alt="play store"
                        className="position-relative"
                        height={"auto"}
                        width={100}
                      />
                    </Link>
                  </div>
                )}
                {themeOption?.footer?.play_store_url && (
                  <div className="position-relative sidebar-appstore-image">
                    <Link
                      href={themeOption?.footer?.app_store_url}
                      className="d-inline-block w-100"
                      target="_blank"
                    >
                      <Image
                        src={appstoreImage}
                        alt="app store"
                        className="position-relative"
                        height={"auto"}
                        width={100}
                      />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {mobileSideBar && (
          <div
            className={'offcanvas-backdrop fade show'}
            onClick={() => setMobileSideBar(!mobileSideBar)}
          />
        )}
      </div>
    </div>
  );
};

export default ClassicHeaderMenu;
