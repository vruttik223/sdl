import React, { useContext, useEffect, useState } from 'react';
import { Col } from 'reactstrap';
import Link from 'next/link';
import { RiHomeLine, RiMailLine } from 'react-icons/ri';
import Avatar from '@/components/common/Avatar';
import ThemeOptionContext from '@/helper/themeOptionsContext';
import { placeHolderImage } from '../../../data/CommonPath';
import { usePathname } from 'next/navigation';
import Dhootapapeshwar from '../../../../public/assets/images/logo/doothpappeshwarLogo.gif';
import TokyoLogo from '../../../../public/assets/images/logo/doothpappeshwarLogo.gif';
import RomeLogo from '../../../../public/assets/images/logo/doothpappeshwarLogo.gif';
import MadridLogo from '../../../../public/assets/images/logo/doothpappeshwarLogo.gif';
import OtherLogo from '../../../../public/assets/images/logo/doothpappeshwarLogo.gif';

const FooterLogoContent = () => {
  const { themeOption } = useContext(ThemeOptionContext);
  const [logoAbc, setLogo] = useState('');
  const pathName = usePathname();
  useEffect(() => {
    // let logo = themeOption?.logo?.footer_logo;
    let logo = { original_url: Dhootapapeshwar };
    if (pathName == `/theme/paris`) {
      logo = { original_url: Dhootapapeshwar };
    } else if (pathName == `/theme/tokyo`) {
      logo = { original_url: TokyoLogo };
    } else if (pathName == `/theme/rome`) {
      logo = { original_url: RomeLogo };
    } else if (pathName == `/theme/madrid`) {
      logo = { original_url: MadridLogo };
    } else if (pathName == `/theme/berlin` || pathName == `/theme/denver`) {
      logo = { original_url: OtherLogo };
    } else {
      // logo = themeOption?.logo?.footer_logo;
      logo = { original_url: Dhootapapeshwar };
    }
    setLogo(logo);
  }, [pathName]);
  return (
    <Col xl={3} md={12} sm={6}>
      <div className="footer-logo">
        <div className="theme-logo">
          <Link href="/">
            {logoAbc ? (
              <Avatar
                data={logoAbc}
                placeHolder={placeHolderImage}
                name={'Footer'}
                height={28}
                width={160}
              />
            ) : null}
          </Link>
        </div>
        <div className="footer-logo-contain">
          <p>
            Discover convenience redefined at our multipurpose store. From fresh
            groceries to the latest fashion trends, find everything you need
            under one roof. Your one-stop shopping destination for a diverse
            range of products.{' '}
          </p>
          {/* <ul className="address">
              {themeOption?.footer?.about_address && (
                <li>
                  <RiHomeLine />
                  <Link href="https://www.google.com/maps" target="_blank">
                    {themeOption?.footer?.about_address}
                  </Link>
                </li>
              )}
              {themeOption?.footer?.about_email && (
                <li>
                  <RiMailLine />
                  <Link
                    href={`mailto:${themeOption?.footer?.about_email}`}
                    target="_blank"
                  >
                    {themeOption?.footer?.about_email}
                  </Link>
                </li>
              )}
            </ul> */}
        </div>
      </div>
    </Col>
  );
};

export default FooterLogoContent;
