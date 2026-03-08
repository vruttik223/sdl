import React from 'react';
import { Controller } from 'react-hook-form';
import { Form, FormGroup, Input, Label } from 'reactstrap';
import { RiEdit2Line } from 'react-icons/ri';
import Btn from '@/elements/buttons/Btn';

const OtpVerificationForm = ({
  otpControl,
  otpErrors,
  isOtpValid,
  handleOtpSubmit,
  handleVerify,
  verifyOtpMutation,
  resendOtpMutation,
  otpDigits,
  handleOtpChange,
  handleOtpKeyDown,
  inputRefs,
  formattedNumber,
  resendTimer,
  handleResend,
  onEditPhone,
  resetOtp,
  phoneInputRef,
}) => {
  return (
    <div className="otp-login-top-section">
      <Form className="otp-step" onSubmit={handleOtpSubmit(handleVerify)}>
        <div className="otp-welcome-card">
          <div className="d-flex justify-content-center align-items-center gap-2 otp-sent-text">
            <span className="text-content">
              OTP sent to +91 {formattedNumber}
            </span>
            <button
              type="button"
              className="icon-btn otp-edit-btn"
              onClick={() => {
                onEditPhone();
                resetOtp();
                setTimeout(() => {
                  phoneInputRef.current?.focus();
                }, 50);
              }}
              disabled={
                verifyOtpMutation.isPending || resendOtpMutation.isPending
              }
              style={{
                opacity:
                  verifyOtpMutation.isPending || resendOtpMutation.isPending
                    ? 0.5
                    : 1,
                cursor:
                  verifyOtpMutation.isPending || resendOtpMutation.isPending
                    ? 'not-allowed'
                    : 'pointer',
              }}
              aria-label="Edit phone number"
            >
              <RiEdit2Line />
            </button>
          </div>

          <FormGroup className="otp-form-group mb-2">
            <Label className="form-label mb-2">
              Enter the OTP <span className="text-danger">*</span>
            </Label>
            <div className="otp-inputs mb-2">
              {otpDigits.map((digit, index) => (
                <Input
                  key={index}
                  type="tel"
                  className="otp-input input-common"
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  innerRef={(el) => (inputRefs.current[index] = el)}
                  aria-label={`OTP digit ${index + 1}`}
                  disabled={verifyOtpMutation.isPending}
                />
              ))}
            </div>
            {otpErrors.otp && (
              <small className="message-error mt-2 d-block">
                {otpErrors.otp.message}
              </small>
            )}
            <Controller
              name="otp"
              control={otpControl}
              render={({ field }) => <input type="hidden" {...field} />}
            />
          </FormGroup>

          <div className="d-flex align-items-center gap-2 mb-2">
            <span className="text-content">Didn&apos;t receive OTP ?</span>

            {resendTimer > 0 ? (
              <span className="text-content">Resend in {resendTimer}s</span>
            ) : (
              <button
                type="button"
                className="link-btn"
                onClick={handleResend}
                disabled={resendOtpMutation.isPending}
                style={{
                  opacity: resendOtpMutation.isPending ? 0.5 : 1,
                  cursor: resendOtpMutation.isPending
                    ? 'not-allowed'
                    : 'pointer',
                }}
              >
                {resendOtpMutation.isPending ? 'Sending...' : 'Resend OTP'}
              </button>
            )}
          </div>

          <Btn
            type="submit"
            size="sm"
            color="primary"
            className="w-100"
            disabled={!isOtpValid || verifyOtpMutation.isPending}
            style={{
              opacity: !isOtpValid || verifyOtpMutation.isPending ? 0.7 : 1,
              cursor:
                !isOtpValid || verifyOtpMutation.isPending
                  ? 'not-allowed'
                  : 'pointer',
            }}
          >
            {verifyOtpMutation.isPending ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Verifying...
              </>
            ) : (
              'Verify & Submit'
            )}
          </Btn>
        </div>
      </Form>
    </div>
  );
};

export default OtpVerificationForm;
