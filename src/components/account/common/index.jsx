import React, { useContext } from 'react';
import Image from 'next/image';
import coverImage from '../../../../public/assets/images/inner-page/cover-img.jpg';
import Avatar from '@/components/common/Avatar';
import { useUser } from '@/utils/hooks/useUser';

const SidebarProfile = () => {
  const {userData, isUserLoading, isAuthenticated } = useUser();

  return (
    <>
      <div className="profile-box">
        <div className="cover-image">
          <Image
            src={coverImage}
            className="img-fluid"
            alt="cover-image"
            height={150}
            width={378}
          />
        </div>

        <div className="profile-contain">
          <div className="profile-image">
            <div className="position-relative">
              <div className="user-round">
                <Avatar
                  name={`${userData?.firstName} ${userData?.lastName}`}
                  customImageClass={'update_img'}
                  alt="profile-image"
                  height={108}
                  width={108}
                />
              </div>
            </div>
          </div>

          <div className="profile-name">
            <h3>{userData?.firstName} {userData?.lastName}</h3>
            <h6 className="text-content">{userData?.email}</h6>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarProfile;
