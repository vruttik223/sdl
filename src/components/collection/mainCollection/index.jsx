import { useContext, useEffect, useState, useRef } from 'react';
import FilterSort from './FilterSort';
import GridBox from './GridBox';
import CollectionProducts from './CollectionProducts';
import OfferBanner from '@/components/parisTheme/OfferBanner';
import ThemeOptionContext from '@/helper/themeOptionsContext';
import FilterBtn from './FilterBtn';
import { useTranslation } from '@/utils/translations';
import { useCustomSearchParams } from '@/utils/hooks/useCustomSearchParams';
import { RiFilterFill, RiSortAsc } from 'react-icons/ri';
import CollectionFilter from '../collectionSidebar/CollectionFilter';
import SelectedFilters from './SelectedFilters';
import SortDrawer from './SortDrawer';
import { Offcanvas, OffcanvasBody, OffcanvasHeader } from 'reactstrap';
import CollectionSidebar from '../collectionSidebar';

const MainCollection = ({
  filter,
  setFilter,
  isBanner,
  isOffcanvas,
  classicStoreCard,
  initialGrid = 3,
  noSidebar,
  sellerClass,
}) => {
  const [grid, setGrid] = useState(initialGrid);
  const { themeOption, setCollectionMobile, openOffCanvas, setOpenOffCanvas } = useContext(ThemeOptionContext);
  const { t } = useTranslation('common');
  const [layout] = useCustomSearchParams(['layout']);
  const sortDropdownRef = useRef(null);
  const [sortDrawerOpen, setSortDrawerOpen] = useState(false);
  
  const toggleFilterOffcanvas = () => {
    setOpenOffCanvas(!openOffCanvas);
  };
  useEffect(() => {
    if (layout?.layout == 'collection_3_grid') {
      setGrid(3);
    } else if (layout?.layout == 'collection_4_grid') {
      setGrid(4);
    } else if (layout?.layout == 'collection_5_grid') {
      setGrid(5);
    } else if (layout?.layout == 'collection_list_view') {
      setGrid('list');
    }
  }, [layout]);
  return (
    <div
      className={`${sellerClass ? sellerClass : `col-custome-${isOffcanvas || noSidebar ? '12' : '9'}`} mobile-collection-wrapper`}
    >
      {classicStoreCard && classicStoreCard}
      {isBanner && themeOption?.collection?.collection_banner_image_url && (
        <OfferBanner
          classes={{ customHoverClass: 'banner-contain hover-effect mb-4' }}
          imgUrl={themeOption?.collection?.collection_banner_image_url}
        />
      )}
      <div className="show-button">
        {/* <div className="filter-button-group mt-0">
          <div
            className="filter-button d-inline-block d-lg-none"
            onClick={() => setCollectionMobile((prev) => !prev)}
          >
            <a>
              <RiFilterFill /> {t('FilterMenu')}
            </a>
          </div>
        </div> */}
        <div className={`top-filter-menu${isOffcanvas ? '-2' : ''}`}>
          <div className="left-filter-content">
            <FilterBtn isOffcanvas={isOffcanvas} />
            <SelectedFilters filter={filter} setFilter={setFilter} />
          </div>
          {/* <GridBox grid={grid} setGrid={setGrid} /> */}
          {/* <CollectionFilter filter={filter} setFilter={setFilter} /> */}
          <FilterSort ref={sortDropdownRef} filter={filter} setFilter={setFilter} />
        </div>
      </div>
      <CollectionProducts filter={filter} grid={grid} />
      {/* Mobile Filter and Sort Buttons - Fixed at Bottom */}
      <div className="mobile-filter-sort-buttons d-lg-none">
        <button
          className="mobile-sort-btn"
          onClick={() => setSortDrawerOpen(true)}
        >
          <RiSortAsc className="btn-icon" />
          <span>{t('Sort')}</span>
        </button>
        <button
          className="mobile-filter-btn"
          onClick={toggleFilterOffcanvas}
        >
          <RiFilterFill className="btn-icon" />
          <span>{t('FilterMenu')}</span>
        </button> 
      </div>
      {/* Sort Drawer */}
      <SortDrawer
        isOpen={sortDrawerOpen}
        toggle={() => setSortDrawerOpen(false)}
        filter={filter}
        setFilter={setFilter}
      />
      {/* Filter Offcanvas - Fullscreen on Mobile */}
      <Offcanvas
        toggle={toggleFilterOffcanvas}
        isOpen={openOffCanvas}
        className="shop-offcanvas-filter shop-offcanvas-filter-fullscreen"
        direction="start"
      >
        <OffcanvasHeader toggle={toggleFilterOffcanvas}>{t('FilterMenu')}</OffcanvasHeader>
        <OffcanvasBody>
          <CollectionSidebar
            filter={filter}
            setFilter={setFilter}
            isOffcanvas={true}
          />
        </OffcanvasBody>
      </Offcanvas>
    </div>
  );
};

export default MainCollection;
