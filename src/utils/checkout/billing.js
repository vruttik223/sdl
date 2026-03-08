export const COUPON_RULES = {
  MEH500: { type: 'flat', value: 300, minOrder: 200 },
  ZEPCRED: { type: 'flat', value: 300, minOrder: 200 },
  ZSSSBDC: { type: 'percent', value: 10, maxDiscount: 250, minOrder: 1799 },
};

export const normalizeCouponCode = (couponCode = '') =>
  String(couponCode || '').trim().toUpperCase();

export const calculateCouponDiscount = ({
  discountedTotal = 0,
  couponCode = '',
}) => {
  const safeDiscountedTotal = Number(discountedTotal) || 0;
  const normalizedCode = normalizeCouponCode(couponCode);
  const rule = COUPON_RULES[normalizedCode];

  if (!rule || safeDiscountedTotal <= 0 || safeDiscountedTotal < (rule.minOrder || 0)) {
    return 0;
  }

  let couponDiscount = 0;
  if (rule.type === 'flat') {
    couponDiscount = Number(rule.value) || 0;
  } else if (rule.type === 'percent') {
    couponDiscount = (safeDiscountedTotal * (Number(rule.value) || 0)) / 100;
    if (rule.maxDiscount) {
      couponDiscount = Math.min(couponDiscount, Number(rule.maxDiscount));
    }
  }

  return Math.max(0, Math.min(couponDiscount, safeDiscountedTotal));
};

export const getUserSdlCoins = (userData, fallback = 30) => {
  const candidates = [
    userData?.sdl_coins,
    userData?.sdlCoins,
    userData?.wallet?.sdl_coins,
    userData?.wallet?.sdlCoins,
    userData?.wallet_balance,
    userData?.walletBalance,
  ];

  const found = candidates.find((value) => Number.isFinite(Number(value)));
  const parsed = Number(found);

  if (Number.isFinite(parsed) && parsed >= 0) {
    return Math.floor(parsed);
  }

  return fallback;
};

export const calculateCheckoutBill = ({
  cartProducts = [],
  appliedCoupon = '',
  isSuperCoinsApplied = false,
  userSdlCoins = 30,
}) => {
  const safeProducts = Array.isArray(cartProducts) ? cartProducts : [];

  const mrpTotal = safeProducts.reduce((sum, item) => {
    const price = item?.variation?.price || item?.product?.price || 0;
    return sum + Number(price) * Number(item?.quantity || 1);
  }, 0);

  const discountedTotal = safeProducts.reduce((sum, item) => {
    const salePrice = item?.variation?.sale_price || item?.product?.sale_price || 0;
    return sum + Number(salePrice) * Number(item?.quantity || 1);
  }, 0);

  const productDiscount = Math.max(0, mrpTotal - discountedTotal);
  const couponDiscount = calculateCouponDiscount({
    discountedTotal,
    couponCode: appliedCoupon,
  });

  const shippingCharge = discountedTotal >= 500 ? 0 : 50;
  const deliveryCharge = 0;
  const totalBeforeCoins = Math.max(
    0,
    discountedTotal - couponDiscount + shippingCharge + deliveryCharge
  );

  const normalizedCoinBalance = Math.max(0, Number(userSdlCoins) || 0);
  const superCoinDiscount = isSuperCoinsApplied
    ? Math.min(normalizedCoinBalance, totalBeforeCoins)
    : 0;

  const grandTotal = Math.max(0, totalBeforeCoins - superCoinDiscount);

  return {
    mrp: Number(mrpTotal.toFixed(2)),
    itemTotal: Number(mrpTotal.toFixed(2)),
    discountedPrice: Number(discountedTotal.toFixed(2)),
    productDiscount: Number(productDiscount.toFixed(2)),
    couponDiscount: Number(couponDiscount.toFixed(2)),
    shippingCharge: Number(shippingCharge.toFixed(2)),
    deliveryCharge: Number(deliveryCharge.toFixed(2)),
    superCoinDiscount: Number(superCoinDiscount.toFixed(2)),
    userSdlCoins: normalizedCoinBalance,
    grandTotal: Number(grandTotal.toFixed(2)),
    appliedCoupon: normalizeCouponCode(appliedCoupon),
  };
};
