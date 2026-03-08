import React, { useContext } from 'react';
import Image from 'next/image';
import ThemeOptionContext from '@/helper/themeOptionsContext';
import FooterSocial from './FooterSocial';
import paymentImage from '../../../../public/assets/images/payment/1.png';
import Link from 'next/link';

const SubFooter = () => {
  const { themeOption } = useContext(ThemeOptionContext);
  return (
    <div className="sub-footer section-small-space-2">
      {/* <div className="payment">
        <Image src={paymentImage} alt="payment" height={35} width={302} />
      </div> */}
      <FooterSocial />

      {/* {themeOption?.footer?.footer_copyright && (
        <div className="reserve">
          <h6 className="text-content">
            {themeOption?.footer?.copyright_content} ddd
          </h6>
        </div>
      )} */}
      <h6 className="text-content my-md-1">
        Terms & Condition | Privacy Policy | Refund Policy
      </h6>

      {/* <FooterSocial /> */}
      <h6 className="text-content">
        Made with love ❤ by <Link href="https://www.hyplap.com" target="_blank">Hyplap</Link>
      </h6>
    </div>
  );
};

export default SubFooter;
