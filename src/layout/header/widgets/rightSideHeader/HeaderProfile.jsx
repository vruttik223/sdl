import React, { useState } from 'react';
import Link from 'next/link';
import {
  RiUser3Line,
  RiLogoutBoxRLine,
  RiUserLine,
  RiHeart3Line,
  RiArrowDownSLine,
} from 'react-icons/ri';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import Avatar from '@/components/common/Avatar';
import OtpLoginModal from '@/components/auth/login/OtpLoginModal';
import { useLogout } from '@/utils/hooks/useAuth';
import { useUser } from '@/utils/hooks/useUser';

const HeaderProfile = () => {
  const { userData } = useUser();
  const [otpModal, setOtpModal] = useState(false);
  const [modal, setModal] = useState(false);

  const { mutate: logoutMutate, isPending: isLoggingOut } = useLogout();

  const handleLogout = () => {
    logoutMutate({ phone: userData?.phone });
    setModal(false);
  };
  const isLoggedIn = Boolean(userData?.uid);

  return (
    <li className={`right-side ${isLoggedIn ? 'onhover-dropdown' : ''}`}>
      <div
        className={`delivery-login-box ${!isLoggedIn ? 'login-signup-pill' : 'header-user-chip'}`}
        onClick={() => {
          if (!isLoggedIn) setOtpModal(true);
        }}
        role={!isLoggedIn ? 'button' : undefined}
        tabIndex={!isLoggedIn ? 0 : undefined}
      >
        <div className="delivery-icon d-flex align-items-center" style={{ gap: '8px' }}>
          {isLoggedIn ? (
            <>
              <span className="header-user-chip__avatar">
                {userData?.profile_image?.original_url ? (
                  <Avatar
                    data={userData?.profile_image}
                    customClass="user-box"
                    customImageClass="img-fluid header-avatar"
                    height={26}
                    width={26}
                  />
                ) : (
                  <RiUserLine className="header-user-chip__user-icon" />
                )}
              </span>

              <span className="text-capitalize header-profile-name">
                {userData?.name || userData?.firstName || 'Account'}
              </span>

              <RiArrowDownSLine className="header-user-chip__chevron" />
            </>
          ) : (
            <>
              <RiUser3Line className="login-signup-icon" />
              <span className=" login-signup-text">Login/Signup</span>
            </>
          )}
        </div>
      </div>

      {isLoggedIn && (
        <div className="onhover-div onhover-div-login">
          <ul className="user-box-name">
            <li className="product-box-contain">
              <a href={`/account/my-profile`}>
                <RiUserLine className="me-2" /> My Account
              </a>
            </li>

            {/* wishlist */}
            <li className="product-box-contain">
              <a href={`/wishlist`}>
                <RiHeart3Line className="me-2" /> Wishlist
              </a>
            </li>

            <li
              className="product-box-contain"
              onClick={() => setModal(true)}
            >
              <a>
                <RiLogoutBoxRLine className="me-2" /> Logout
              </a>
            </li>

            <ConfirmationModal
              modal={modal}
              setModal={setModal}
              confirmFunction={handleLogout}
              isLoading={isLoggingOut}
            />
          </ul>
        </div>
      )}
      <OtpLoginModal
        isOpen={otpModal}
        setOpen={setOtpModal}
        onClose={() => setOtpModal(false)}
      />
    </li>
  );
};

export default HeaderProfile;
