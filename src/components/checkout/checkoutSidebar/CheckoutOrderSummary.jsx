'use client';

import { RiInformationLine } from 'react-icons/ri';
import './CheckoutOrderSummary.scss';
import { UncontrolledTooltip } from 'reactstrap';

const CheckoutOrderSummary = ({ summary }) => {
  const {
    mrp = 0,
    itemTotal = 0,
    discountedPrice = 0,
    couponDiscount = 0,
    shippingCharge = 0,
    deliveryCharge = 0,
    superCoinDiscount = 0,
    grandTotal = 0,
  } = summary;

  const productDiscount = (mrp || itemTotal) - discountedPrice;

  return (
    <div className="order-summary-section">
      <h6 className="summary-title">Bill Details</h6>
      
      <div className="summary-rows">
        <div className="summary-row">
          <span className="label">Item total (MRP)</span>
          <span className="value">₹{(mrp || itemTotal).toFixed(2)}</span>
        </div>

        <div className="summary-row discount">
          <span className="label">Product discount</span>
          <span className="value">- ₹{productDiscount.toFixed(2)}</span>
        </div>

        <div className="summary-row">
          <span className="label">Discounted price</span>
          <span className="value">₹{discountedPrice.toFixed(2)}</span>
        </div>

        {couponDiscount > 0 && (
          <div className="summary-row discount">
            <span className="label">Coupon discount</span>
            <span className="value">- ₹{couponDiscount.toFixed(2)}</span>
          </div>
        )}

        <div className="summary-row">
          <span className="label d-flex gap-1 align-items-center">
            Shipping charge 
            <span
              id="shippingChargeTooltip"
              className="d-inline-flex align-items-center"
              style={{ cursor: 'help' }}
            >
              <RiInformationLine size={16} className="" />
            </span>
          </span>
          <UncontrolledTooltip
            placement="top"
            target="shippingChargeTooltip"
            style={{ fontSize: 12 }}
          >
            {shippingCharge === 0
              ? 'Free shipping on orders above ₹500!'
              : 'Shipping charges depend on your delivery location. Free for orders above ₹500.'}
          </UncontrolledTooltip>
          <span className={`value ${shippingCharge === 0 ? 'text-success' : ''}`}>
            {shippingCharge === 0 ? 'FREE' : `₹${shippingCharge.toFixed(2)}`}
          </span>
        </div>

        {deliveryCharge > 0 && (
          <div className="summary-row">
            <span className="label">Delivery charge</span>
            <span className="value">₹{deliveryCharge.toFixed(2)}</span>
          </div>
        )}

        {superCoinDiscount > 0 && (
          <div className="summary-row discount">
            <span className="label">SDL coin discount</span>
            <span className="value">- ₹{superCoinDiscount.toFixed(2)}</span>
          </div>
        )}

        <div className="summary-row total">
          <span className="label">Grand total <span className="gst-inclusive-text text-muted small mb-0">(Incl. GST)</span></span>
          <span className="value">₹{grandTotal.toFixed(2)}</span>
        </div>
        
      </div>
    </div>
  );
};

export default CheckoutOrderSummary;
