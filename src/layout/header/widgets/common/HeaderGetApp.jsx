'use client'
import React, { useContext, useState } from 'react';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from 'reactstrap';
import { RiAndroidLine, RiAppleLine } from 'react-icons/ri';
import { APP_URLS } from '@/utils/constants';

const HeaderGetApp = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prev) => !prev);

  const ANDROID_URL = APP_URLS.ANDROID;
  const IOS_URL = APP_URLS.IOS;

  if (!ANDROID_URL && !IOS_URL) return null;
  
  const redirectTo = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Dropdown
      className="theme-form-select"
      isOpen={dropdownOpen}
      toggle={toggle}
    >
      <DropdownToggle tag={"div"} caret className="select-dropdown" type="button">
        <span>Get the App</span>
      </DropdownToggle>

      <DropdownMenu className="dropdown-menu-end sm-dropdown-menu">
        {ANDROID_URL && (
          <DropdownItem onClick={() => redirectTo(ANDROID_URL)}>
            <RiAndroidLine className="me-2" />
            Android App
          </DropdownItem>
        )}

        {IOS_URL && (
          <DropdownItem onClick={() => redirectTo(IOS_URL)}>
            <RiAppleLine className="me-2" />
            iOS App
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
};

export default HeaderGetApp;
