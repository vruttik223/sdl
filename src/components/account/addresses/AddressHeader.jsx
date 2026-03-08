import Btn from '@/elements/buttons/Btn';
import { RiAddLine, RiCloseLine } from 'react-icons/ri';
import AddressData from './AddressData';
import { useContext, useEffect, useState } from 'react';
import AccountContext from '@/helper/accountContext';
import ResponsiveModal from '@/components/common/ResponsiveModal';
import AddAddressForm from '@/components/checkout/common/AddAddressForm';
import CustomModal from '@/components/common/CustomModal';

const AddressHeader = () => {
  const [addressState, setAddressState] = useState([]);
  const [editAddress, setEditAddress] = useState();
  const [modal, setModal] = useState(false);
  const [addressLengthError, setAddressLengthError] = useState(false);
  const { accountData } = useContext(AccountContext);
  useEffect(() => {
    setAddressState(
      Array.isArray(accountData?.address) ? accountData.address : []
    );
  }, [accountData]);


  const addAddress = () => {
    setModal(false);
  };

  const editMutate = () => {
    setModal(false);
  };

  const handleAddAddress = () => {
    if (addressState.length < 5) {
      setModal('add');
    } else {
      setAddressLengthError(true);
    }
  };

  
  return (
    <>
      <div className="dashboard-address">
        <div className="title-header">
          <div className="d-flex align-items-center w-100 justify-content-between">
            <h5>Saved Address</h5>
            <Btn
            color="primary"
              className="mt-lg-0 ms-auto d-flex gap-1 align-items-center btn-sm"
              onClick={handleAddAddress}
              title={'Add Address'}
            >
              <RiAddLine className="stroke-w-1" />
            </Btn>
          </div>
        </div>
        <AddressData
          addressState={addressState}
          setAddressState={setAddressState}
          modal={modal}
          setModal={setModal}
          setEditAddress={setEditAddress}
        />
      </div>
      <div className="checkout-detail">
        <ResponsiveModal
          modal={modal == 'add' || modal == 'edit' ? true : false}
          setModal={() => setModal(false)}
          closeButton={<RiCloseLine className="btn-close position-static" />}
          classes={{
            modalClass: 'theme-modal view-modal address-modal modal-md',
            modalHeaderClass: 'justify-content-between',
            title: modal === 'add' ? 'Add Address' : 'Edit Address',
          }}
          backdrop="static"
        >
          <div className="right-sidebar-box">
            <AddAddressForm
              mutate={modal == 'add' ? addAddress : editMutate}
              setModal={setModal}
              setEditAddress={setEditAddress}
              editAddress={editAddress}
              modal={modal}
              type={modal}
              setAddressState={setAddressState}
            />
          </div>
        </ResponsiveModal>
      </div>
      <CustomModal
        modal={addressLengthError}
        setModal={setAddressLengthError}
        classes={{
          modalClass: 'theme-modal view-modal address-view-modal modal-md',
          modalHeaderClass: 'justify-content-between',
          title: 'Address Limit Reached',
        }}
      >
        <div className="text-center">
          <p className="mb-3">
            You can add a maximum of <strong>5 addresses</strong>.
            <br />
            To add a new address, please remove an existing one.
          </p>
          <Btn
            title="Okay, Got it"
            className="theme-bg-color btn-md fw-bold text-light w-100"
            onClick={() => setAddressLengthError(false)}
          />
        </div>
      </CustomModal>
    </>
  );
};

export default AddressHeader;
