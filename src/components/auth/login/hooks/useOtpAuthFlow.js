import { useState, useRef, useEffect } from 'react';

const OTP_LENGTH = 6;

const getDigitsArray = () => Array(OTP_LENGTH).fill('');

export const useOtpAuthFlow = () => {
  const [step, setStep] = useState(1);
  const [registrationStep, setRegistrationStep] = useState(1);
  const [otpDigits, setOtpDigits] = useState(getDigitsArray());
  const [resendTimer, setResendTimer] = useState(30);
  const [resendKey, setResendKey] = useState(0);
  const inputRefs = useRef([]);
  const phoneInputRef = useRef(null);

  // Handle 30s resend OTP timer whenever we are on step 2
  useEffect(() => {
    if (step !== 2) {
      setResendTimer(30);
      return;
    }

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
  }, [step, resendKey]);

  const resetFlow = () => {
    setStep(1);
    setRegistrationStep(1);
    setOtpDigits(getDigitsArray());
    setResendTimer(30);
  };

  const moveToOtpStep = () => {
    setStep(2);
    setOtpDigits(getDigitsArray());
    setResendKey((prev) => prev + 1);
  };

  const moveToRegistrationStep = () => {
    setStep(3);
    setRegistrationStep(1);
  };

  const moveToKycPendingStep = () => {
    setStep(4);
  };

  const handleOtpChange = (value, index, setOtpValue) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = digit;
    const otpString = newOtpDigits.join('');

    setOtpDigits(newOtpDigits);
    setOtpValue('otp', otpString, { shouldValidate: true });

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current?.[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current?.[index - 1]?.focus();
    }
  };

  const incrementResendKey = () => {
    setResendKey((prev) => prev + 1);
  };

  const nextRegistrationStep = () => {
    setRegistrationStep((prev) => prev + 1);
  };

  const previousRegistrationStep = () => {
    setRegistrationStep((prev) => Math.max(1, prev - 1));
  };

  return {
    step,
    registrationStep,
    otpDigits,
    resendTimer,
    inputRefs,
    phoneInputRef,
    setStep,
    resetFlow,
    moveToOtpStep,
    moveToRegistrationStep,
    moveToKycPendingStep,
    handleOtpChange,
    handleOtpKeyDown,
    incrementResendKey,
    nextRegistrationStep,
    previousRegistrationStep,
    setOtpDigits,
    getDigitsArray,
  };
};
