import Link from 'next/link';
import { useContext } from 'react';
import { useTranslation } from '@/utils/translations';
import { RiHeartLine } from 'react-icons/ri';
import WishlistContext from '@/helper/wishlistContext';

const HeaderWishList = ({ wishListIcon }) => {
  const { t } = useTranslation('common');
  const { wishlistProducts } = useContext(WishlistContext);
  const wishlistCount = wishlistProducts?.length || 0;

  return (
    <li className="right-side right-side--wishlist">
      <Link
        href={`/wishlist`}
        className="btn p-0 position-relative header-wishlist header-icon-label-btn header-wishlist-box border-0"
      >
        <span className="header-icon-wrap">
          {wishListIcon ? (
            <span className="header-icon">{wishListIcon}</span>
          ) : (
            <RiHeartLine className="header-icon" />
          )}
          {wishlistCount > 0 && (
            <span className="header-icon-badge">{wishlistCount}</span>
          )}
        </span>
        <span className="header-icon-label">{t('Wishlist') || 'Wishlist'}</span>
      </Link>
    </li>
  );
};

export default HeaderWishList;
