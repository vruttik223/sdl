import React from 'react';
import { Controller } from 'react-hook-form';
import {
  Col,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Row,
  UncontrolledTooltip,
} from 'reactstrap';
import { RiArrowLeftLine, RiInformationLine, RiAddLine, RiDeleteBinLine } from 'react-icons/ri';

const RegistrationDoctorDetailsForm = ({
  regControl,
  regErrors,
  regCertPreview,
  regCertName,
  degreeCertPreview,
  degreeCertName,
  handleFilePreview,
  setRegCertPreview,
  setRegCertName,
  setDegreeCertPreview,
  setDegreeCertName,
  onBack,
  getRegistrationProgress,
}) => {
  return (
    <>
      <div className="mb-3">
        <button
          type="button"
          className="btn p-0 text-decoration-none d-flex align-items-center"
          onClick={onBack}
        >
          <RiArrowLeftLine className="me-1" /> Back
        </button>
      </div>

      {/* Progress Bar */}
      <div className="registration-progress-container">
        <div className="registration-progress-bar">
          <div
            className="registration-progress-fill shimmer-effect"
            style={{ width: `${getRegistrationProgress()}%` }}
          ></div>
          <span className="registration-progress-text">
            {getRegistrationProgress()}%
          </span>
        </div>
      </div>

      <Row>
        <Col md={12}>
          <FormGroup className="otp-form-group">
            <Label
              for="registrationNumber"
              className="form-label mb-1 d-flex align-items-center gap-1"
            >
              Registration Number <span className="text-danger">*</span>
              <span
                id="registrationNumberTooltip"
                className="d-inline-flex align-items-center"
                style={{ cursor: 'help' }}
              >
                <RiInformationLine size={16} className="text-muted" />
              </span>
            </Label>
            <UncontrolledTooltip
              placement="top"
              target="registrationNumberTooltip"
              style={{ fontSize: 12 }}
            >
              Registration number is required for doctor verification
            </UncontrolledTooltip>
            <Controller
              name="registrationNumber"
              control={regControl}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  id="registrationNumber"
                  className='input-common'
                  placeholder="Enter registration number"
                  invalid={!!regErrors.registrationNumber}
                />
              )}
            />
            {regErrors.registrationNumber && (
              <FormFeedback className='message-error'>
                {regErrors.registrationNumber.message}
              </FormFeedback>
            )}
          </FormGroup>
        </Col>

        <Col md={12}>
          <div className="d-flex align-items-center justify-content-between mb-2">
            <h6 className="mb-0 form-label d-flex align-items-center gap-1">
              Attach Documents
              <span
                id="attachDocumentsTooltip"
                className="d-inline-flex align-items-center"
                style={{ cursor: 'help' }}
              >
                <RiInformationLine size={16} className="text-muted" />
              </span>
            </h6>
            <UncontrolledTooltip
              placement="top"
              target="attachDocumentsTooltip"
              style={{ fontSize: 12 }}
            >
              Document required for doctor verification
            </UncontrolledTooltip>
          </div>
          <Row className="g-3">
            <Col className="col-6">
              <FormGroup className="otp-form-group">
                <div className="d-flex flex-column align-items-center">
                  <Controller
                    name="registrationCertificate"
                    control={regControl}
                    render={({ field: { onChange, value, ...field } }) => (
                      <div className="profile-photo-upload certificate-upload">
                        <input
                          {...field}
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => {
                            const files = e.target.files;
                            onChange(files);
                            handleFilePreview(files, 'reg');
                            setRegCertName(files?.[0]?.name || '');
                          }}
                          className="profile-photo-input"
                          id="regCertInput"
                        />
                        <label
                          htmlFor="regCertInput"
                          className="profile-photo-label"
                        >
                          {regCertPreview ? (
                            <div className="profile-photo-preview">
                              {regCertPreview.startsWith('data:image') ? (
                                <img
                                  src={regCertPreview}
                                  alt="Registration certificate preview"
                                  className="profile-photo-img"
                                />
                              ) : (
                                <div className="profile-photo-pdf">
                                  <svg
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                                      stroke="#9CA3AF"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M14 2V8H20"
                                      stroke="#9CA3AF"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M16 13H8"
                                      stroke="#9CA3AF"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M16 17H8"
                                      stroke="#9CA3AF"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M10 9H9H8"
                                      stroke="#9CA3AF"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                  <span>PDF</span>
                                </div>
                              )}
                              <button
                                type="button"
                                className="profile-photo-delete"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  onChange(undefined);
                                  setRegCertPreview(null);
                                  setRegCertName('');
                                  const fileInput =
                                    document.getElementById('regCertInput');
                                  if (fileInput) fileInput.value = '';
                                }}
                              >
                                <RiDeleteBinLine size={16} />
                              </button>
                            </div>
                          ) : (
                            <div className="profile-photo-placeholder">
                              <svg
                                width="48"
                                height="48"
                                viewBox="0 0 48 48"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M14 4H8C6.89543 4 6 4.89543 6 6V42C6 43.1046 6.89543 44 8 44H40C41.1046 44 42 43.1046 42 42V16L28 4H14Z"
                                  stroke="#9CA3AF"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M28 4V16H42"
                                  stroke="#9CA3AF"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M32 24H16"
                                  stroke="#9CA3AF"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M32 30H16"
                                  stroke="#9CA3AF"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M20 12H18H16"
                                  stroke="#9CA3AF"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                          )}
                          <div className="profile-photo-add-icon">
                            <RiAddLine size={20} />
                          </div>
                        </label>
                      </div>
                    )}
                  />
                  <span className="profile-photo-text mt-2">
                    Registration Certificate{' '}
                    <span className="text-danger">*</span>
                  </span>
                  {regErrors.registrationCertificate && (
                    <FormFeedback className="message-error d-block mt-1">
                      {regErrors.registrationCertificate.message}
                    </FormFeedback>
                  )}
                  <small
                    className="text-muted mt-1"
                    style={{ whiteSpace: 'normal', wordBreak: 'break-all' }}
                  >
                    {regCertName || 'Upload image or PDF'}
                  </small>
                </div>
              </FormGroup>
            </Col>

            <Col className="col-6">
              <FormGroup className="otp-form-group">
                <div className="d-flex flex-column align-items-center">
                  <Controller
                    name="degreeCertificate"
                    control={regControl}
                    render={({ field: { onChange, value, ...field } }) => (
                      <div className="profile-photo-upload certificate-upload">
                        <input
                          {...field}
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => {
                            const files = e.target.files;
                            onChange(files);
                            handleFilePreview(files, 'degree');
                            setDegreeCertName(files?.[0]?.name || '');
                          }}
                          className="profile-photo-input"
                          id="degreeCertInput"
                        />
                        <label
                          htmlFor="degreeCertInput"
                          className="profile-photo-label"
                        >
                          {degreeCertPreview ? (
                            <div className="profile-photo-preview">
                              {degreeCertPreview.startsWith('data:image') ? (
                                <img
                                  src={degreeCertPreview}
                                  alt="Degree certificate preview"
                                  className="profile-photo-img"
                                />
                              ) : (
                                <div className="profile-photo-pdf">
                                  <svg
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                                      stroke="#9CA3AF"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M14 2V8H20"
                                      stroke="#9CA3AF"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M16 13H8"
                                      stroke="#9CA3AF"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M16 17H8"
                                      stroke="#9CA3AF"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M10 9H9H8"
                                      stroke="#9CA3AF"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                  <span>PDF</span>
                                </div>
                              )}
                              <button
                                type="button"
                                className="profile-photo-delete"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  onChange(undefined);
                                  setDegreeCertPreview(null);
                                  setDegreeCertName('');
                                  const fileInput =
                                    document.getElementById('degreeCertInput');
                                  if (fileInput) fileInput.value = '';
                                }}
                              >
                                <RiDeleteBinLine size={16} />
                              </button>
                            </div>
                          ) : (
                            <div className="profile-photo-placeholder">
                              <svg
                                width="48"
                                height="48"
                                viewBox="0 0 48 48"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M14 4H8C6.89543 4 6 4.89543 6 6V42C6 43.1046 6.89543 44 8 44H40C41.1046 44 42 43.1046 42 42V16L28 4H14Z"
                                  stroke="#9CA3AF"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M28 4V16H42"
                                  stroke="#9CA3AF"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M32 24H16"
                                  stroke="#9CA3AF"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M32 30H16"
                                  stroke="#9CA3AF"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M20 12H18H16"
                                  stroke="#9CA3AF"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                          )}
                          <div className="profile-photo-add-icon">
                            <RiAddLine size={20} />
                          </div>
                        </label>
                      </div>
                    )}
                  />
                  <span className="profile-photo-text mt-2">
                    Degree Certificate
                  </span>
                  {regErrors.degreeCertificate && (
                    <FormFeedback className="message-error d-block mt-1">
                      {regErrors.degreeCertificate.message}
                    </FormFeedback>
                  )}
                  <small
                    className="text-muted mt-1"
                    style={{ whiteSpace: 'normal', wordBreak: 'break-all' }}
                  >
                    {degreeCertName || 'Upload image or PDF'}
                  </small>
                </div>
              </FormGroup>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default RegistrationDoctorDetailsForm;
