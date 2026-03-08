'use client';

import { toast } from 'react-toastify';
import './OrderDetails.scss';
import { RiFileCopyLine, RiChat1Line, RiInformationLine } from 'react-icons/ri';

const OrderDetails = ({ order, onHelpClick }) => {
  const {
    orderId,
    receiverName,
    receiverPhone,
    deliveryAddress,
    placedAt,
    arrivedAt,
  } = order;

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    toast.success('Order ID copied to clipboard!');
  };

  return (
    <div className="order-details-section">
      <h4 className="section-title">Order Details</h4>

      <div className="details-grid">
        {/* Order ID */}
        <div className="detail-item">
          <span className="label">Order ID</span>
          <div className="value-row">
            <span className="value">#{orderId}</span>
            <button
              className="copy-btn"
              onClick={handleCopyOrderId}
              title="Copy Order ID"
            >
              <RiFileCopyLine />
            </button>
          </div>
        </div>

        {/* Receiver Details */}
        {(receiverName || receiverPhone) && (
          <div className="detail-item">
            <span className="label">Receiver Details</span>
            <span className="value">
              {receiverName}
              {receiverPhone && `, ${receiverPhone}`}
            </span>
          </div>
        )}

        {/* Delivery Address */}
        {deliveryAddress && (
          <div className="detail-item">
            <span className="label">Delivery Address</span>
            <span className="value">{deliveryAddress}</span>
          </div>
        )}

        {/* Order Placed At */}
        {placedAt && (
          <div className="detail-item">
            <span className="label">Order Placed at</span>
            <span className="value">{placedAt}</span>
          </div>
        )}

        {/* Order Arrived At */}
        {arrivedAt && (
          <div className="detail-item">
            <span className="label">Order Arrived at</span>
            <span className="value">{arrivedAt}</span>
          </div>
        )}

        {/* facing issue */}
        <div className="help">
          <span>Facing issues with your refund amount?</span>
          <RiInformationLine className="info-icon" />
        </div>
      </div>

      {/* Help Section */}
      {/* {onHelpClick && (
        <div className="help-section" onClick={onHelpClick}>
          <div className="help-icon">
            <RiChat1Line />
          </div>
          <div className="help-content">
            <p className="help-title">Need help with this order?</p>
            <span className="help-subtitle">Find your issue or reach out via chat</span>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default OrderDetails;
