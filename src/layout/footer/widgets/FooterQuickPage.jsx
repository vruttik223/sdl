import React, { useContext } from 'react';
import { Col } from 'reactstrap';
import Link from 'next/link';
import ThemeOptionContext from '@/helper/themeOptionsContext';

const FooterQuickPage = ({ footerMenu, setFooterMenu }) => {
  const { themeOption } = useContext(ThemeOptionContext);
  return (
    <Col xl={2} sm={3}>
      <div
        className={`footer-title ${footerMenu == 'pages' ? 'show' : ''}`}
        onClick={() =>
          setFooterMenu((prev) => (prev !== 'pages' ? 'pages' : ''))
        }
      >
        <h4>Quick Pages</h4>
      </div>
      <div className="footer-contain">
        <ul>
          {/* {themeOption?.footer?.help_center?.map((elem, i) => (
            <li key={i}>
              <Link href={`/${elem?.link}`} className="text-content">
                {elem.label}
              </Link>
            </li>
          ))} */}
          <li style={{marginBottom:'8px'}}>
            <Link href={`/account/my-profile`} className="text-content">
              My Profile
            </Link>
          </li>
          <li style={{marginBottom:'8px'}}>
            <Link href={`/collections`} className="text-content">
              Collections
            </Link>
          </li>
          <li style={{marginBottom:'8px'}}>
            <Link href={`/press`} className="text-content">
              Press
            </Link>
          </li>
          <li style={{marginBottom:'8px'}}>
            <Link href={`/events`} className="text-content">
              Events
            </Link>
          </li>
          <li style={{marginBottom:'8px'}}>
            <Link href={`/blogs`} className="text-content">
              Blogs
            </Link>
          </li>
          <li style={{marginBottom:'8px'}}>
            <Link href={`/contact-us`} className="text-content">
              Contact Us
            </Link>
          </li>
          <li style={{marginBottom:'8px'}}>
            <Link href={`/career`} className="text-content">
              Career
            </Link>
          </li>
          <li style={{marginBottom:'8px'}}>
            <Link href={`/faq`} className="text-content">
              FAQs
            </Link>
          </li>
        </ul>
      </div>
    </Col>
  );
};

export default FooterQuickPage;
