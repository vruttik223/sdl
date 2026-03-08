import { useContext, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AccordionBody, AccordionHeader, AccordionItem, UncontrolledAccordion } from 'reactstrap';
import CollectionCategory from './CollectionCategory';
import CollectionMainCategory from './CollectionMainCategory';
import CollectionHerbs from './CollectionHerbs';
import CollectionDiscount from './CollectionDiscount';
import request from '@/utils/axiosUtils';
import { AttributesAPI } from '@/utils/axiosUtils/API';
import CollectionAttributes from './CollectionAttributes';
import CollectionFilter from './CollectionFilter';
import CollectionPrice from './CollectionPrice';
import CollectionRating from './CollectionRating';
import ThemeOptionContext from '@/helper/themeOptionsContext';
import { RiCloseFill } from 'react-icons/ri';
import CollectionSidebarSkeleton from '@/components/common/skeletonLoader/collectionSidebarSkeleton';
import PriceRangeSlider from './PriceRangeSlider';

const CollectionSidebar = ({
  filter,
  setFilter,
  isOffcanvas,
  basicStoreCard,
  rightSideClass,
  sellerClass,
  isAttributes = true,
}) => {
  const { collectionMobile, setCollectionMobile } =
    useContext(ThemeOptionContext);
  const [open, setOpen] = useState('1');
  const toggle = (id) => {
    if (open === id) {
      setOpen();
    } else {
      setOpen(id);
    }
  };
  const { data: attributeAPIData, isLoading } = useQuery({
    queryKey: [AttributesAPI],
    queryFn: () => request({ url: AttributesAPI, params: { status: 1 } }),
    enabled: true,
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.data,
  });
  const defaultOpenList = Array.from(
    { length: attributeAPIData?.length + 6 },
    (_, index) => (index + 1).toString()
  );
  return (
    <>
      {collectionMobile && (
        <div
          className="bg-overlay show"
          onClick={() => setCollectionMobile(false)}
        />
      )}
      <div
        className={`${sellerClass ? sellerClass : `col-custome-${isOffcanvas ? '12' : '3'}`} `}
      >
        <div
          className={`left-box ${rightSideClass ? rightSideClass : ''} ${collectionMobile ? 'show' : ''}`}
        >
          <div className="shop-left-sidebar">
            {/* <div
              className="back-button"
              onClick={() => setCollectionMobile((prev) => !prev)}
            >
              <h3>
                <a className="text-title">
                  <RiCloseFill />
                  <span>Back</span>
                </a>
              </h3>
            </div> */}
            {basicStoreCard && basicStoreCard}
            {isLoading && <CollectionSidebarSkeleton />}
            {isOffcanvas && (
              <CollectionFilter filter={filter} setFilter={setFilter} />
            )}
            {attributeAPIData && (
              <UncontrolledAccordion
                className="custome-accordion"
                open={open}
                toggle={toggle}
                stayOpen
                defaultOpen={defaultOpenList}
              >
                <AccordionItem>
                  <AccordionHeader targetId="1">
                    <span>Categories</span>
                  </AccordionHeader>
                  <CollectionMainCategory
                    filter={filter}
                    setFilter={setFilter}
                  />
                </AccordionItem>
                <AccordionItem>
                  <AccordionHeader targetId="2">
                    <span>Subcategories</span>
                  </AccordionHeader>
                  <CollectionCategory filter={filter} setFilter={setFilter} />
                </AccordionItem>
                <AccordionItem style={{ borderBottom: '1px solid var(--border-color)', borderTop: '1px solid var(--border-color)',paddingTop: '20px' }}>
                  <AccordionHeader targetId="3">
                    <span>Price Range</span>
                  </AccordionHeader>
                  <AccordionBody accordionId="3">
                    <PriceRangeSlider />
                  </AccordionBody>
                </AccordionItem>
                <AccordionItem>
                  <AccordionHeader targetId="4">
                    <span>Herbs</span>
                  </AccordionHeader>
                  <CollectionHerbs filter={filter} setFilter={setFilter} />
                </AccordionItem>
                <AccordionItem>
                  <AccordionHeader targetId="5">
                    <span>Discount Range</span>
                  </AccordionHeader>
                  <CollectionDiscount filter={filter} setFilter={setFilter} />
                </AccordionItem>
                {/* Commented out accordions below as ProductCategory is already shown above */}
                {/* {isAttributes ? (
                  <CollectionAttributes
                    attributeAPIData={attributeAPIData}
                    filter={filter}
                    setFilter={setFilter}
                  />
                ) : null}

                <CollectionPrice
                  filter={filter}
                  setFilter={setFilter}
                  attributeAPIData={attributeAPIData}
                />
                <CollectionRating
                  filter={filter}
                  setFilter={setFilter}
                  attributeAPIData={attributeAPIData}
                /> */}
              </UncontrolledAccordion>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CollectionSidebar;
