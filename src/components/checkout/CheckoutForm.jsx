import { Form, Formik } from 'formik';
import { Col, Row } from 'reactstrap';
import DeliveryAddress from './DeliveryAddress';
import DeliveryOptions from './DeliveryOptions';
import PaymentOptions from './PaymentOptions';
import { useContext, useEffect, useMemo, useState } from 'react';
import AccountContext from '@/helper/accountContext';
import CheckoutSidebar from './checkoutSidebar';
import LoginPrompt from './LoginPrompt';
import UserContext from '@/helper/userContext';
import useCreate from '@/utils/hooks/useCreate';
import { AddressAPI } from '@/utils/axiosUtils/API';

const CheckoutForm = () => {
  const { accountData, refetch } = useContext(AccountContext);
  const { userData } = useContext(UserContext);
  const [address, setAddress] = useState([]);
  const [defaultAddressId, setDefaultAddressId] = useState('');
  const [modal, setModal] = useState('');

  const addressList = useMemo(() => {
    const accountAddresses = Array.isArray(accountData?.address) ? accountData.address : [];
    const authAddresses = Array.isArray(userData?.address) ? userData.address : [];
    return accountAddresses.length > 0 ? accountAddresses : authAddresses;
  }, [accountData?.address, userData?.address]);

  const { mutate: addAddressMutate, isPending: isAddressSubmitting } = useCreate(
    AddressAPI,
    null,
    false,
    'Address added successfully',
    () => {
      setModal('');
      refetch && refetch();
    }
  );

  useEffect(() => {
    setAddress(addressList);
  }, [addressList]);

  useEffect(() => {
    let preferredAddressId = '';

    if (typeof window !== 'undefined') {
      const rawDraft = sessionStorage.getItem('checkout-offcanvas-data');
      if (rawDraft) {
        try {
          const parsedDraft = JSON.parse(rawDraft);
          preferredAddressId = parsedDraft?.selectedAddressId || '';
        } catch (error) {
          console.error('Unable to parse checkout-offcanvas-data', error);
        }
      }
    }

    if (!preferredAddressId && addressList?.length > 0) {
      const defaultAddress = addressList.find((item) => item?.is_default) || addressList[0];
      preferredAddressId = defaultAddress?.id || '';
    }

    setDefaultAddressId(preferredAddressId || '');
  }, [addressList]);

  return (
    <Formik
      enableReinitialize
      initialValues={{
        shipping_address_id: defaultAddressId || '',
        billing_address_id: defaultAddressId || '',
      }}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <div className="pb-4 checkout-section-2">
            <Row className="g-sm-4 g-3">
              <Col xxl="8" xl="7">
                <div className="left-sidebar-checkout">
                  <div className="checkout-detail-box">
                    <ul>
                      {/* {!accountData?.id && <LoginPrompt />} */}
                      <LoginPrompt />
                      <DeliveryAddress
                        key="shipping"
                        type="shipping"
                        title={'ShippingAddress'}
                        values={values}
                        updateId={values['consumer_id']}
                        setFieldValue={setFieldValue}
                        address={address}
                        modal={modal}
                        mutate={addAddressMutate}
                        setModal={setModal}
                        isAddressSubmitting={isAddressSubmitting}
                      />
                      {/* <DeliveryAddress
                        key="billing"
                        type="billing"
                        title={'BillingAddress'}
                        values={values}
                        updateId={values['consumer_id']}
                        setFieldValue={setFieldValue}
                        address={address}
                        modal={modal}
                        mutate={addAddress}
                        setModal={setModal}
                      />
                      <DeliveryOptions
                        values={values}
                        setFieldValue={setFieldValue}
                      /> */}
                      {/* <PaymentOptions
                        values={values}
                        setFieldValue={setFieldValue}
                      /> */}
                    </ul>
                  </div>
                </div>
              </Col>
              <CheckoutSidebar values={values} setFieldValue={setFieldValue} />
            </Row>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CheckoutForm;
