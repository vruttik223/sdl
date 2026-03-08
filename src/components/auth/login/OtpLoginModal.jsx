'use client';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ThemeOptionContext from '@/helper/themeOptionsContext';
import { ToastNotification } from '@/utils/customFunctions/ToastNotification';
import ResponsiveModal from '@/components/common/ResponsiveModal';
import {
  useCreateProfile,
  useDoctorSpecializations,
  useLogin,
  useResendOtp,
  useVerifyOtp,
} from '@/utils/hooks/useAuth';
import {
  otpPhoneSchema,
  otpVerificationSchema,
  registrationFormSchema,
} from '@/utils/validation/ZodValidationSchema';

// Hooks
import { useOtpAuthFlow } from './hooks/useOtpAuthFlow';
import { useCameraCapture } from './hooks/useCameraCapture';
import { useFilePreview } from './hooks/useFilePreview';

// Components
import PhoneNumberForm from './components/PhoneNumberForm';
import OtpVerificationForm from './components/OtpVerificationForm';
import RegistrationContainer from './components/RegistrationContainer';
import KycPendingView from './components/KycPendingView';
import CameraModal from './components/CameraModal';
import ProfilePickerModal from './components/ProfilePickerModal';

// Assets
import BrandLogo from '../../../../public/assets/images/logo/doothpappeshwarLogo.gif';
import playstoreImage from '../../../../public/assets/images/icon/play-store.png';
import appstoreImage from '../../../../public/assets/images/icon/app-store.png';
import { useUser } from '@/utils/hooks/useUser';

