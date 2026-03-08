import { useState, useRef } from 'react';
import { Row, Form as ReactstrapForm, Spinner } from 'reactstrap';
import Btn from '@/elements/buttons/Btn';
import RHFSimpleInputField from '@/components/common/inputFields/RHFSimpleInputField';
import { useTranslation } from '@/utils/translations';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import SuccessModal from '@/components/common/SuccessModal';
import ErrorModal from '@/components/common/ErrorModal';
import { contactUs } from '@/api/contact-us.api';
import ReCAPTCHA from 'react-google-recaptcha';

const lettersAndSpaces = /^[a-zA-Z\s]+$/;

const contactSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, 'Enter a valid first name')
    .regex(lettersAndSpaces, 'First name can contain only letters'),
  lastName: z
    .string()
    .trim()
    .min(2, 'Enter a valid last name')
    .regex(lettersAndSpaces, 'Last name can contain only letters'),
  email: z
    .string()
    .trim()
    .email('Enter a valid email address')
    .min(1, 'Email is required'),
  phone: z
    .string()
    .trim()
    .regex(/^\d{10}$/, 'Enter a valid phone number'),
  // pincode: z
  //   .string()
  //   .trim()
  //   .regex(/^\d{6}$/, 'Pincode must be 6 digits'),
  // subject: z
  //   .string()
  //   .trim()
  //   .min(2, 'Subject must be at least 2 characters')
  //   .regex(lettersAndSpaces, 'Subject can contain only letters'),
  enquiryType: z.string().trim().min(1, 'Enquiry type is required'),
  message: z
    .string()
    .trim()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters'),
});

const ContactUsForm = () => {
  const { t } = useTranslation('common');
  const [successModal, setSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const recaptchaRef = useRef(null);

  const methods = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      pincode: '',
      subject: '',
      enquiryType: '',
      message: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      setApiError(null);

      let recaptchaToken = null;
      if (recaptchaRef.current) {
        recaptchaToken = await recaptchaRef.current.executeAsync();
        recaptchaRef.current.reset();
      }

      if (!recaptchaToken) {
        throw new Error('reCAPTCHA verification failed. Please try again.');
      }

      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        pincode: formData.pincode || null,
        subject: formData.subject || null,
        enquiryType: formData.enquiryType,
        message: formData.message,
        recaptchaToken,
      };

      const response = await contactUs(payload);

      if (response.success) {
        setSuccessModal(true);
        methods.reset();
      }
    } catch (error) {
      setApiError(error.message);
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setSuccessModal(false);
  };

  return (
    <FormProvider {...methods}>
      <ReactstrapForm onSubmit={methods.handleSubmit(onSubmit)}>
        <Row>
          <RHFSimpleInputField
            nameList={[
              {
                name: 'firstName',
                placeholder: t('Enter your first name'),
                toplabel: 'First Name',
                require: 'true',
                className: 'input-common',
                colprops: { xxl: 6, sm: 6 },
                onInput: (e) =>
                  (e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '')),
              },
              {
                name: 'lastName',
                placeholder: t('Enter your last name'),
                toplabel: 'Last Name',
                require: 'true',
                className: 'input-common',
                colprops: { xxl: 6, sm: 6 },
                onInput: (e) =>
                  (e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '')),
              },
              {
                name: 'email',
                placeholder: t('Enter your email'),
                toplabel: 'Email Address',
                require: 'true',
                className: 'input-common',
                colprops: { xxl: 6, sm: 6 },
              },
              // {
              //   name: 'pincode',
              //   placeholder: t('EnterPincode'),
              //   toplabel: 'Pincode',
              //   require: 'true',
              //   type: 'tel',
              //   inputMode: 'numeric',
              //   maxLength: 6,
              //   onInput: (e) => {
              //     e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
              //   },
              //   colprops: { xxl: 6, lg: 12, sm: 6 },
              // },
              {
                name: 'phone',
                placeholder: t('Enter your phone number'),
                toplabel: 'Phone Number',
                require: 'true',
                className: 'input-common',
                type: 'tel',
                inputMode: 'numeric',
                maxLength: 10,
                onInput: (e) => {
                  e.target.value = e.target.value
                    .replace(/\D/g, '')
                    .slice(0, 10);
                },
                colprops: { xxl: 6, sm: 6 },
              },
              // {
              //   name: 'subject',
              //   placeholder: t('EnterSubject'),
              //   toplabel: 'Subject',
              //   require: 'true',
              //   colprops: { xxl: 6, lg: 12, sm: 6 },
              //   onInput: (e) =>
              //     (e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '')),
              // },
              {
                name: 'enquiryType',
                toplabel: 'Enquiry Type',
                require: 'true',
                type: 'select',
                className: 'input-common',
                colprops: { xs: 12 },
                children: (
                  <>
                    <option value="">{t('Select your enquiry type')}</option>
                    <option value="General enquiry">
                      {t('General enquiry')}
                    </option>
                    <option value="Product related">
                      {t('Product related')}
                    </option>
                    <option value="Order related">{t('Order related')}</option>
                    <option value="Support related">
                      {t('Support related')}
                    </option>
                  </>
                ),
              },
              {
                name: 'message',
                placeholder: t('EnterYourMessage'),
                toplabel: 'Message',
                require: 'true',
                className: 'input-common',
                colprops: { xs: 12 },
                type: 'textarea',
                rows: 5,
              },
            ]}
          />
        </Row>
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
          size="invisible"
          badge="bottomright"
        />
        <Btn
          color="primary"
          size="md"
          className="submit-button w-100"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <Spinner
              style={{ width: '1em', height: '1em', borderWidth: '1px' }}
            />
          ) : (
            'Send Message'
          )}
        </Btn>
      </ReactstrapForm>
      <SuccessModal
        modal={successModal}
        setModal={setSuccessModal}
        title={t('Enquiry Submitted Successfully!')}
        message={t(
          'Your enquiry has been submitted successfully. We will get back to you soon.'
        )}
        onClose={handleModalClose}
      />
      <ErrorModal
        modal={showErrorModal}
        setModal={setShowErrorModal}
        title={t('Enquiry submission failed')}
        message={apiError}
      />
    </FormProvider>
  );
};

export default ContactUsForm;
