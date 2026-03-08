import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Col,
  Row,
  Form,
  FormGroup,
  Label,
  Input,
  InputGroup,
  FormFeedback,
  Spinner,
} from 'reactstrap';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  RiAddLine,
  RiDeleteBinLine,
  RiSendPlaneFill,
  RiEdit2Line,
} from 'react-icons/ri';
import { z } from 'zod';
import Btn from '@/elements/buttons/Btn';
import { ToastNotification } from '@/utils/customFunctions/ToastNotification';
import { AllCountryCode } from '@/data/AllCountryCode';
import dashProfileImage from '../../../../public/assets/images/inner-page/dashboard-profile.png';
import { useUser } from '@/utils/hooks/useUser';
import {
  useUpdateProfile,
  useCheckProfilePhone,
  useVerifyProfilePhone,
} from '@/utils/hooks/useAuth';
import Loader from '@/layout/loader';

const OTP_LENGTH = 6;
const getDigitsArray = () => Array(OTP_LENGTH).fill('');

const profileEditSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(20, 'First name cannot exceed 20 characters')
    .regex(/^[a-zA-Z]+$/, 'First name can contain only letters (no spaces)'),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(20, 'Last name cannot exceed 20 characters')
    .regex(/^[a-zA-Z]+$/, 'Last name can contain only letters (no spaces)'),
  email: z
    .string()
    .optional()
    .refine((val) => !val || /[^\s@]+@[^\s@]+\.[^\s@]+/.test(val), {
      message: 'Invalid email address',
    }),
  gender: z.enum(['male', 'female', 'other']),
  phone: z.string().regex(/^[0-9]{10}$/, 'Phone must be 10 digits'),
  profilePhoto: z.any().optional(),
});

