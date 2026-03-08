import React, { useContext, useMemo } from 'react';
import { useTranslation } from '@/utils/translations';
import HeaderCartData from './HeaderCartData';
import CartContext from '@/helper/cartContext';
import ThemeOptionContext from '@/helper/themeOptionsContext';
import { RiShoppingCartLine } from 'react-icons/ri';

const HeaderCart = () => {
  const { themeOption, cartCanvas, setCartCanvas } =
    useContext(ThemeOptionContext);
  const { t } = useTranslation('common');
  const { cartProducts } = useContext(CartContext);
  const cartStyle = useMemo(() => {
    return themeOption?.general?.cart_style
      ? themeOption?.general?.cart_style
      : 'cart_sidebar';
  });
  const cartCount = cartProducts?.reduce(
    (sum, item) => sum + (Number(item?.quantity) || 1),
    0
  ) || 0;

  return (
    <li className="right-side right-side--cart">
      <div className="onhover-dropdown header-badge header-cart-box">
        <button
          className="btn p-0 position-relative header-wishlist header-icon-label-btn header-cart-box border-0"
          onClick={() =>
            cartStyle == 'cart_sidebar' && setCartCanvas(!cartCanvas)
          }
        >
          <span className="header-icon-wrap">
            <RiShoppingCartLine className="header-icon" />
            {cartCount > 0 && (
              <span className="header-icon-badge">{cartCount}</span>
            )}
          </span>
          <span className="header-icon-label">{t('Cart') || 'Cart'}</span>
        </button>
        <HeaderCartData cartStyle={cartStyle} />
      </div>
    </li>
  );
};

export default HeaderCart;
