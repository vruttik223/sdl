import React, { useContext, useMemo } from 'react';
import { Col } from 'reactstrap';
import ThemeOptionContext from '@/helper/themeOptionsContext';
import FooterDownloadAppLink from './FooterDownloadAppLink';
import FooterSupportEmail from './FooterSupportEmail';
import FooterSupportNumber from './FooterSupportNumber';
import FooterNewsletter from './FooterNewsletter';
import { useTranslation } from '@/utils/translations';

const FooterContactUs = () => {
  const { themeOption } = useContext(ThemeOptionContext);
  const { t } = useTranslation('common');
  const hasFooterContent = useMemo(
    () =>
      themeOption?.footer?.support_number ||
      themeOption?.footer?.support_email ||
      themeOption?.footer?.app_store_url ||
      themeOption?.footer?.play_store_url,
    [
      themeOption?.footer?.app_store_url,
      themeOption?.footer?.play_store_url,
      themeOption?.footer?.support_email,
      themeOption?.footer?.support_number,
    ]
  );
  return (
    <Col xl={3} lg={4} sm={6}>
      {hasFooterContent ? (
        <div className={`footer-title contact-title`}>
          <h4>{t('ContactUs')}</h4>
        </div>
      ) : (
        ''
      )}
      <div className="footer-contact">
        <ul>
          <FooterNewsletter />
          {/* <FooterSupportNumber />
          <FooterSupportEmail /> */}
          <FooterDownloadAppLink />
        </ul>
      </div>
    </Col>
  );
};

export default FooterContactUs;
