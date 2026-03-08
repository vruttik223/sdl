import { useContext, useEffect, useMemo, useState } from 'react';
import { Input, InputGroup } from 'reactstrap';
import { RiShoppingCartLine, RiAddLine, RiSubtractLine } from 'react-icons/ri';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import CartVariationModal from './CartVariationModal';
import AlternativeProductList from './AlternativeProductList';
import SettingContext from '@/helper/settingContext';
import CartContext from '@/helper/cartContext';
import ThemeOptionContext from '@/helper/themeOptionsContext';
import ViewCouponAndOffer from '@/components/checkout/checkoutSidebar/ViewCouponAndOffer';
import CheckoutOrderSummary from '@/components/checkout/checkoutSidebar/CheckoutOrderSummary';
import { placeHolderImage } from '@/data/CommonPath';
import Btn from '@/elements/buttons/Btn';
import SuperCoinsCard from '@/components/checkout/checkoutSidebar/SuperCoinsCard';
import UserContext from '@/helper/userContext';
import { calculateCheckoutBill, getUserSdlCoins } from '@/utils/checkout/billing';

// Custom function to convert currency to Rupees (₹)
const convertToRupees = (value) => {
  const amount = Number(value);
  return `₹ ${amount.toFixed(2)}`;
};

const HeaderCartBottom = ({
  modal,
  setModal,
  shippingFreeAmt,
  shippingCal,
  onCheckoutDataChange,
}) => {
  const [isSuperCoinsApplied, setIsSuperCoinsApplied] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [isCouponLoading, setIsCouponLoading] = useState(false);
  const { convertCurrency } = useContext(SettingContext);
  const { setCartCanvas } = useContext(ThemeOptionContext);
  const [selectedVariation, setSelectedVariation] = useState('');
  const { cartProducts, getTotal, handleIncDec } = useContext(CartContext);
  const { userData } = useContext(UserContext);
  const router = useRouter();

  const availableSdlCoins = useMemo(() => getUserSdlCoins(userData, 30), [userData]);

  const billDetails = useMemo(
    () =>
      calculateCheckoutBill({
        cartProducts,
        appliedCoupon,
        isSuperCoinsApplied,
        userSdlCoins: availableSdlCoins,
      }),
    [cartProducts, appliedCoupon, isSuperCoinsApplied, availableSdlCoins]
  );

  useEffect(() => {
    onCheckoutDataChange &&
      onCheckoutDataChange({
        appliedCoupon,
        isSuperCoinsApplied,
        billDetails,
      });
  }, [onCheckoutDataChange, appliedCoupon, isSuperCoinsApplied, billDetails]);

  const handleApplyCoupon = (couponCode) => {
    setIsCouponLoading(true);
    setTimeout(() => {
      setAppliedCoupon(couponCode);
      setIsCouponLoading(false);
    }, 600);
  };

  const handleRemoveCoupon = () => {
    setIsCouponLoading(true);
    setTimeout(() => {
      setAppliedCoupon('');
      setIsCouponLoading(false);
    }, 600);
  };

  const goToProductDetails = (productSlug) => {
    if (!productSlug) return;
    setCartCanvas(false);
    router.push(`/products/${productSlug}`);
  };

  return (
    <>
      <div className="cart-body-content">
        {cartProducts?.length > 0 && (
          <>
            {/* <div className="pere-text-box success-box">
              {shippingFreeAmt > getTotal(cartProducts) ? (
                <p>
                  {t('Spend')}{' '}
                  <span className="shipping">
                    {convertCurrency(shippingFreeAmt - getTotal(cartProducts))}
                  </span>{' '}
                  {t('MoreAndEnjoy')}{' '}
                  <span className="shipping">{t('FreeShipping!')}</span>
                </p>
              ) : (
                <p>
                  <span className="shipping">{t('Congratulations')}!</span>{' '}
                  {t('EnjoyFreeShippingOnUs')}!
                </p>
              )}
              <Progress multi>
                {shippingCal <= 30 ? (
                  <Progress striped animated color="danger" value={shippingCal}>
                    <div className="progress-icon">
                      <RiTruckLine />
                    </div>
                  </Progress>
                ) : shippingCal >= 31 && shippingCal <= 80 ? (
                  <Progress striped animated color="warning" value={shippingCal}>
                    <div className="progress-icon">
                      <RiTruckLine />
                    </div>
                  </Progress>
                ) : (
                  <Progress striped animated value={shippingCal}>
                    <div className="progress-icon">
                      <RiTruckLine />
                    </div>
                  </Progress>
                )}
              </Progress>
            </div> */}
            {/* Products List - Similar to Checkout Page */}
            <div
              className="cart-products-list"
              style={{ padding: '0 16px 16px' }}
            >
              <ul className="order-items">
                <div className="alternative-products2 my-3">
                  <AlternativeProductList />
                </div>
                {cartProducts?.map((item, index) => {
                  const product = item?.product;
                  const variation = item?.variation;

                  const image =
                    variation?.variation_image?.original_url ||
                    product?.product_thumbnail?.original_url ||
                    placeHolderImage;

                  const name = variation?.name || product?.name;
                  const salePrice =
                    variation?.sale_price || product?.sale_price;
                  const mrp = variation?.price || product?.price;
                  const quantity = item?.quantity || 1;

                  return (
                    <li className="order-item" key={index}>
                      {/* Product Image */}
                      <div className="thumb">
                        <Image
                          src={image}
                          alt={name}
                          width={48}
                          height={48}
                          draggable={false}
                          unoptimized
                          onClick={() => goToProductDetails(product?.slug)}
                          style={{ cursor: product?.slug ? 'pointer' : 'default' }}
                        />
                      </div>

                      {/* Product Info */}
                      <div className="info">
                        <span
                          className="name"
                          role="button"
                          tabIndex={0}
                          onClick={() => goToProductDetails(product?.slug)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              goToProductDetails(product?.slug);
                            }
                          }}
                          style={{ cursor: product?.slug ? 'pointer' : 'default' }}
                        >
                          {name}
                        </span>
                        <span className="meta">
                          {/* {quantity} {quantity === 1 ? 'unit' : 'units'} */}
                          500 gm
                        </span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="cart_qty">
                        <InputGroup>
                          <Btn
                            type="button"
                            className="btn qty-left-minus"
                            onClick={() =>
                              handleIncDec(
                                -1,
                                product,
                                quantity,
                                null,
                                false,
                                item?.id
                              )
                            }
                          >
                            <RiSubtractLine />
                          </Btn>
                          <Input
                            className="input-number qty-input"
                            type="text"
                            name="quantity"
                            value={quantity}
                            readOnly
                          />
                          <Btn
                            type="button"
                            className="btn qty-right-plus"
                            onClick={() =>
                              handleIncDec(
                                1,
                                product,
                                quantity,
                                null,
                                false,
                                item?.id
                              )
                            }
                          >
                            <RiAddLine />
                          </Btn>
                        </InputGroup>
                      </div>

                      {/* Price */}
                      <div className="price">
                        <span className="current">
                          {convertToRupees(salePrice * quantity)}
                        </span>
                        {mrp > salePrice && (
                          <del>{convertToRupees(mrp * quantity)}</del>
                        )}
                      </div>
                    </li>
                  );
                })}
                {/* <AlternativeProductList /> */}
              </ul>
            </div>

            {/* Alternative Products - design preview */}
            {/* <AlternativeProductList /> */}

            <div className="mb-3" style={{ padding: '0 16px' }}>
              <SuperCoinsCard
                isApplied={isSuperCoinsApplied}
                onToggle={setIsSuperCoinsApplied}
                totalSuperCoinsAmount={billDetails.userSdlCoins}
                disabled={isCouponLoading}
              />
            </div>

            {/* Coupon Section */}
            <div style={{ padding: '0 16px' }}>
              <ViewCouponAndOffer
                appliedCoupon={appliedCoupon}
                onApplyCoupon={handleApplyCoupon}
                onRemoveCoupon={handleRemoveCoupon}
                isLoading={isCouponLoading}
              />
            </div>

            {/* Order Summary */}
            <div style={{ padding: '0 16px 16px' }}>
              <CheckoutOrderSummary summary={billDetails} />
            </div>
          </>
        )}
        {!cartProducts?.length && (
          <div className="empty-cart-box-wrapper d-flex justify-content-center align-items-center h-100">
            <div className="empty-cart-box">
              <div className="empty-icon">
                <RiShoppingCartLine />
              </div>
              <h5>Your cart is currently empty.</h5>
              <Btn
                className="btn btn-sm btn-primary mt-3"
                onClick={() => {
                  router.push('/collections');
                  setCartCanvas(false);
                }}
                style={{ backgroundColor: 'var(--theme-color)', color: '#fff' }}
              >
                Shop Now
              </Btn>
            </div>
          </div>
        )}
      </div>
      <CartVariationModal
        modal={modal}
        setModal={setModal}
        selectedVariation={selectedVariation}
      />
    </>
  );
};

export default HeaderCartBottom;
