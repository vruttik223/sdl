import { useContext } from 'react';
import { Form, Formik } from 'formik';
import SimpleInputField from '@/components/common/inputFields/SimpleInputField';
import useUpdatePassword, {
  UpdatePasswordSchema,
} from '@/utils/hooks/auth/useUpdatePassword';
import { useTranslation } from '@/utils/translations';
import FormBtn from '@/components/common/FormBtn';

const UpdatePasswordForm = () => {
  const { t } = useTranslation('common');
  const { mutate, isLoading } = useUpdatePassword();
  return (
    <Formik
      initialValues={{
        password: '',
        password_confirmation: '',
      }}
      validationSchema={UpdatePasswordSchema}
      onSubmit={mutate}
    >
      {() => (
        <Form className="row g-2">
          <SimpleInputField
            nameList={[
              {
                name: 'password',
                placeholder: t('EmailAddress'),
                title: 'Password',
                label: 'Password',
              },
              {
                name: 'password_confirmation',
                placeholder: t('EnterConfirmPassword'),
                title: 'ConfirmPassword',
                label: 'Confirm Password',
              },
            ]}
          />
          <FormBtn
            title={'UpdatePassword'}
            classes={{ btnClass: 'btn-animation w-100 justify-content-center' }}
            loading={isLoading}
          />
        </Form>
      )}
    </Formik>
  );
};

export default UpdatePasswordForm;
