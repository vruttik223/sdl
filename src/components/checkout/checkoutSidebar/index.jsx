import React, { useContext, useMemo, useState } from 'react';
import { Card, Col } from 'reactstrap';
import { useTranslation } from '@/utils/translations';
import SidebarProduct from './SidebarProduct';
import CartContext from '@/helper/cartContext';
import PlaceOrder from './PlaceOrder';
import ViewCouponAndOffer from './ViewCouponAndOffer';
import CheckoutOrderSummary from './CheckoutOrderSummary';
import SuperCoinsCard from './SuperCoinsCard';
import UserContext from '@/helper/userContext';
import { calculateCheckoutBill, getUserSdlCoins } from '@/utils/checkout/billing';
import { useEffect } from 'react';

const CheckoutSidebar = ({ values, setFieldValue }) => {
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [isSuperCoinsApplied, setIsSuperCoinsApplied] = useState(false);
  const [isCouponLoading, setIsCouponLoading] = useState(false);
  const { cartProducts } = useContext(CartContext);
  const { userData } = useContext(UserContext);
  const { t } = useTranslation('common');
  const [instantBuyProduct, setInstantBuyProduct] = useState(null);

  // Check for instant buy product (Buy Now flow)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedProduct = sessionStorage.getItem('instantBuyProduct');
    if (savedProduct) {
      try {
        const parsed = JSON.parse(savedProduct);
        setInstantBuyProduct(parsed);
      } catch (error) {
        console.error('Unable to parse instantBuyProduct', error);
      }
    }
  }, []);

  // Use instant buy product if available, otherwise use cart products
  const checkoutProducts = useMemo(() => {
    return instantBuyProduct ? [instantBuyProduct] : cartProducts;
  }, [instantBuyProduct, cartProducts]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const rawDraft = sessionStorage.getItem('checkout-offcanvas-data');
    if (!rawDraft) return;

    try {
      const parsedDraft = JSON.parse(rawDraft);
      if (parsedDraft?.appliedCoupon) {
        setAppliedCoupon(parsedDraft.appliedCoupon);
      }
      if (typeof parsedDraft?.isSuperCoinsApplied === 'boolean') {
        setIsSuperCoinsApplied(parsedDraft.isSuperCoinsApplied);
      }
    } catch (error) {
      console.error('Unable to parse checkout-offcanvas-data', error);
    }
  }, []);

  const availableSdlCoins = useMemo(() => getUserSdlCoins(userData, 30), [userData]);

  const billDetails = useMemo(() => {
    return calculateCheckoutBill({
      cartProducts: checkoutProducts,
      appliedCoupon,
      isSuperCoinsApplied,
      userSdlCoins: availableSdlCoins,
    });
  }, [checkoutProducts, appliedCoupon, isSuperCoinsApplied, availableSdlCoins]);

  const onApplyCoupon = (couponCode) => {
    setIsCouponLoading(true);
    setTimeout(() => {
      setAppliedCoupon(couponCode);
      setIsCouponLoading(false);
    }, 600);
  };

  const onRemoveCoupon = () => {
    setIsCouponLoading(true);
    setTimeout(() => {
      setAppliedCoupon('');
      setIsCouponLoading(false);
    }, 600);
  };

  return (
    <Col xxl="4" xl="5">
      <Card className="pos-detail-card">
        <div className="title-header">
          <h5 className="fw-bold">{t('Checkout')}</h5>
        </div>
        <SidebarProduct values={values} setFieldValue={setFieldValue} checkoutProducts={checkoutProducts} isInstantBuy={!!instantBuyProduct} />
        <div className="mt-3">
          <SuperCoinsCard
            isApplied={isSuperCoinsApplied}
            onToggle={setIsSuperCoinsApplied}
            totalSuperCoinsAmount={billDetails.userSdlCoins}
            disabled={isCouponLoading}
          />
        </div>
        <div className="mt-3">
          <ViewCouponAndOffer
            appliedCoupon={appliedCoupon}
            onApplyCoupon={onApplyCoupon}
            onRemoveCoupon={onRemoveCoupon}
            isLoading={isCouponLoading}
          />
        </div>
        <div className="">
          <CheckoutOrderSummary summary={billDetails} />
        </div>
        <div className="" style={{ position: 'sticky', bottom: 20, width: '100%' }}>
          <PlaceOrder values={values} cartProducts={checkoutProducts} billDetails={billDetails} instantBuyProduct={instantBuyProduct} />
        </div>
      </Card>
    </Col>
  );
};

export default CheckoutSidebar;
