import React from 'react';
import { Form } from 'reactstrap';
import Btn from '@/elements/buttons/Btn';
import RegistrationBasicInfoForm from './RegistrationBasicInfoForm';
import RegistrationDoctorDetailsForm from './RegistrationDoctorDetailsForm';
import RegistrationSpecializationForm from './RegistrationSpecializationForm';

const RegistrationContainer = ({
  registrationStep,
  selectedRole,
  regControl,
  regErrors,
  profilePhotoPreview,
  handleProfileUploadClick,
  profilePhotoInputRef,
  handleFilePreview,
  regCertPreview,
  regCertName,
  degreeCertPreview,
  degreeCertName,
  setRegCertPreview,
  setRegCertName,
  setDegreeCertPreview,
  setDegreeCertName,
  specializations,
  isLoadingSpecializations,
  getRegistrationProgress,
  handleBackRegistrationStep,
  handleRegSubmit,
  handleRegistration,
  handleNextRegistrationStep,
  isRegistrationStep1Valid,
  isRegistrationStep2Valid,
  isSubmitButtonEnabled,
  createProfileMutation,
  triggerReg,
  getRegValues,
}) => {
  const renderRegistrationFormStep = () => {
    switch (registrationStep) {
      case 1:
        return (
          <RegistrationBasicInfoForm
            regControl={regControl}
            regErrors={regErrors}
            profilePhotoPreview={profilePhotoPreview}
            handleProfileUploadClick={handleProfileUploadClick}
            profilePhotoInputRef={profilePhotoInputRef}
            handleFilePreview={handleFilePreview}
          />
        );
      case 2:
        return (
          <RegistrationDoctorDetailsForm
            regControl={regControl}
            regErrors={regErrors}
            regCertPreview={regCertPreview}
            regCertName={regCertName}
            degreeCertPreview={degreeCertPreview}
            degreeCertName={degreeCertName}
            handleFilePreview={handleFilePreview}
            setRegCertPreview={setRegCertPreview}
            setRegCertName={setRegCertName}
            setDegreeCertPreview={setDegreeCertPreview}
            setDegreeCertName={setDegreeCertName}
            onBack={handleBackRegistrationStep}
            getRegistrationProgress={getRegistrationProgress}
          />
        );
      case 3:
        return (
          <RegistrationSpecializationForm
            regControl={regControl}
            specializations={specializations}
            isLoadingSpecializations={isLoadingSpecializations}
            onBack={handleBackRegistrationStep}
            getRegistrationProgress={getRegistrationProgress}
          />
        );
      default:
        return (
          <RegistrationBasicInfoForm
            regControl={regControl}
            regErrors={regErrors}
            profilePhotoPreview={profilePhotoPreview}
            handleProfileUploadClick={handleProfileUploadClick}
            profilePhotoInputRef={profilePhotoInputRef}
            handleFilePreview={handleFilePreview}
          />
        );
    }
  };

  const renderRegistrationFooterButton = () => {
    const isDoctor = selectedRole === 'Doctor';

    if (isDoctor && registrationStep < 3) {
      const isStepValid =
        registrationStep === 1
          ? isRegistrationStep1Valid()
          : isRegistrationStep2Valid();
      return (
        <Btn
          type="button"
          size="sm"
          color="primary"
          className="w-100 rounded-0"
          onClick={handleNextRegistrationStep}
          disabled={!isStepValid || createProfileMutation.isPending}
          style={{
            opacity: !isStepValid || createProfileMutation.isPending ? 0.7 : 1,
            cursor:
              !isStepValid || createProfileMutation.isPending
                ? 'not-allowed'
                : 'pointer',
          }}
        >
          Next
        </Btn>
      );
    }

    const isSubmitEnabled = isSubmitButtonEnabled();

    return (
      <Btn
        type="button"
        size="sm"
        color="primary"
        className="w-100"
        onClick={async () => {
          if (isDoctor && registrationStep === 3) {
            const isValid = await triggerReg([
              'firstName',
              'lastName',
              'email',
              'role',
              'registrationNumber',
              'registrationCertificate',
            ]);
            if (isValid) {
              const formData = getRegValues();
              await handleRegistration(formData);
            }
          } else if (!isDoctor) {
            const isValid = await triggerReg([
              'firstName',
              'lastName',
              'email',
              'role',
            ]);
            if (isValid) {
              const formData = getRegValues();
              await handleRegistration(formData);
            }
          }
        }}
        disabled={!isSubmitEnabled || createProfileMutation.isPending}
        style={{
          opacity:
            !isSubmitEnabled || createProfileMutation.isPending ? 0.7 : 1,
          cursor:
            !isSubmitEnabled || createProfileMutation.isPending
              ? 'not-allowed'
              : 'pointer',
        }}
      >
        {createProfileMutation.isPending ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            Submitting...
          </>
        ) : (
          'Submit'
        )}
      </Btn>
    );
  };

  return (
    <div className="otp-login-top-section">
      <Form className="otp-step" onSubmit={handleRegSubmit(handleRegistration)}>
        <div className="responsive-form-scrollable" key={registrationStep}>
          {renderRegistrationFormStep()}
        </div>

        {/* Fixed Footer Button */}
        <div className="address-form-footer">
          {renderRegistrationFooterButton()}
        </div>
      </Form>
    </div>
  );
};

export default RegistrationContainer;
