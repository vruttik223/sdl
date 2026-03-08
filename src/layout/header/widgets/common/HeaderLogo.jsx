'use client';
import React, { useContext, useEffect, useState } from 'react';
import Btn from '@/elements/buttons/Btn';
import ThemeOptionContext from '@/helper/themeOptionsContext';
import Avatar from '@/components/common/Avatar';
import Link from 'next/link';
import Dhootapapeshwar from '../../../../../public/assets/images/logo/doothpappeshwarLogo.gif';
import { RiMenuLine } from 'react-icons/ri';
import { usePathname } from 'next/navigation';
import ParisLogo from '../../../../../public/assets/images/logo/doothpappeshwarLogo.gif';
import TokyoLogo from '../../../../../public/assets/images/logo/doothpappeshwarLogo.gif';
import RomeLogo from '../../../../../public/assets/images/logo/doothpappeshwarLogo.gif';
import MadridLogo from '../../../../../public/assets/images/logo/doothpappeshwarLogo.gif';
import OtherLogo from '../../../../../public/assets/images/logo/doothpappeshwarLogo.gif';

const HeaderLogo = () => {
  const [logo, setLogo] = useState('');
  const { themeOption, mobileSideBar, setMobileSideBar } =
    useContext(ThemeOptionContext);
  const pathName = usePathname();
  useEffect(() => {
    let logo = Dhootapapeshwar;
    if (pathName == `/theme/paris`) {
      logo = { original_url: Dhootapapeshwar ?? ParisLogo };
    } else if (pathName == `/theme/tokyo`) {
      logo = { original_url: TokyoLogo };
    } else if (pathName == `/theme/rome`) {
      logo = { original_url: RomeLogo };
    } else if (pathName == `/theme/madrid`) {
      logo = { original_url: MadridLogo };
    } else if (
      pathName == `/theme/berlin` ||
      pathName == `/theme/denver`
    ) {
      logo = { original_url: OtherLogo };
    } else {
      logo = Dhootapapeshwar;
    }
    // console.log(logo);
    setLogo(logo);
  }, [pathName, Dhootapapeshwar]);
  return (
    <>
      <button
        className="navbar-toggler d-xl-none d-inline navbar-menu-button me-2"
        type="button"
      >
        <span
          className="navbar-toggler-icon"
          onClick={() => setMobileSideBar(!mobileSideBar)}
        >
          <RiMenuLine />
        </span>
      </button>
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
    </>
  );
};

export default HeaderLogo;
