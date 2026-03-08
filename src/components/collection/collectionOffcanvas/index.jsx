import { useContext } from 'react';
import { Offcanvas, OffcanvasBody, OffcanvasHeader } from 'reactstrap';
import WrapperComponent from '@/components/common/WrapperComponent';
import MainCollection from '../mainCollection';
import ThemeOptionContext from '@/helper/themeOptionsContext';
import CollectionSidebar from '../collectionSidebar';
import { useTranslation } from '@/utils/translations';

const CollectionOffCanvas = ({ filter, setFilter }) => {
  const { t } = useTranslation('common');
  const { openOffCanvas, setOpenOffCanvas } = useContext(ThemeOptionContext);
  const toggle = () => {
    setOpenOffCanvas(!openOffCanvas);
  };
  return (
    <>
      <WrapperComponent
        classes={{ sectionClass: 'section-b-space shop-section' }}
        customCol={true}
      >
        <MainCollection
          filter={filter}
          setFilter={setFilter}
          isOffcanvas={true}
        />
      </WrapperComponent>
      <Offcanvas
        toggle={toggle}
        isOpen={openOffCanvas}
        className="shop-offcanvas-filter"
      >
        <OffcanvasHeader toggle={toggle}>{t('Back')}</OffcanvasHeader>
        <OffcanvasBody>
          <CollectionSidebar
            filter={filter}
            setFilter={setFilter}
            isOffcanvas={true}
          />
        </OffcanvasBody>
      </Offcanvas>
    </>
  );
};

export default CollectionOffCanvas;
