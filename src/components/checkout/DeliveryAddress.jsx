import React, { useContext, useEffect, useState } from 'react';
import { Row } from 'reactstrap';
import { RiAddLine, RiMapPinLine } from 'react-icons/ri';
import { useTranslation } from '@/utils/translations';
import CheckoutCard from './common/CheckoutCard';
import CustomModal from '../common/CustomModal';
import AddAddressForm from './common/AddAddressForm';
import ShowAddress from './ShowAddress';
import ResponsiveModal from '../common/ResponsiveModal';

const DeliveryAddress = ({
  type,
  title,
  address,
  modal,
  mutate,
  setModal,
  setFieldValue,
  values,
  isAddressSubmitting,
}) => {
  const { t } = useTranslation('common');
  const [showAddressLimitModal, setShowAddressLimitModal] = useState(false);

  useEffect(() => {
    if (!address?.length) return;

    const currentSelectedAddress = values?.[`${type}_address_id`];
    if (currentSelectedAddress) {
      return;
    }

    const defaultAddress = address.find((item) => item?.is_default) || address[0];
    setFieldValue(`${type}_address_id`, defaultAddress?.id || '');
  }, [address, setFieldValue, type, values]);

  const handleAddNewAddress = () => {
    if (isAddressSubmitting) return;
    if ((address?.length || 0) >= 5) {
      setShowAddressLimitModal(true);
      return;
    }
    setModal(type);
  };

  return (
    <>
      <CheckoutCard icon={<RiMapPinLine />}>
        <div className="checkout-title">
          <h4>{t(title)}</h4>
          <a
            className="d-flex align-items-center fw-bold"
            onClick={handleAddNewAddress}
          >
            <RiAddLine className="me-1"></RiAddLine>
            {t('AddNew')}
          </a>
        </div>
        <div className="checkout-detail">
          {
            <>
              {address?.length > 0 ? (
                <div className="address-list" data-lenis-prevent style={{ display: 'flex', gap: '10px',overflowX: 'auto' }}>
                  {address?.map((item, i) => (
                    <ShowAddress item={item} key={i} type={type} index={i} />
                  ))}
                </div>
              ) : (
                <div className="empty-box">
                  <h2>{t('NoAddressFound')}</h2>
                </div>
              )}
            </>
          }
          <ResponsiveModal
            modal={modal == type ? true : false}
            setModal={setModal}
            classes={{
              modalClass: 'theme-modal modal-md',
              modalHeaderClass: 'justify-content-between',
              title: type === 'shipping' ? 'Add Shipping Address' : 'Add Billing Address',
            }}
          >
            <AddAddressForm
              mutate={mutate}
              setModal={setModal}
              type={type}
              isSubmitting={isAddressSubmitting}
            />
          </ResponsiveModal>
          <ResponsiveModal
            modal={showAddressLimitModal}
            setModal={setShowAddressLimitModal}
            classes={{
              modalClass: 'theme-modal modal-sm',
              modalHeaderClass: 'justify-content-between',
              title: 'Address Limit Reached',
            }}
          >
            <div className="p-2">Maximum 5 addresses can be added.</div>
          </ResponsiveModal>
        </div>
      </CheckoutCard>
    </>
  );
};

export default DeliveryAddress;
