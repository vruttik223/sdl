import { useContext, useMemo, useState } from 'react';
import { Row } from 'reactstrap';
import FooterCategory from './widgets/FooterCategory';
import FooterUseFul from './widgets/FooterUseFul';
import FooterQuickPage from './widgets/FooterQuickPage';
import SubFooter from './widgets/SubFooter';
import SubFooter2 from './widgets/SubFooter2';
import FooterContactUs from './widgets/FooterContactUs';
import FooterLogoContent from './widgets/FooterLogoContent';
import FooterHighlights from './widgets/FooterHighlights';
import ThemeOptionContext from '@/helper/themeOptionsContext';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/utils/translations';

const MainFooter = () => {
  const { t } = useTranslation('common');
  const [footerMenu, setFooterMenu] = useState('');
  const { themeOption } = useContext(ThemeOptionContext);
  const pathname = usePathname();
  const footerColor = useMemo(() => {
    if (
      pathname == `/theme/madrid` ||
      pathname == `/theme/denver` ||
      pathname == `/theme/berlin`
    ) {
      return 'dark_mode';
    } else {
      return null;
    }
  }, [pathname]);
  return (
    <footer
      className={`section-t-space ${footerColor == 'dark_mode' ? 'footer-section-2 footer-color-2' : themeOption?.footer?.footer_style == 'dark_mode' ? 'footer-section-2 footer-color-2' : ''}`}
    >
      <div className="container-fluid-lg">
        <div className="main-footer ">
          <Row className="g-md-4 g-3">
            <FooterLogoContent />
            <FooterCategory
              footerMenu={footerMenu}
              setFooterMenu={setFooterMenu}
            />
            <FooterUseFul
              footerMenu={footerMenu}
              setFooterMenu={setFooterMenu}
            />
            <FooterQuickPage
              footerMenu={footerMenu}
              setFooterMenu={setFooterMenu}
            />
            <FooterContactUs
              footerMenu={footerMenu}
              setFooterMenu={setFooterMenu}
            />
          </Row>
        </div>
        <FooterHighlights />
        <SubFooter2 />
        <SubFooter />
      </div>
    </footer>
  );
};

export default MainFooter;
