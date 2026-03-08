'use client';

import './OrderTracking.scss';
import { RiCheckboxCircleFill } from 'react-icons/ri';

const ORDER_STATUS_FLOW = [
  { key: 'PLACED', label: 'Order Placed' },
  { key: 'CONFIRMED', label: 'Confirmed' },
  { key: 'PACKED', label: 'Packed' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
  { key: 'DELIVERED', label: 'Delivered' },
];

const RETURN_STATUS_FLOW = [
  { key: 'RETURN_REQUESTED', label: 'Return Requested' },
  { key: 'RETURN_APPROVED', label: 'Approved' },
  { key: 'PICKUP_SCHEDULED', label: 'Pickup Scheduled' },
  { key: 'PICKED_UP', label: 'Picked Up' },
  { key: 'REFUNDED', label: 'Refunded' },
];

const OrderTracking = ({ order, returnOrder, steps: customSteps }) => {
  const isReturn = Boolean(returnOrder?.returnStatus);

  const defaultSteps = isReturn ? RETURN_STATUS_FLOW : ORDER_STATUS_FLOW;
  const steps = customSteps || defaultSteps;
  const currentStatus = isReturn ? returnOrder.returnStatus : order.orderStatus;

  const currentIndex = steps.findIndex((step) => step.key === currentStatus);

  return (
    <div className="order-tracking">
      {/* Timeline */}
      <ul className="timeline">
        {steps.map((step, index) => {
          const isCompleted = index <= currentIndex;

          return (
            <li
              key={step.key}
              className={`timeline-step ${isCompleted ? 'completed' : ''}`}
            >
              <div className="step-indicator">
                <span className="circle">
                  {isCompleted && <RiCheckboxCircleFill />}
                </span>
                {index !== steps.length - 1 && <span className="line" />}
              </div>
              <div className="step-content">
                <p className="step-label">{step.label}</p>
                {step.date && <span className="step-date">{step.date}</span>}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default OrderTracking;
