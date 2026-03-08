import { useContext } from 'react';
import { Form, Formik } from 'formik';
import FormBtn from '@/components/common/FormBtn';
import SimpleInputField from '@/components/common/inputFields/SimpleInputField';
import useHandleForgotPassword, {
  ForgotPasswordSchema,
} from '@/utils/hooks/auth/useForgotPassword';
import { useTranslation } from '@/utils/translations';

const ForgotPasswordForm = () => {
  const { t } = useTranslation('common');
  const { mutate, isLoading } = useHandleForgotPassword();
  return (
    <>
      <Formik
        initialValues={{
          email: '',
        }}
        validationSchema={ForgotPasswordSchema}
        onSubmit={(values) => mutate(values)}
      >
        {() => (
          <Form className="row g-4">
            <SimpleInputField
              nameList={[
                {
                  name: 'email',
                  placeholder: t('EmailAddress'),
                  title: 'Email',
                  label: 'Email Address',
                },
              ]}
            />
            <FormBtn
              title={'ForgotPassword'}
              classes={{
                btnClass: 'btn-animation w-100 justify-content-center',
              }}
              loading={isLoading}
            />
          </Form>
        )}
      </Formik>
    </>
  );
};

export default ForgotPasswordForm;
