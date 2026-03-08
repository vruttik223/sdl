import React from 'react';
import { Controller } from 'react-hook-form';
import { FormGroup, Label } from 'reactstrap';
import { RiArrowLeftLine } from 'react-icons/ri';

const RegistrationSpecializationForm = ({
  regControl,
  specializations,
  isLoadingSpecializations,
  onBack,
  getRegistrationProgress,
}) => {
  return (
    <>
      <div className="mb-3">
        <button
          type="button"
          className="btn btn-link p-0 text-decoration-none d-flex align-items-center"
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

      <FormGroup className="otp-form-group">
        <Label className="form-label mb-1">
          Select Your Specializations (Optional, max 3)
        </Label>
        <Controller
          name="specialization"
          control={regControl}
          render={({ field }) => {
            const selected = field.value || [];
            const maxReached = selected.length >= 3;

            const toggleSpecialization = (id) => {
              if (selected.includes(id)) {
                field.onChange(selected.filter((item) => item !== id));
              } else if (!maxReached) {
                field.onChange([...selected, id]);
              }
            };

            return (
              <div className="specialization-grid">
                {isLoadingSpecializations ? (
                  <div className="text-center py-4">
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Loading specializations...
                  </div>
                ) : specializations.data.length === 0 ? (
                  <div className="text-center py-4 text-muted">
                    No specializations available
                  </div>
                ) : (
                  specializations.data.map((spec) => {
                    const isActive = selected.includes(spec.uid);
                    const isDisabled = !isActive && maxReached;

                    return (
                      <button
                        key={spec.uid}
                        type="button"
                        className={`specialization-card${
                          isActive ? ' specialization-card--active' : ''
                        }${isDisabled ? ' specialization-card--disabled' : ''}`}
                        style={
                          spec.image
                            ? { backgroundImage: `url(${spec.image})` }
                            : undefined
                        }
                        onClick={() => toggleSpecialization(spec.uid)}
                        disabled={isDisabled}
                      >
                        <span className="specialization-card__label">
                          {spec.name}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            );
          }}
        />
      </FormGroup>
    </>
  );
};

export default RegistrationSpecializationForm;