const OtpLoginModal = ({ isOpen, onClose, setOpen, redirectUrl, onLoginSuccess }) => {
  const { themeOption } = useContext(ThemeOptionContext);
  const [showProfilePicker, setShowProfilePicker] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const profilePhotoInputRef = useRef(null);
  const router = useRouter();

  const { refetchUser } = useUser();

  // Custom hooks
  const authFlow = useOtpAuthFlow();
  const cameraCapture = useCameraCapture();
  const filePreviews = useFilePreview();

  // React Query mutations
  const loginMutation = useLogin({
    onSuccess: (data) => {
      ToastNotification(
        'success',
        `${data.message} @ ${data.data.otp}` ||
          `OTP sent successfully! ${data.data.otp}`
      );
      authFlow.moveToOtpStep();
      setTimeout(() => {
        authFlow.inputRefs.current?.[0]?.focus();
      }, 50);
    },
    onError: (error) => {
      ToastNotification(
        'error',
        error?.message || 'Failed to send OTP. Please try again.'
      );
    },
  });

  const verifyOtpMutation = useVerifyOtp({
    onSuccess: (data) => {
      console.log('OTP verification response:', data);
      if (data.success && data.data?.customerStatus === 'inactive') {
        ToastNotification(
          'info',
          data.message ||
            'Your account is inactive. Please contact customer support.'
        );
        closeAndReset();
        return;
      }
      if (data.success) {
        if (data.data?.needsProfile || data.data?.isNewUser) {
          ToastNotification(
            'success',
            data.message || 'OTP verified! Please complete your profile.'
          );
          authFlow.moveToRegistrationStep();
        } else {
          ToastNotification(
            'success',
            data.message || 'Login successful! Welcome back.'
          );
          // store userToken into session storage
          if (data?.data?.token && typeof window !== 'undefined') {
            sessionStorage.setItem('userToken', data.data.token);
          }
          refetchUser();
          closeAndReset();
          
          // Handle redirect after successful login
          if (onLoginSuccess) {
            onLoginSuccess();
          }
          if (redirectUrl) {
            router.push(redirectUrl);
          }
        }
      } else {
        console.log(data);
        ToastNotification(
          'error',
          data.message || 'Invalid OTP. Please try again.'
        );
      }
    },
    onError: (error) => {
      console.log(error);
      ToastNotification(
        'error',
        error?.message || 'Failed to verify OTP. Please try again.'
      );
    },
  });

  const resendOtpMutation = useResendOtp({
    onSuccess: (data) => {
      ToastNotification(
        'success',
        `${data.message} @ ${data.data.otp}` ||
          `OTP sent successfully! ${data.data.otp}`
      );
      authFlow.setOtpDigits(authFlow.getDigitsArray());
      resetOtp();
      authFlow.incrementResendKey();
      setTimeout(() => {
        authFlow.inputRefs.current?.[0]?.focus();
      }, 50);
    },
    onError: (error) => {
      ToastNotification(
        'error',
        error?.message || 'Failed to resend OTP. Please try again.'
      );
    },
  });

  const createProfileMutation = useCreateProfile({
    onSuccess: (data) => {
      // Store user token for authentication
      if (data?.data?.token && typeof window !== 'undefined') {
        sessionStorage.setItem('userToken', data.data.token);
      }
      
      // Refetch user data to update context
      refetchUser();

      if (data.data.user.role === 'Doctor') {
        ToastNotification(
          'success',
          data.message || 'Registration completed successfully!'
        );
        authFlow.moveToKycPendingStep();
      } else {
        ToastNotification(
          'success',
          data.message || 'Registration completed successfully!'
        );
        closeAndReset();
        
        // Handle redirect after successful registration
        if (onLoginSuccess) {
          onLoginSuccess();
        }
        if (redirectUrl) {
          router.push(redirectUrl);
        }
      }
    },
    onError: (error) => {
      ToastNotification(
        'error',
        error?.message || 'Registration failed. Please try again.'
      );
    },
  });

  // Form hooks
  const {
    control: phoneControl,
    handleSubmit: handlePhoneSubmit,
    watch: watchPhone,
    reset: resetPhone,
    formState: { errors: phoneErrors, isValid: isPhoneValid },
  } = useForm({
    resolver: zodResolver(otpPhoneSchema),
    defaultValues: {
      countryCode: '91',
      phone: '',
    },
    mode: 'onChange',
  });

  const {
    control: otpControl,
    handleSubmit: handleOtpSubmit,
    reset: resetOtp,
    setValue: setOtpValue,
    formState: { errors: otpErrors, isValid: isOtpValid },
  } = useForm({
    resolver: zodResolver(otpVerificationSchema),
    defaultValues: {
      otp: '',
    },
    mode: 'onChange',
  });

  const {
    control: regControl,
    handleSubmit: handleRegSubmit,
    watch: watchReg,
    reset: resetReg,
    getValues: getRegValues,
    setValue: setRegValue,
    trigger: triggerReg,
    formState: { errors: regErrors },
  } = useForm({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      profilePhoto: undefined,
      role: undefined,
      registrationNumber: '',
      degreeCertificate: undefined,
      registrationCertificate: undefined,
      specialization: [],
    },
    mode: 'onChange',
  });

  const selectedRole = watchReg('role');
  const phoneNumber = watchPhone('phone');

  // Fetch doctor specializations
  const { data: specializations = [], isLoading: isLoadingSpecializations } =
    useDoctorSpecializations({
      enabled:
        isOpen && selectedRole === 'Doctor' && authFlow.registrationStep === 3,
      staleTime: 1 * 60 * 1000,
    });

  const formattedNumber = useMemo(() => {
    if (!phoneNumber) return '';
    const cleaned = phoneNumber.replace(/\D/g, '').slice(0, 10);
    if (cleaned.length <= 5) return cleaned;
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }, [phoneNumber]);

  const closeAndReset = () => {
    authFlow.resetFlow();
    resetPhone();
    resetOtp();
    resetReg();
    filePreviews.resetPreviews();
    setShowProfilePicker(false);
    onClose?.();
    setOpen?.(false);
  };

  useEffect(() => {
    const updateIsMobileView = () => {
      if (typeof window !== 'undefined') {
        setIsMobileView(window.innerWidth < 768);
      }
    };

    updateIsMobileView();
    window.addEventListener('resize', updateIsMobileView);
    return () => window.removeEventListener('resize', updateIsMobileView);
  }, []);

  useEffect(() => {
    if (isOpen) {
      authFlow.resetFlow();
      resetPhone();
      resetOtp();
      resetReg();
      filePreviews.resetPreviews();
      setShowProfilePicker(false);
      setTimeout(() => {
        authFlow.phoneInputRef.current?.focus();
      }, 50);
    } else {
      authFlow.resetFlow();
      setShowProfilePicker(false);
    }
  }, [isOpen]);

  // Handlers
  const handleSendOtp = async (data) => {
    const phoneNumber = `${data.countryCode}${data.phone}`;
    loginMutation.mutate({ phone: phoneNumber });
  };

  const handleVerify = async (data) => {
    const phoneData = watchPhone();
    const phoneNumber = `${phoneData.countryCode}${phoneData.phone}`;
    verifyOtpMutation.mutate({ phone: phoneNumber, otp: data.otp });
  };

  const handleResend = (e) => {
    e.preventDefault();
    if (authFlow.resendTimer > 0 || resendOtpMutation.isPending) return;
    const phoneData = watchPhone();
    const phoneNumber = `${phoneData.countryCode}${phoneData.phone}`;
    resendOtpMutation.mutate({ phone: phoneNumber });
  };

  const handleRegistration = async (data) => {
    const phoneData = watchPhone();
    const phoneNumber = `${phoneData.countryCode}${phoneData.phone}`;

    const profileImageFile = data.profilePhoto?.[0] || null;
    const degreeFile = data.degreeCertificate?.[0] || null;
    const registrationFile = data.registrationCertificate?.[0] || null;

    const profilePayload = {
      profileImageFile,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email || '',
      phone: phoneNumber,
      role: data.role,
      registrationNo: data.registrationNumber || '',
      registrationFile,
      degreeFile,
      specializationUids: data.specialization || [],
    };

    createProfileMutation.mutate(profilePayload);
  };

  const handleProfileUploadClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowProfilePicker(true);
  };

  const triggerProfileFilePicker = (source = 'gallery') => {
    if (!profilePhotoInputRef.current) return;
    if (source === 'camera') {
      profilePhotoInputRef.current.setAttribute('capture', 'environment');
    } else {
      profilePhotoInputRef.current.removeAttribute('capture');
    }
    profilePhotoInputRef.current.click();
  };

  const handleNextRegistrationStep = async () => {
    if (authFlow.registrationStep === 1) {
      const isValid = await triggerReg([
        'firstName',
        'lastName',
        'email',
        'role',
      ]);
      if (isValid) {
        if (selectedRole === 'Doctor') {
          authFlow.nextRegistrationStep();
        } else {
          const formData = getRegValues();
          await handleRegistration(formData);
        }
      }
    } else if (authFlow.registrationStep === 2) {
      const isValid = await triggerReg([
        'registrationNumber',
        'registrationCertificate',
      ]);
      if (isValid) {
        authFlow.nextRegistrationStep();
      }
    }
  };

  const isRegistrationStep1Valid = () => {
    const values = getRegValues();
    if (!values.firstName || !values.lastName || !values.role) return false;
    if (regErrors.firstName || regErrors.lastName || regErrors.role)
      return false;
    if (values.email && regErrors.email) return false;
    return true;
  };

  const isRegistrationStep2Valid = () => {
    const values = getRegValues();
    if (!values.registrationNumber || !values.registrationCertificate)
      return false;
    if (regErrors.registrationNumber || regErrors.registrationCertificate)
      return false;
    return true;
  };

  const isSubmitButtonEnabled = () => {
    const values = getRegValues();
    const isDoctor = values.role === 'Doctor';

    if (!values.firstName || !values.lastName || !values.role) return false;
    if (regErrors.firstName || regErrors.lastName || regErrors.role)
      return false;
    if (values.email && regErrors.email) return false;

    if (isDoctor) {
      if (!values.registrationNumber || !values.registrationCertificate)
        return false;
      if (regErrors.registrationNumber || regErrors.registrationCertificate)
        return false;
    }

    return true;
  };

  const getRegistrationTitle = () => {
    if (authFlow.registrationStep === 1) return 'Complete Your Profile';
    if (authFlow.registrationStep === 2) return 'Complete Your KYC';
    if (authFlow.registrationStep === 3) return 'Select Your Specializations';
    return 'Complete Registration';
  };

  const getRegistrationProgress = () => {
    return Math.round((authFlow.registrationStep / 3) * 100);
  };

  const renderContent = () => {
    switch (authFlow.step) {
      case 1:
        return (
          <PhoneNumberForm
            phoneControl={phoneControl}
            phoneErrors={phoneErrors}
            isPhoneValid={isPhoneValid}
            handlePhoneSubmit={handlePhoneSubmit}
            handleSendOtp={handleSendOtp}
            loginMutation={loginMutation}
            phoneInputRef={authFlow.phoneInputRef}
          />
        );
      case 2:
        return (
          <OtpVerificationForm
            otpControl={otpControl}
            otpErrors={otpErrors}
            isOtpValid={isOtpValid}
            handleOtpSubmit={handleOtpSubmit}
            handleVerify={handleVerify}
            verifyOtpMutation={verifyOtpMutation}
            resendOtpMutation={resendOtpMutation}
            otpDigits={authFlow.otpDigits}
            handleOtpChange={(value, index) =>
              authFlow.handleOtpChange(value, index, setOtpValue)
            }
            handleOtpKeyDown={authFlow.handleOtpKeyDown}
            inputRefs={authFlow.inputRefs}
            formattedNumber={formattedNumber}
            resendTimer={authFlow.resendTimer}
            handleResend={handleResend}
            onEditPhone={() => authFlow.setStep(1)}
            resetOtp={resetOtp}
            phoneInputRef={authFlow.phoneInputRef}
          />
        );
      case 3:
        return (
          <RegistrationContainer
            registrationStep={authFlow.registrationStep}
            selectedRole={selectedRole}
            regControl={regControl}
            regErrors={regErrors}
            profilePhotoPreview={filePreviews.profilePhotoPreview}
            handleProfileUploadClick={handleProfileUploadClick}
            profilePhotoInputRef={profilePhotoInputRef}
            handleFilePreview={filePreviews.handleFilePreview}
            regCertPreview={filePreviews.regCertPreview}
            regCertName={filePreviews.regCertName}
            degreeCertPreview={filePreviews.degreeCertPreview}
            degreeCertName={filePreviews.degreeCertName}
            setRegCertPreview={filePreviews.setRegCertPreview}
            setRegCertName={filePreviews.setRegCertName}
            setDegreeCertPreview={filePreviews.setDegreeCertPreview}
            setDegreeCertName={filePreviews.setDegreeCertName}
            specializations={specializations}
            isLoadingSpecializations={isLoadingSpecializations}
            getRegistrationProgress={getRegistrationProgress}
            handleBackRegistrationStep={authFlow.previousRegistrationStep}
            handleRegSubmit={handleRegSubmit}
            handleRegistration={handleRegistration}
            handleNextRegistrationStep={handleNextRegistrationStep}
            isRegistrationStep1Valid={isRegistrationStep1Valid}
            isRegistrationStep2Valid={isRegistrationStep2Valid}
            isSubmitButtonEnabled={isSubmitButtonEnabled}
            createProfileMutation={createProfileMutation}
            triggerReg={triggerReg}
            getRegValues={getRegValues}
          />
        );
      case 4:
        return <KycPendingView onClose={closeAndReset} />;
      default:
        return null;
    }
  };

  return (
    <>
      <ResponsiveModal
        modal={isOpen}
        setModal={setOpen}
        extraFunction={closeAndReset}
        showCloseButton={authFlow.registrationStep === 1 ? false : true}
        classes={{
          modalClass: 'theme-modal view-modal modal-md otp-login-modal',
          offcanvasClass: 'otp-login-offcanvas',
          modalHeaderClass: 'justify-content-between',
          title:
            authFlow.step === 1
              ? 'Login'
              : authFlow.step === 2
                ? 'Verify OTP'
                : authFlow.step === 4
                  ? 'KYC Under Process'
                  : getRegistrationTitle(),
        }}
      >
        <div className="otp-login-wrapper">
          {renderContent()}

          {/* Bottom Section with Logo and App Download Buttons */}
          {authFlow.step !== 3 && authFlow.step !== 4 && (
            <div className="otp-login-bottom-section">
              <div className="otp-logo text-center mb-2">
                <Image
                  src={BrandLogo}
                  alt="Brand logo"
                  width={120}
                  height={48}
                  className="img-fluid"
                  priority
                />
              </div>

              <h5 className="otp-app-title text-center mb-1">
                Dhootapapeshwar app is LIVE!
              </h5>
              <p className="otp-app-text text-center mb-2">
                Download & Signup, to get Rs. 100 worth of SDL coins.
              </p>

              {(themeOption?.footer?.app_store_url ||
                themeOption?.footer?.play_store_url) && (
                <div className="otp-app-buttons">
                  {themeOption?.footer?.play_store_url && (
                    <Link
                      href={themeOption.footer.play_store_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="otp-app-button"
                    >
                      <Image
                        src={playstoreImage}
                        alt="Get it on Google Play"
                        height={100}
                        width={100}
                        className="img-fluid"
                      />
                    </Link>
                  )}
                  {themeOption?.footer?.app_store_url && (
                    <Link
                      href={themeOption.footer.app_store_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="otp-app-button"
                    >
                      <Image
                        src={appstoreImage}
                        alt="Download on the App Store"
                        height={100}
                        width={100}
                        className="img-fluid"
                      />
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </ResponsiveModal>

      <CameraModal
        isOpen={cameraCapture.showCameraModal}
        onClose={() => cameraCapture.setShowCameraModal(false)}
        cameraError={cameraCapture.cameraError}
        videoRef={cameraCapture.videoRef}
        onCapture={() => {
          cameraCapture.capturePhoto((fileList) => {
            setRegValue('profilePhoto', fileList, { shouldValidate: true });
            filePreviews.handleFilePreview(fileList, 'profile');
          });
        }}
      />

      <ProfilePickerModal
        isOpen={showProfilePicker}
        onClose={() => setShowProfilePicker(false)}
        isMobileView={isMobileView}
        onTakePhoto={() => {
          const supportsDesktopCamera =
            typeof navigator !== 'undefined' &&
            !!navigator.mediaDevices?.getUserMedia;
          if (!isMobileView && supportsDesktopCamera) {
            setShowProfilePicker(false);
            cameraCapture.setShowCameraModal(true);
          } else {
            setShowProfilePicker(false);
            triggerProfileFilePicker('camera');
          }
        }}
        onChooseFromGallery={() => {
          setShowProfilePicker(false);
          triggerProfileFilePicker('gallery');
        }}
      />
    </>
  );
};

export default OtpLoginModal;
