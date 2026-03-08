import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import { RiPriceTag3Line } from 'react-icons/ri';
import styles from './CouponModal.module.scss';

// const couponSchema = z.object({
//   couponCode: z
//     .string()
//     .trim()
//     .min(1, 'Coupon code is required')
//     .toUpperCase(),
// });
const couponSchema = z.object({
  couponCode: z
    .string()
    .trim()
    .min(1, 'Coupon code is required')
    .regex(/^[A-Z0-9]+$/, 'Invalid coupon format')
    .toUpperCase(),
});


export default function CouponModal({ onClose, onApplyCoupon, appliedCoupon, isLoading = false }) {
  const [expandedCoupons, setExpandedCoupons] = useState(new Set());
  const [errorMessage, setErrorMessage] = useState('');

  const availableCoupons = [
    { 
      code: 'MEH500', 
      logo: 'ri-price-tag-3-line',
      title: 'Exclusive Discount Offer',
      description: 'Get up to ₹300 OFF on orders above ₹200 using this coupon code.',
      moreDetails: 'Discount will be applied instantly at checkout. Valid for a limited time only. Cannot be combined with other offers.'
    },
    { 
      code: 'ZEPCRED', 
      logo: 'ri-coupon-3-line',
      title: 'Special Savings Offer',
      description: 'Enjoy up to ₹300 OFF on orders above ₹200.',
      moreDetails: 'Offer applicable on eligible orders only. Discount applied directly at checkout. Terms and conditions apply.'
    },
    { 
      code: 'ZSSSBDC', 
      logo: 'ri-bank-card-line',
      title: 'Flat 10% Instant Discount',
      subtitle: 'Offer applicable on total payable amount above ₹1799.',
      description: 'Get Flat 10% OFF up to ₹250 on orders above ₹1799.',
      moreDetails: 'Maximum discount of ₹250. Valid for limited transactions only. Cannot be combined with other ongoing offers.'
    }
  ];
  

  const methods = useForm({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      couponCode: '',
    },
    mode: 'onChange',
  });

  const handleApply = async () => {
    setErrorMessage('');
    const isValid = await methods.trigger();
    if (!isValid) return;
    const values = methods.getValues();
    const validCoupons = availableCoupons.map(c => c.code);
    if (isLoading) {
      return;
    }

    if (validCoupons.includes(values.couponCode.toUpperCase())) {
      onApplyCoupon(values.couponCode);
      methods.reset();
      onClose();
    } else {
      setErrorMessage('You are not eligible for this coupon. Please try another coupon!');
    }
  };

  const handleCouponSelect = (code) => {
    if (isLoading) {
      return;
    }
    onApplyCoupon(code);
    methods.reset();
    onClose();
  };

  const toggleCouponDetails = (index) => {
    const newExpanded = new Set(expandedCoupons);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedCoupons(newExpanded);
  };

  return (
    <>
      <div className={styles.couponInputSection}>
        <FormGroup>
          {/* <Label for="couponCode">Coupon Code</Label> */}
          <div className={styles.inputWrapper}>
            <Controller
              name="couponCode"
              control={methods.control}
              render={({ field, fieldState }) => (
                <div className='col'>
                  <Input
                    {...field}
                    type="text"
                    id="couponCode"
                    className='input-common'
                    placeholder="ZEPCRED"
                    invalid={!!fieldState.error}
                    disabled={isLoading}
                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleApply();
                      }
                    }}
                  />
                  {fieldState.error && (
                    <div className={`message-error ${styles.errorText}`}>
                      {fieldState.error.message}
                    </div>
                  )}
                </div>
              )}
            />
            <button onClick={handleApply} className={styles.applyBtn} disabled={isLoading}>
              {isLoading ? 'Applying...' : 'Apply'}
            </button>
          </div>
          {errorMessage && (
            <div className={`message-error ${styles.errorText}`}>
              {errorMessage}
            </div>
          )}
        </FormGroup>
      </div>

      <div>
        <h6 className={styles.sectionTitle}>Available Coupons</h6>

        {availableCoupons.map((coupon, index) => (
          <div key={index} className={styles.couponCard}>
            <div className={styles.couponHeader}>
              <div className={styles.couponLeft}>
             
                <div className={styles.couponIcon}>
                  <RiPriceTag3Line />
                </div>

                <div className={styles.couponInfo}>
                  <div className={styles.couponCode}>{coupon.code}</div>
                  <h6 className={styles.couponTitle}>{coupon.title}</h6>
                  {coupon.subtitle && (
                    <p className={styles.couponSubtitle}>{coupon.subtitle}</p>
                  )}
                  <p className={styles.couponDescription}>{coupon.description}</p>
                  {expandedCoupons.has(index) && (
                    <div className={styles.moreContent}>
                      {coupon.moreDetails}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => toggleCouponDetails(index)}
                    className={styles.moreBtn}
                  >
                    +{expandedCoupons.has(index) ? 'LESS' : 'MORE'}
                  </button>
                </div>
              </div>
              {appliedCoupon === coupon.code ? (
                <span className={styles.appliedBadge}>APPLIED</span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleCouponSelect(coupon.code)}
                  className={styles.applyBtnSmall}
                  disabled={isLoading}
                >
                  APPLY
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}