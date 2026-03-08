import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Btn from '@/elements/buttons/Btn';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  InputGroup,
} from 'reactstrap';
import AddressSearch from '@/components/googleAddress/AddressSearch/AddressSearch';
import { AllCountryCode } from '@/data/AllCountryCode';
import { addressFormSchema } from './../../../utils/validation/ZodValidationSchema';
import { MapsStatus, useGoogleMapsStatus } from '@/utils/helpers';
import { ToastNotification } from '@/utils/customFunctions/ToastNotification';

const AddAddressForm = ({
  mutate,
  type,
  editAddress,
  setEditAddress,
  modal,
  setModal,
  isSubmitting = false,
}) => {
  const [address, setAddress] = useState({});
  const mapsStatus = useGoogleMapsStatus();
  const mapsUnavailable = mapsStatus !== MapsStatus.READY;

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      countryCode: '91',
      phone: '',
      email: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      pincode: '',
      latitude: '',
      longitude: '',
      placeId: '',
      googleAddress: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    modal !== 'edit' && setEditAddress && setEditAddress({});
  }, [modal]);

  // Update form when address is selected from Google Places
  useEffect(() => {
    if (address && Object.keys(address).length > 0) {
      // console.log('Setting address values:', address);
      setValue('address1', address.address1 ?? '', { shouldValidate: true });
      setValue('city', address.city || '', { shouldValidate: true });
      setValue('state', address.state || '', { shouldValidate: true });
      setValue('pincode', address.pincode || '', { shouldValidate: true });
      setValue('latitude', address.latitude || '', { shouldValidate: true });
      setValue('longitude', address.longitude || '', { shouldValidate: true });
      setValue('placeId', address.placeId || '', { shouldValidate: true });
      setValue('googleAddress', address.googleAddress || '', {
        shouldValidate: true,
      });
    }
  }, [address, setValue]);

  const onSubmit = (data) => {
    // console.log('=== Form Submitted ===');
    // console.log('Raw form data:', data);
    const values = {
      ...data,
      type: type || null,
      pincode: data.pincode.toString(),
    };
    if (modal) {
      values['_method'] = 'PUT';
    }
    console.log('Processed values:', values);
    mutate(values);
    ToastNotification(
      'success',
      modal === 'edit'
        ? 'Address updated successfully.'
        : 'Address added successfully.'
    );
  };

  const onError = (errors) => {
    console.log('=== Form Validation Errors ===');
    console.log(errors);
    if (errors && (errors.latitude || errors.longitude)) {
      // ToastNotification('error', 'Please select a valid address from the suggestions.');
      setError('root', {
        type: 'manual',
        message: 'Please add address using Google Address Search.',
      });
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit, onError)}>
        <fieldset
          disabled={isSubmitting}
          style={{ border: 0, margin: 0, padding: 0 }}
        >
          <div className="responsive-form-scrollable">
            <AddressSearch
              placeholder="Search your address"
              country="IN"
              onSelect={(data) => {
                setAddress(data);
                console.log('selected address => ', data);
              }}
            />
            {errors.root?.message && (
              <div className="text-danger pt-1">{errors.root.message}</div>
            )}

            <Row className="mt-2">
              {/* First Name */}
              <Col md={6}>
                <FormGroup>
                  <Label for="firstName">
                    First Name <span className="text-danger">*</span>
                  </Label>
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        id="firstName"
                        className='input-common'
                        placeholder="Enter first name"
                        invalid={!!errors.firstName}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value.replace(/[^a-zA-Z\s]/g, '')
                          )
                        }
                      />
                    )}
                  />
                  {errors.firstName && (
                    <FormFeedback className='message-error'>{errors.firstName.message}</FormFeedback>
                  )}
                </FormGroup>
              </Col>

              {/* Last Name */}
              <Col md={6}>
                <FormGroup>
                  <Label for="lastName">
                    Last Name <span className="text-danger">*</span>
                  </Label>
                  <Controller
                    name="lastName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        id="lastName"
                        className='input-common'
                        placeholder="Enter last name"
                        invalid={!!errors.lastName}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value.replace(/[^a-zA-Z\s]/g, '')
                          )
                        }
                      />
                    )}
                  />
                  {errors.lastName && (
                    <FormFeedback className='message-error'>{errors.lastName.message}</FormFeedback>
                  )}
                </FormGroup>
              </Col>

              {/* Phone Number with Country Code */}
              <Col md={6}>
                <FormGroup>
                  <Label for="phone">
                    Phone Number <span className="text-danger">*</span>
                  </Label>
                  <InputGroup>
                    <Controller
                      name="countryCode"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="select"
                          className="country-code-select"
                          style={{ maxWidth: '70px' }}
                          invalid={!!errors.countryCode}
                          disabled
                        >
                          {AllCountryCode.map((code) => (
                            <option key={code.id} value={code.id}>
                              {code.name}
                            </option>
                          ))}
                        </Input>
                      )}
                    />
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="tel"
                          id="phone"
                          className='input-common'
                          placeholder="Enter phone number"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={10}
                          onChange={(e) =>
                            field.onChange(e.target.value.replace(/\D/g, ''))
                          }
                          invalid={!!errors.phone}
                        />
                      )}
                    />
                  </InputGroup>
                  {(errors.countryCode || errors.phone) && (
                    <small className=" message-error">
                      {errors.countryCode?.message || errors.phone?.message}
                    </small>
                  )}
                </FormGroup>
              </Col>

              {/* Email */}
              <Col md={6}>
                <FormGroup>
                  <Label for="email">
                    Email
                    {/* <span className="text-danger">*</span> */}
                  </Label>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="email"
                        id="email"
                        className='input-common'
                        placeholder="Enter email address"
                        maxLength={30}
                        invalid={!!errors.email}
                      />
                    )}
                  />
                  {errors.email && (
                    <FormFeedback className='message-error'>{errors.email.message}</FormFeedback>
                  )}
                </FormGroup>
              </Col>

              {/* Address 1 */}
              <Col md={12}>
                <FormGroup>
                  <Label for="address1">
                    Address Line 1 <span className="text-danger">*</span>
                  </Label>
                  <Controller
                    name="address1"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        id="address1"
                        className='input-common'
                        placeholder="Street address, P.O. box"
                        invalid={!!errors.address1}
                      />
                    )}
                  />
                  {errors.address1 && (
                    <FormFeedback className='message-error'>{errors.address1.message}</FormFeedback>
                  )}
                </FormGroup>
              </Col>

              {/* Address 2 */}
              <Col md={12}>
                <FormGroup>
                  <Label for="address2">Address Line 2</Label>
                  <Controller
                    name="address2"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        id="address2"
                        className='input-common'
                        placeholder="Apartment, suite, unit, building, floor, etc."
                      />
                    )}
                  />
                </FormGroup>
              </Col>

              {/* City */}
              <Col xs={12} md={6}>
                <FormGroup>
                  <Label for="city">
                    City <span className="text-danger">*</span>
                  </Label>
                  <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        id="city"
                        className='input-common'
                        placeholder="Enter city"
                        invalid={!!errors.city}
                      />
                    )}
                  />
                  {errors.city && (
                    <FormFeedback className='message-error'>{errors.city.message}</FormFeedback>
                  )}
                </FormGroup>
              </Col>

              {/* State */}
              <Col xs={12} md={6}>
                <FormGroup>
                  <Label for="state">
                    State <span className="text-danger">*</span>
                  </Label>
                  <Controller
                    name="state"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        id="state"
                        className='input-common'
                        placeholder="Enter state"
                        invalid={!!errors.state}
                      />
                    )}
                  />
                  {errors.state && (
                    <FormFeedback className='message-error'>{errors.state.message}</FormFeedback>
                  )}
                </FormGroup>
              </Col>

              {/* Pincode */}
              <Col xs={12}>
                <FormGroup className={'mb-sm-0'}>
                  <Label for="pincode">
                    Pincode <span className="text-danger">*</span>
                  </Label>
                  <Controller
                    name="pincode"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        id="pincode"
                        className='input-common'
                        placeholder="Enter pincode"
                        maxLength={6}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        onChange={(e) =>
                          field.onChange(e.target.value.replace(/\D/g, ''))
                        }
                        invalid={!!errors.pincode}
                      />
                    )}
                  />
                  {errors.pincode && (
                    <FormFeedback className='message-error'>{errors.pincode.message}</FormFeedback>
                  )}
                </FormGroup>
              </Col>

              {/* Hidden fields for Google Places data */}
              <Controller
                name="latitude"
                control={control}
                render={({ field }) => <input type="hidden" {...field} />}
              />
              <Controller
                name="longitude"
                control={control}
                render={({ field }) => <input type="hidden" {...field} />}
              />
              <Controller
                name="placeId"
                control={control}
                render={({ field }) => <input type="hidden" {...field} />}
              />
              <Controller
                name="googleAddress"
                control={control}
                render={({ field }) => <input type="hidden" {...field} />}
              />
            </Row>
          </div>

          {/* Sticky Submit Button */}
          <div className="address-form-footer">
            <div className="d-flex gap-2">
              <Btn
                size="sm"
                color="primary"
                className="flex-grow-1"
                type="submit"
                disabled={isSubmitting}
                // onClick={() => console.log('Button clicked', { errors, mapsUnavailable })}
              >
                {isSubmitting
                  ? 'Saving...'
                  : modal === 'edit'
                    ? 'Update Address'
                    : 'Save Address'}
              </Btn>
              {/* {setModal && (
            <Btn size='sm' className="flex-grow-1" type="button" outline onClick={() => setModal(false)}>
              Cancel
            </Btn>
          )} */}
            </div>
            {mapsUnavailable && (
              <div className="mt-2 text-danger align-self-center">
                Address auto-suggest unavailable. Please try again later.
              </div>
            )}
          </div>
        </fieldset>
      </Form>
    </>
  );
};

export default AddAddressForm;
