import { RiQuestionLine } from 'react-icons/ri';
import Btn from '@/elements/buttons/Btn';
import CustomModal from './CustomModal';

const ConfirmationModal = ({ modal, setModal, isLoading, confirmFunction }) => {
  return (
    <CustomModal
      modal={modal}
      setModal={setModal}
      classes={{
        modalClass: 'theme-modal delete-modal',
        modalHeaderClass: 'p-0',
      }}
    >
      <RiQuestionLine className="icon-box wo-bg" />
      <h5 className="modal-title">Confirmation</h5>
      <p>Are you sure you want to proceed? </p>
      <div className="button-box">
        <Btn
          title="No"
          className="btn btn-md btn-theme-outline fw-bold"
          onClick={() => setModal(false)}
          disabled={isLoading}
        />
        <Btn
          title={'Yes'}
          className="theme-bg-color btn-md fw-bold text-white"
          onClick={confirmFunction}
          disabled={isLoading}
        />
      </div>
    </CustomModal>
  );
};

export default ConfirmationModal;