const ProfileInformation = () => {
  const {
    userData,
    setUserData,
    isUserLoading,
    isAuthenticated,
    // logout,
    refetchUser,
  } = useUser();
  const { mutate: updateProfileMutation, isPending: isUpdatingProfile } =
    useUpdateProfile({
      onSuccess: (data) => {
        if (data.success) {
          ToastNotification(
            'success',
            data.message || 'Profile updated successfully'
          );
          setIsEditing(false);
          resetOtpFlow();
        }
      },
      onError: (error) => {
        console.error('Error updating profile:', error);
        ToastNotification(
          'error',
          error.message || 'Failed to update profile. Please try again.'
        );
      },
    });

  const {
    mutate: checkProfilePhoneMutation,
    isPending: isCheckingProfilePhone,
  } = useCheckProfilePhone({
    onSuccess: (data) => {
      if (data.success) {
        ToastNotification('success', `${data.message} @ ${data.data.otp}`);
        setOtpSent(true);
        setOtpVerified(false);
        setOtpDigits(getDigitsArray());
        setResendKey((prev) => prev + 1);
        setTimeout(() => {
          inputRefs.current?.[0]?.focus();
        }, 50);
      } else {
        ToastNotification('error', data.message || 'Failed to send OTP');
      }
    },
    onError: (error) => {
      console.error('Error sending OTP:', error);
      ToastNotification(
        'error',
        error.message || 'Failed to send OTP. Please try again.'
      );
    },
  });

  const {
    mutate: verifyProfilePhoneMutation,
    isPending: isVerifyingProfilePhone,
  } = useVerifyProfilePhone({
    onSuccess: (data) => {
      if (data.success) {
        setOtpVerified(true);
        setOtpSent(false);
        ToastNotification(
          'success',
          data.message || 'OTP verified successfully'
        );
      } else {
        ToastNotification(
          'error',
          data.message || 'Invalid OTP. Please try again.'
        );
        setOtpDigits(getDigitsArray());
      }
    },
    onError: (error) => {
      console.error('Error verifying OTP:', error);
      ToastNotification(
        'error',
        error.message || 'Failed to verify OTP. Please try again.'
      );
      setOtpDigits(getDigitsArray());
    },
  });

  // Debug logging
  useEffect(() => {
    // console.log('=== ProfileInformation Debug ===');
    console.log('ProfileInformation - userData:', userData);
    // console.log('ProfileInformation - isUserLoading:', isUserLoading);
    // console.log('ProfileInformation - isAuthenticated:', isAuthenticated);
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('userToken');
      console.log('ProfileInformation - sessionToken exists:', !!token);
      console.log(
        'ProfileInformation - sessionToken value:',
        token?.substring(0, 20) + '...'
      );
    }
    // console.log('=================================');
  }, [userData, isUserLoading, isAuthenticated]);

  // Manual refetch for debugging
  const handleDebugRefetch = () => {
    console.log('Manual refetch triggered');
    refetchUser?.();
  };

  const [isEditing, setIsEditing] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [otpDigits, setOtpDigits] = useState(getDigitsArray());
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(true);
  const [phoneChanged, setPhoneChanged] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [resendKey, setResendKey] = useState(0);
  const inputRefs = useRef([]);

  // Initialize profile data from userData
  useEffect(() => {
    if (userData && !profileData) {
      const initialData = {
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        countryCode: '91',
        gender: 'male', // Default as not in userData structure
        photo: userData.profileImage,
      };
      setProfileData(initialData);
      setProfilePhotoPreview(initialData.photo);
    }
  }, [userData, profileData]);

  const {
    control: profileControl,
    handleSubmit: submitProfileForm,
    formState: { errors: profileErrors, isDirty },
    reset: resetProfile,
    watch: watchProfile,
  } = useForm({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      firstName: profileData?.firstName || '',
      lastName: profileData?.lastName || '',
      email: profileData?.email || '',
      gender: profileData?.gender || 'male',
      phone: profileData?.phone || '',
      profilePhoto: undefined,
    },
    mode: 'onChange',
  });

  // Reset form when profileData is loaded
  useEffect(() => {
    if (profileData) {
      resetProfile({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        gender: profileData.gender,
        phone: profileData.phone,
        profilePhoto: undefined,
      });
    }
  }, [
    profileData?.firstName,
    profileData?.lastName,
    profileData?.email,
    profileData?.phone,
    profileData?.gender,
  ]);

  const currentPhone = watchProfile('phone');

  // Format phone number for display
  const formattedNumber = useMemo(() => {
    if (!currentPhone) return '';
    const cleaned = currentPhone.replace(/\D/g, '').slice(0, 10);
    if (cleaned.length <= 5) return cleaned;
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }, [currentPhone]);

  useEffect(() => {
    if (otpSent && !otpVerified) {
      setResendTimer(30);
      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [otpSent, otpVerified, resendKey]);

  const resetOtpFlow = () => {
    setOtpSent(false);
    setOtpVerified(false);
    setOtpDigits(getDigitsArray());
    setResendTimer(30);
  };

  const handleFilePreview = (fileList) => {
    if (fileList && fileList[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhotoPreview(reader.result);
      };
      reader.readAsDataURL(fileList[0]);
    }
  };

  const handleSave = async (values) => {
    // If phone changed and not verified, block submission
    if (phoneChanged && !otpVerified) {
      ToastNotification('error', 'Please verify the new phone number with OTP');
      return;
    }

    try {
      // Prepare the profile data for API submission
      const profilePayload = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email || '',
        phone: values.phone,
        gender: values.gender,
      };

      // Add profile photo file if a new one was selected
      if (values.profilePhoto && values.profilePhoto[0]) {
        profilePayload.profilePhotoFile = values.profilePhoto[0];
      }

      // Call the API to update profile
      updateProfileMutation(profilePayload);

      // Update local state for immediate UI feedback
      const updated = {
        ...profileData,
        ...values,
      };
      setProfileData(updated);

      // Reset form to new values
      resetProfile({
        firstName: updated.firstName,
        lastName: updated.lastName,
        email: updated.email,
        gender: updated.gender,
        phone: updated.phone,
        profilePhoto: undefined,
      });
      setOtpSent(false);
      setOtpDigits(getDigitsArray());
      setOtpVerified(true);
      setPhoneChanged(false);
      setResendTimer(30);
    } catch (error) {
      console.error('Error saving profile:', error);
      ToastNotification('error', 'Failed to save profile. Please try again.');
    }
  };
  const handleResetForm = () => {
    resetProfile({
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      email: profileData.email,
      gender: profileData.gender,
      phone: profileData.phone,
      profilePhoto: undefined,
    });
    setProfilePhotoPreview(profileData.photo);
    setOtpSent(false);
    setOtpVerified(true);
    setPhoneChanged(false);
    setOtpDigits(getDigitsArray());
    setResendKey((prev) => prev + 1);
    setResendTimer(30);
    setIsEditing(false);
  };

  const handleToggleEditing = () => {
    if (isEditing) {
      handleResetForm();
      return;
    }
    setIsEditing(true);
    setOtpSent(false);
    setOtpDigits(getDigitsArray());
    setOtpVerified(true);
    setPhoneChanged(false);
  };

  const handleSendOtp = async () => {
    if (isCheckingProfilePhone) return;
    const phoneNumber = watchProfile('phone');
    if (!phoneNumber || phoneNumber.length !== 10) {
      ToastNotification('error', 'Please enter a valid 10-digit phone number');
      return;
    }
    checkProfilePhoneMutation({ phone: phoneNumber });
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0 || isCheckingProfilePhone) return;
    const phoneNumber = watchProfile('phone');
    checkProfilePhoneMutation({ phone: phoneNumber });
  };

  const handleEditPhone = () => {
    setOtpSent(false);
    setOtpVerified(false);
    setOtpDigits(getDigitsArray());
  };

  const verifyOtp = (otpArray = otpDigits) => {
    const enteredOtp = otpArray.join('');
    if (enteredOtp.length !== OTP_LENGTH) return;

    const phoneNumber = watchProfile('phone');
    verifyProfilePhoneMutation({ phone: phoneNumber, otp: enteredOtp });
  };

  // Auto-verify when all 6 digits are filled
  const handleOtpChange = (value, index) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = digit;
    setOtpDigits(newOtpDigits);

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current?.[index + 1]?.focus();
    }

    if (
      newOtpDigits.every((d) => d !== '') &&
      newOtpDigits.join('').length === OTP_LENGTH
    ) {
      setTimeout(() => verifyOtp(newOtpDigits), 100);
    }
  };

  // Show loading state
  if (isUserLoading) {
    return (
      <div className="profile-wireframe-card dashboard-bg-box">
        <div className="text-center py-5">
          <Spinner color="primary" />
          <p className="mt-3 text-content">Loading profile...</p>
          {/* <button 
            onClick={handleDebugRefetch}
            className="btn btn-sm btn-outline-primary mt-3"
          >
            Debug: Refetch User
          </button> */}
        </div>
      </div>
    );
  }

  // Show message if no user data and not loading
  if (!isUserLoading && !userData) {
    return (
      <div className="profile-wireframe-card dashboard-bg-box">
        <div className="text-center py-5">
          <p className="text-content">
            Unable to load profile. Please try logging in again.
          </p>
          {/* <button 
            onClick={handleDebugRefetch}
            className="btn btn-sm btn-outline-primary mt-3"
          >
            Debug: Retry Fetch
          </button> */}
        </div>
      </div>
    );
  }

  // Show loading if profileData is still being initialized
  if (!profileData) {
    return (
      <div className="profile-wireframe-card dashboard-bg-box">
        <div className="text-center py-5">
          {/* <Spinner color="primary" /> */}
          {/* <p className="mt-3 text-content">Initializing profile...</p> */}
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="profile-wireframe-card dashboard-bg-box">
      <div className="wireframe-heading text-center">
        <div className="d-flex justify-content-end w-100 mb-2">
          <Btn
            type="button"
            className="btn btn-sm d-inline-flex align-items-center gap-2"
            onClick={handleToggleEditing}
            aria-label={isEditing ? 'Stop editing profile' : 'Edit profile'}
          >
            {isEditing ? (
              'View'
            ) : (
              <>
                <RiEdit2Line size={16} /> Edit
              </>
            )}
          </Btn>
        </div>
        <Controller
          name="profilePhoto"
          control={profileControl}
          render={({ field: { onChange, onBlur, name, ref } }) => (
            <div className="avatar-upload">
              <input
                name={name}
                ref={ref}
                onBlur={onBlur}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const files = e.target.files;
                  onChange(files);
                  handleFilePreview(files);
                }}
                className="avatar-input"
                id="profilePhotoInput"
                disabled={!isEditing}
              />
              <label htmlFor="profilePhotoInput" className="avatar-label">
                <span className="avatar-ring">
                  <img
                    src={profilePhotoPreview || dashProfileImage.src}
                    alt="Profile preview"
                    className="avatar-image"
                  />
                  {isEditing && (
                    <span className="avatar-add">
                      <RiAddLine size={18} />
                    </span>
                  )}
                </span>
              </label>
              {/* {profilePhotoPreview && profilePhotoPreview !== dashProfileImage.src && (
                <button
                  type="button"
                  className="avatar-delete"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onChange(undefined);
                    setProfilePhotoPreview(dashProfileImage.src);
                    const fileInput = document.getElementById('profilePhotoInput');
                    if (fileInput) fileInput.value = '';
                  }}
                >
                  <RiDeleteBinLine size={16} />
                </button>
              )} */}
            </div>
          )}
        />
        <div className="mt-3">
          {/* <h4 className="mb-1">Profile Information</h4> */}
          {/* <p className="text-content mb-0">
            Keep your account details up to date and verify phone via OTP.
          </p> */}
        </div>
      </div>

      <Form
        onSubmit={submitProfileForm(handleSave)}
        className="profile-wireframe-form"
      >
        <Row className="g-3">
          <Col md={6}>
            <FormGroup className="wireframe-field">
              <Label htmlFor="firstName" className="form-label mb-1">
                First Name {isEditing && <span className="text-danger">*</span>}
              </Label>
              <Controller
                name="firstName"
                control={profileControl}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    id="firstName"
                    className='input-common'
                    placeholder="First name"
                    maxLength={20}
                    invalid={!!profileErrors.firstName}
                    disabled={!isEditing}
                    onChange={(e) =>
                      field.onChange(e.target.value.replace(/[^a-zA-Z]/g, ''))
                    }
                  />
                )}
              />
              {profileErrors.firstName && (
                <FormFeedback className='message-error'>{profileErrors.firstName.message}</FormFeedback>
              )}
            </FormGroup>
          </Col>

          <Col md={6}>
            <FormGroup className="wireframe-field">
              <Label htmlFor="lastName" className="form-label mb-1">
                Last Name {isEditing && <span className="text-danger">*</span>}
              </Label>
              <Controller
                name="lastName"
                control={profileControl}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    id="lastName"
                    className='input-common'
                    placeholder="Last name"
                    maxLength={20}
                    invalid={!!profileErrors.lastName}
                    disabled={!isEditing}
                    onChange={(e) =>
                      field.onChange(e.target.value.replace(/[^a-zA-Z]/g, ''))
                    }
                  />
                )}
              />
              {profileErrors.lastName && (
                <FormFeedback className='message-error'>{profileErrors.lastName.message}</FormFeedback>
              )}
            </FormGroup>
          </Col>

          <Col md={6}>
            <FormGroup className="wireframe-field">
              <Label htmlFor="email" className="form-label mb-1">
                Email
              </Label>
              <Controller
                name="email"
                control={profileControl}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="email"
                    id="email"
                    className='input-common'
                    placeholder="Email address"
                    invalid={!!profileErrors.email}
                    disabled={!isEditing}
                  />
                )}
              />
              {profileErrors.email && (
                <FormFeedback className='message-error'>{profileErrors.email.message}</FormFeedback>
              )}
            </FormGroup>
          </Col>

          <Col md={6}>
            <FormGroup className="wireframe-field">
              <Label htmlFor="gender" className="form-label mb-1">
                Gender
              </Label>
              <Controller
                name="gender"
                control={profileControl}
                render={({ field }) => (
                  <Input
                    type="select"
                    id="gender"
                    className='input-common'
                    {...field}
                    disabled={!isEditing}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Input>
                )}
              />
            </FormGroup>
          </Col>

          <Col md={12}>
            <FormGroup className="wireframe-field profile-phone-group">
              <Label htmlFor="phone" className="form-label mb-1">
                Mobile Number{' '}
                {isEditing && <span className="text-danger">*</span>}
              </Label>
              <div className="phone-input-row">
                <InputGroup className="phone-input-group">
                  <Input
                    type="select"
                    className="country-code-select input-common"
                    // value={STATIC_DEFAULTS?.countryCode || '91'}
                    value={'91'}
                    disabled
                  >
                    {AllCountryCode.map((code) => (
                      <option key={code.id} value={code.id}>
                        {code.name}
                      </option>
                    ))}
                  </Input>
                  <Controller
                    name="phone"
                    control={profileControl}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="phone"
                        type="tel"
                        placeholder="Enter phone number"
                        inputMode="numeric"
                        className='input-common'
                        pattern="[0-9]*"
                        maxLength={10}
                        disabled={!isEditing || (otpSent && !otpVerified)}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          field.onChange(val);
                          // Mark phone as changed if different from saved
                          if (val !== profileData.phone) {
                            setPhoneChanged(true);
                            setOtpVerified(false);
                          } else {
                            setPhoneChanged(false);
                            setOtpVerified(true);
                          }
                          setOtpSent(false);
                          setOtpDigits(getDigitsArray());
                        }}
                        invalid={!!profileErrors.phone}
                      />
                    )}
                  />
                  {isEditing && phoneChanged && (
                    <Btn
                      type="button"
                      color="primary"
                      className="send-otp-btn btn-sm input-common"
                      onClick={handleSendOtp}
                      disabled={
                        isCheckingProfilePhone ||
                        (otpSent && !otpVerified) ||
                        !currentPhone ||
                        currentPhone.length !== 10
                      }
                      // title="Send OTP"
                    >
                      {isCheckingProfilePhone ? (
                        <Spinner size="sm" />
                      ) : (
                        <>
                          Send OTP <RiSendPlaneFill size={18} />
                        </>
                      )}
                    </Btn>
                  )}
                </InputGroup>
              </div>
              {profileErrors.phone && (
                <FormFeedback className="d-block message-error">
                  {profileErrors.phone.message}
                </FormFeedback>
              )}
              {/* {phoneChanged && !otpVerified && !otpSent && (
                <small className="text-warning d-block mt-1">profileData?.countryCode || '91'
                  Phone number changed. OTP verification required.
                </small>
              )} */}
            </FormGroup>
          </Col>
        </Row>

        {otpSent && !otpVerified && isEditing && (
          <div className="otp-verification-section mt-3">
            <div className="otp-header">
              <div className="otp-sent-info">
                <span className="text-content">
                  OTP sent to +91 {formattedNumber}
                </span>
                <button
                  type="button"
                  className="edit-phone-btn"
                  onClick={handleEditPhone}
                  title="Edit phone number"
                >
                  <RiEdit2Line size={16} />
                </button>
              </div>
            </div>

            <div className="otp-inputs-container">
              {otpDigits.map((digit, index) => (
                <Input
                  key={index}
                  type="tel"
                  className="otp-input-box input-common"
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  onKeyDown={(e) => {
                    if (
                      e.key === 'Backspace' &&
                      !otpDigits[index] &&
                      index > 0
                    ) {
                      inputRefs.current?.[index - 1]?.focus();
                    }
                  }}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  innerRef={(el) => (inputRefs.current[index] = el)}
                  aria-label={`OTP digit ${index + 1}`}
                  disabled={isVerifyingProfilePhone}
                />
              ))}
            </div>

            <div className="otp-footer">
              {resendTimer > 0 ? (
                <span className="resend-timer">
                  Resend OTP in {resendTimer}s
                </span>
              ) : (
                <button
                  type="button"
                  className="resend-otp-link"
                  onClick={handleResendOtp}
                  disabled={isCheckingProfilePhone}
                >
                  {isCheckingProfilePhone ? (
                    <Spinner size="sm" />
                  ) : (
                    'Resend OTP'
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {isEditing &&
          (isDirty || profilePhotoPreview !== profileData.photo) && (
            <div className="d-flex align-items-center gap-2 mt-3 flex-wrap w-100 justify-content-between">
              <Btn
                type="submit"
                size="sm"
                color="primary"
                className="btn-sm px-4 profile-submit-btn"
                disabled={isUpdatingProfile}
              >
                {isUpdatingProfile ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Updating...
                  </>
                ) : (
                  'Save'
                )}
              </Btn>
              {/* <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={handleResetForm}
            >
              Reset
            </button> */}
            </div>
          )}
      </Form>
    </div>
  );
};

export default ProfileInformation;
