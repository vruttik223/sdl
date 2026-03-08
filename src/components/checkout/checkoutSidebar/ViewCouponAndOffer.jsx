import { useEffect, useState } from 'react';
import CouponModal from './CouponModal';
import ResponsiveModal from '@/components/common/ResponsiveModal';

export default function ViewCouponAndOffer({ appliedCoupon = '', onApplyCoupon, onRemoveCoupon, isLoading = false }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confetti, setConfetti] = useState(0);
  const confettiItems = Array.from({ length: 150 }, (_, index) => index);

  useEffect(() => {
    if (isLoading) {
      setIsModalOpen(false);
    }
  }, [isLoading]);

  const handleApplyCoupon = (couponCode) => {
    if (onApplyCoupon) onApplyCoupon(couponCode);
    setConfetti(1);
    setTimeout(() => {
      setConfetti(0);
    }, 2000);
  };

  const handleRemoveCoupon = () => {
    if (onRemoveCoupon) onRemoveCoupon();
  };

  const handleViewAllCoupons = () => {
    if (isLoading) return;
    setIsModalOpen(true);
  };

  return (
    <div>
      <style>{`
        .coupon-section {
          background: #f8f8f8;
          border-radius: 8px;
          // margin-top: 10px;
        }
        .coupon-button {
          width: 100%;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: all 0.2s;
        }
        .coupon-button:hover {
          border-color: #ccc;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .coupon-button-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .discount-icon {
          width: 24px;
          height: 24px;
          color: var(--theme-color);
          flex-shrink: 0;
        }
        .coupon-text {
          font-size: 15px;
          font-weight: 600;
          color: #1a1a1a;
          text-align: left;
        }
        .arrow-icon {
          width: 20px;
          height: 20px;
          color: #666;
        }
        .applied-coupon {
          // margin-top: 12px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
        }
        .applied-coupon-content {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          padding: 14px 16px;
        }
        .applied-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }
        .applied-info {
          flex: 1;
        }
        .applied-label {
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 2px;
        }
        .applied-code {
          font-size: 13px;
          color: #9ca3af;
          margin: 0;
        }
        .remove-button {
          background-color: #fff5f2;
          color: var(--toastify-color-error, #ff4d4f);
          border: none;
          display: inline-block;
          padding: 3px 10px;
          border-radius: 36px;
          font-size: 12px;
          font-weight: 600;
          text-transform: capitalize;
        }
        // .remove-button {
        //   background: none;
        //   border: none;
        //   color: var(--toastify-color-error, #ff4d4f);
        //   font-weight: 600;
        //   font-size: 12px;
        //   cursor: pointer;
        //   padding: 4px 8px;
        //   border-radius: 4px;
        //   text-transform: uppercase;
        //   background-color: #fff5f2;
        // }
        // .remove-button:hover {
        //   background-color: var(--toastify-color-error, #ff4d4f);
        //   color: #fff;
        // }
        .separator {
          height: 1px;
          background-color: #e8e8e8;
          margin: 0 16px;
        }
        .view-all-button {
          width: 100%;
          border: none;
          color: #1a1a1a;
          font-size: 13px;
          font-weight: 500;
          padding: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: background-color 0.2s;
          background: none;
        }
        // .view-all-button:hover {
        //   background-color: #f8f8f8;
        // }
        .chevron-down {
          width: 16px;
          height: 16px;
        }
        
      `}</style>

      <div className="coupon-section">
        {!appliedCoupon && (
          <button onClick={handleViewAllCoupons} className="coupon-button" disabled={isLoading}>
            <div className="coupon-button-content">
              <svg className="discount-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span className="coupon-text">View Coupons & Offers</span>
            </div>
            <svg className="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {appliedCoupon && (
          <div className="applied-coupon">
            <div className="applied-coupon-content">
              <div className="applied-left">
                <svg className="discount-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <div className="applied-info">
                  <div className="applied-label">View Coupons & Offers</div>
                  <p className="applied-code">COUPON : {appliedCoupon}</p>
                </div>
              </div>
              <button onClick={handleRemoveCoupon} className="remove-button" disabled={isLoading}>
                Remove
              </button>
            </div>
            
            <div className="separator"></div>
            
            <button onClick={handleViewAllCoupons} className="view-all-button" disabled={isLoading}>
              <span>VIEW ALL COUPONS</span>
              <svg className="chevron-down" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <ResponsiveModal
        modal={isModalOpen}
        setModal={setIsModalOpen}
        classes={{
          modalClass: 'theme-modal view-modal coupon-modal modal-md',
          modalHeaderClass: 'justify-content-between',
          title: 'Apply Coupons',
        }}
        backdrop="static"
      >
        <div className="coupo-box" style={{padding:'16px',backgroundColor:'#f8f8f8'}}>
          <CouponModal
          onApplyCoupon={handleApplyCoupon}
          appliedCoupon={appliedCoupon}
          onClose={() => setIsModalOpen(false)}
          isLoading={isLoading}
        />
        </div>
      </ResponsiveModal>

      <div
        className={`confetti-wrapper ${confetti === 1 ? 'show' : ''} `}
      >
        {confettiItems?.map((elem, i) => (
          <div className={`confetti-${elem}`} key={i}></div>
        ))}
      </div>
      
    </div>
  );
}