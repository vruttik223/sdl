import ConfirmDeleteModal from '@/components/common/ConfirmDeleteModal';
import Btn from '@/elements/buttons/Btn';
import { useState } from 'react';
import { RiDeleteBinLine, RiEditBoxLine } from 'react-icons/ri';
import { Col, Row } from 'reactstrap';
import AddressTable from './AddressTable';

const AddressData = ({
  addressState,
  setAddressState,
  modal,
  setModal,
  setEditAddress,
}) => {
  const [deleteId, setDeleteId] = useState('');

  const removeAddress = () => {
    setAddressState((prev) => prev.filter((el) => el.id !== deleteId));
    setModal('');
  };

  return (
    <Row className="g-sm-4 g-3">
      {addressState?.map((address) => (
        <Col xxl={4} xl={6} lg={12} md={6} key={address.id}>
          <div className="address-box">
            {/* Header */}
            <div className="address-header d-flex align-items-center justify-content-between gap-2 mb-2">
              {/* <label className="address-title">{address?.title}</label> */}
              <label className="address-title">Home</label>

              <div className="address-actions d-flex gap-2">
                <button
                  className="address-action-btn"
                  onClick={() => {
                    setEditAddress(address);
                    setModal('edit');
                  }}
                >
                  <RiEditBoxLine />
                </button>

                <button
                  className="address-action-btn"
                  onClick={() => {
                    setDeleteId(address?.id);
                    setModal('remove');
                  }}
                >
                  <RiDeleteBinLine />
                </button>
              </div>
            </div>

            <AddressTable address={address} />
          </div>
        </Col>
      ))}

      <ConfirmDeleteModal
        modal={modal === 'remove'}
        setModal={setModal}
        confirmFunction={removeAddress}
        setDeleteId={setDeleteId}
      />
    </Row>
  );
};

export default AddressData;
