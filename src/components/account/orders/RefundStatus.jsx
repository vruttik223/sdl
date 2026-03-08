'use client';

import './RefundStatus.scss';
import { RiCheckboxCircleFill, RiInformationLine } from 'react-icons/ri';
import { FaChevronRight } from 'react-icons/fa';

const REFUND_STEPS = [
  { key: 'INITIATED', label: 'Refund initiated' },
  {
    key: 'PROCESSED',
    label: 'Refund has been processed by the payment partner',
  },
  { key: 'CREDITED', label: 'Refund credited' },
];

const STATUS_CONFIG = {
  PENDING: { label: 'PENDING', bgColor: '#fef3c7', color: '#d97706' },
  PROCESSING: { label: 'PROCESSING', bgColor: '#dbeafe', color: '#2563eb' },
  COMPLETED: { label: 'COMPLETED', bgColor: '#d1fae5', color: '#059669' },
  FAILED: { label: 'FAILED', bgColor: '#fee2e2', color: '#dc2626' },
};

// Compact Card View
export const RefundStatusCard = ({ refund, onClick }) => {
  const { amount, destination, initiatedDate, status = 'COMPLETED' } = refund;
  const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.COMPLETED;

  return (
    <div className="refund-status-card" onClick={onClick}>
      <div className="refund-card-content">
        <div className="refund-info">
          <p className="amount">
            Amount: <span className="value">₹{amount?.toFixed(2)}</span>
          </p>
          <p className="destination">To: {destination}</p>
          <p className="date">Initiated on: {initiatedDate}</p>
        </div>
        <div className="refund-action">
          <span
            className="status-badge"
            style={{
              backgroundColor: statusConfig.bgColor,
              color: statusConfig.color,
            }}
          >
            {statusConfig.label}
          </span>
          {onClick && <FaChevronRight className="chevron" />}
        </div>
      </div>
      {/* <div className="refund-help">
        <span>Facing issues with your refund amount?</span>
        <RiInformationLine className="info-icon" />
      </div> */}
    </div>
  );
};

// Expanded Timeline View
export const RefundStatusTimeline = ({ refund, onClose }) => {
  const { amount, destination, status = 'COMPLETED', steps = [] } = refund;
  const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.COMPLETED;

  // Default steps if not provided
  const timelineSteps = steps.length > 0 ? steps : REFUND_STEPS;
  const currentIndex =
    status === 'COMPLETED'
      ? timelineSteps.length
      : status === 'PROCESSING'
        ? 1
        : 0;

  return (
    <div className="refund-status-timeline">
      {/* Header */}
      <div className="refund-header">
        <div className="header-left">
          <span className="label">Total Refund:</span>
          <span className="amount">₹{amount}</span>
        </div>
        <span
          className="status-badge"
          style={{
            backgroundColor: statusConfig.bgColor,
            color: statusConfig.color,
          }}
        >
          {statusConfig.label}
        </span>
      </div>

      {/* Destination */}
      <p className="destination">To: {destination}</p>

      {/* Timeline */}
      <ul className="timeline">
        {timelineSteps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex - 1;
          const stepData = steps[index] || {};

          return (
            <li
              key={step.key || index}
              className={`timeline-step ${isCompleted ? 'completed' : ''}`}
            >
              <div className="step-indicator">
                <span className="circle">
                  {isCompleted && <RiCheckboxCircleFill />}
                </span>
                {index !== timelineSteps.length - 1 && (
                  <span className="line" />
                )}
              </div>
              <div className="step-content">
                <p className="step-label">
                  {stepData.label || step.label}
                  {stepData.destination && ` to ${stepData.destination}`}
                </p>
                {stepData.date && (
                  <span className="step-date">{stepData.date}</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {/* Help Link */}
      {/* <div className="refund-help-link">
        <span>Facing issues with your refund amount?</span>
      </div> */}
    </div>
  );
};

// Combined component that can show both views
const RefundStatus = ({ refund, variant = 'card', onClick, onClose }) => {
  if (variant === 'timeline') {
    return <RefundStatusTimeline refund={refund} onClose={onClose} />;
  }
  return <RefundStatusCard refund={refund} onClick={onClick} />;
};

export default RefundStatus;
