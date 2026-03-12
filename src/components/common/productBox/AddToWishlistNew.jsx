'use client';

import { RiHeartLine, RiHeartFill } from 'react-icons/ri';
import { useMemo, useState } from 'react';
import { useWishlist, useToggleWishlist } from '@/utils/hooks/useWishlist';
import { ToastNotification } from '@/utils/customFunctions/ToastNotification';
import ConfirmationModal from '../ConfirmationModal';
import OtpLoginModal from '@/components/auth/login/OtpLoginModal';
import { isAppMode } from '@/utils/webview-detector';
import { getAppAuthToken, requestAuth } from '@/utils/app-bridge';

const AddToWishlistNew = ({ productObj, isActive = false, onRemoveClick }) => {
  const { data: wishlistData } = useWishlist({ page: 1, limit: 1000 });
  const toggleWishlistMutation = useToggleWishlist();
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const isInWishlist = useMemo(() => {
    // If this is wishlist page (onRemoveClick provided), always show active
    if (onRemoveClick && isActive) return true;

    // Check if product is in wishlist from server data
    if (!productObj?.uid || !wishlistData?.success) return false;

    return (
      wishlistData.data?.wishlist?.some(
        (item) => item.productUid === productObj.uid
      ) ?? false
    );
  }, [productObj?.uid, wishlistData, onRemoveClick, isActive]);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // If on wishlist page, trigger remove confirmation
    if (onRemoveClick) {
      onRemoveClick(productObj);
      return;
    }

    // Check if user is authenticated
    if (typeof window !== 'undefined') {
      const appToken = getAppAuthToken();
      const token = appToken || sessionStorage.getItem('userToken');

      if (!token) {
        // If running inside the React Native app WebView, ask the app to handle login
        if (isAppMode()) {
          console.log('[Wishlist] No token in app mode → requesting auth from app');
          requestAuth();
          return;
        }

        // Normal website: open OTP login modal
        console.log('[Wishlist] No token in browser → opening OTP login modal');
        setLoginModalOpen(true);
        return;
      }
    }

    // Toggle wishlist status
    if (productObj?.uid) {
      // If product is in wishlist, show confirmation before removing
      if (isInWishlist) {
        setConfirmationModal(true);
      } else {
        // If not in wishlist, add directly without confirmation
        toggleWishlistMutation.mutate(
          {
            productUid: productObj.uid,
          },
          {
            onSuccess: (data) => {
              if (data.success) {
                ToastNotification(
                  'success',
                  data.message || 'Wishlist updated successfully'
                );
              }
            },
            onError: (error) => {
              ToastNotification(
                'error',
                error.message || 'Failed to update wishlist'
              );
            },
          }
        );
      }
    }
  };

  const confirmRemove = () => {
    if (productObj?.id) {
      removeFromWishlist(productObj.id);
    }
    setConfirmationModal(false);
  };

  const iconStyle = {
    color: isInWishlist ? 'var(--wishlist-filled)' : 'inherit',
    transition: 'color 0.2s ease, background-color 0.2s ease',
    fontSize: '1.125rem',
  };

  const positionStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    zIndex: 1,
  };

  return (
    <>
      <li
        title="Wishlist"
        style={positionStyle}
        className={isInWishlist ? 'active' : ''}
      >
        <button
          type="button"
          className={`notifi-wishlist-new ${isInWishlist ? 'active' : ''}`}
          onClick={handleClick}
          disabled={toggleWishlistMutation.isPending}
        >
          {isInWishlist ? (
            <RiHeartFill style={iconStyle} />
          ) : (
            <RiHeartLine style={iconStyle} />
          )}
        </button>
      </li>
      <ConfirmationModal
        modal={confirmationModal}
        setModal={setConfirmationModal}
        confirmFunction={confirmRemove}
      />
      <OtpLoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        setOpen={setLoginModalOpen}
        redirectUrl="/wishlist"
      />
    </>
  );
};

export default AddToWishlistNew;
