import React from 'react';
import { RiInformationLine } from 'react-icons/ri';
import { UncontrolledTooltip } from 'reactstrap';
import styles from './SuperCoinsCard.module.scss';

const SuperCoinsCard = ({
  isApplied,
  onToggle,
  totalSuperCoinsAmount = 0,
  disabled = false,
}) => {
  const savedText = `₹${totalSuperCoinsAmount.toFixed(2)}`;

  const handleChange = () => {
    if (disabled) return;
    if (onToggle) {
      onToggle(!isApplied);
    }
  };

  return (
    <div className={styles.supercoinsWrapper}>
      <button
        type="button"
        className={styles.supercoinsCard}
        onClick={handleChange}
        disabled={disabled}
      >
        <div className={styles.supercoinsLeft}>
          <div className={`${styles.supercoinsCheckbox} ${isApplied ? styles.checked : ''}`}>
            <div className={styles.supercoinsCheckboxIcon} />
          </div>

          <div className={styles.supercoinsTextGroup}>
            <div className={styles.supercoinsTitleRow}>
              <span className={styles.supercoinsTitle}>SDL coins</span>
            </div>
            <div className={styles.supercoinsSubtitle}>
              <span id="supercoinsInfo">
                Total Active SDL coins: {savedText}
              </span>
              <RiInformationLine
                size={14}
                className={styles.supercoinsInfoIcon}
                id="supercoinsInfoIcon"
              />
            </div>
          </div>
        </div>

        <div className={styles.supercoinsRight}>
          <div className={styles.supercoinsRightLabel}>You saved</div>
          <div className={styles.supercoinsRightAmount}>
            {isApplied ? savedText : '₹00.00'}
          </div>
        </div>
      </button>

      <UncontrolledTooltip
        placement="top"
        target="supercoinsInfoIcon"
        className="supercoins-custom-tooltip"
      >
        <div className={styles.tooltipContent}>
          <div className={styles.tooltipTitle}>
            You have {totalSuperCoinsAmount} SDL coins
          </div>
          <div className={styles.tooltipText}>
            Pay your entire order value with SDL coins.
          </div>
          <div className={styles.tooltipDivider} />
          <div className={styles.tooltipRate}>1 SDL Coin = ₹1</div>
        </div>
      </UncontrolledTooltip>
    </div>
  );
};

export default SuperCoinsCard;
