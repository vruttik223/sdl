'use client';

import './OrderSummary.scss';

const OrderSummary = ({ summary }) => {
  const {
    mrp = 0,
    itemTotal = 0,
    discountedPrice = 0,
    couponDiscount = 0,
    deliveryCharge = 0,
    sdlCoinDiscount = 0,
    // handlingCharge = 0,
    grandTotal = 0,
  } = summary;

  const productDiscount = (mrp || itemTotal) - (discountedPrice || itemTotal);

  return (
    <div className="order-summary-section">
      <h6 className="summary-title ">Bill Details</h6>
      
      <div className="summary-rows">
        <div className="summary-row">
          <span className="label">Item total (MRP)</span>
          <span className="value">₹{(mrp || itemTotal).toFixed(2)}</span>
        </div>

        {productDiscount > 0 && (
          <div className="summary-row discount">
            <span className="label">Product discount</span>
            <span className="value">- ₹{productDiscount.toFixed(2)}</span>
          </div>
        )}

        <div className="summary-row">
          <span className="label">Discounted price</span>
          <span className="value">₹{(discountedPrice || itemTotal).toFixed(2)}</span>
        </div>

        {couponDiscount > 0 && (
          <div className="summary-row discount">
            <span className="label">Coupon discount</span>
            <span className="value">- ₹{couponDiscount.toFixed(2)}</span>
          </div>
        )}

        {sdlCoinDiscount > 0 && (
          <div className="summary-row discount">
            <span className="label">SDL coin discount</span>
            <span className="value">- ₹{sdlCoinDiscount.toFixed(2)}</span>
          </div>
        )}

        <div className="summary-row">
          <span className="label">Delivery charge</span>
          <span className={`value ${deliveryCharge === 0 ? 'text-success' : ''}`}>
            {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge.toFixed(2)}`}
          </span>
        </div>

        <div className="summary-row total">
          <span className="label">Grand total <span className="gst-inclusive-text text-muted small mb-0">(Incl. GST)</span></span>
          <span className="value">₹{grandTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
