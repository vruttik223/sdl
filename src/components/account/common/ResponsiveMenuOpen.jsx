import Btn from '@/elements/buttons/Btn';
import AccountContext from '@/helper/accountContext';
import { useTranslation } from '@/utils/translations';
import { useContext } from 'react';

const ResponsiveMenuOpen = () => {
  const { mobileSideBar, setMobileSideBar } = useContext(AccountContext);

  const { t } = useTranslation('common');
  return (
    <Btn
      className="btn left-dashboard-show btn-animation btn-md fw-bold d-block mb-4 d-lg-none"
      onClick={() => setMobileSideBar(!mobileSideBar)}
    >
      {t('ShowMenu')}
    </Btn>
  );
};

export default ResponsiveMenuOpen;
