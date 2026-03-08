import { useContext, useMemo } from 'react';
import Link from 'next/link';
import { LeafSVG } from '@/components/common/CommonSVG';
import WrapperComponent from '@/components/common/WrapperComponent';
import ProductSection1 from '@/components/parisTheme/productSections/ProductSection1';
import ProductIdsContext from '@/helper/productIdsContext';
import { productPageRelatedSliderOptions } from '../../../data/SliderSettings';
import Btn from '@/elements/buttons/Btn';
import fallbackProductsData from '@/app/api/product/product.json';

const RelatedProduct = ({ productState, productData: productDataProp }) => {
  const { filteredProduct } = useContext(ProductIdsContext);
  
  // Get fallback products from local JSON file
  const fallbackProducts = useMemo(() => {
    const products = Array.isArray(fallbackProductsData?.data)
      ? fallbackProductsData.data
      : [];
    return products.slice(0, 8);
  }, []);
  
  // When productData is provided (e.g. from blog API), use it; else use context or fallback
  const productData = productDataProp?.length 
    ? productDataProp 
    : filteredProduct?.length 
      ? filteredProduct 
      : fallbackProducts;
  const dataAPI = {
    title: 'YouMayAlsoLike',
    description: 'Explore More Products',
    product_ids: productDataProp ? undefined : productState?.product?.related_products,
  };
  // Related products: show 4 items on desktop (and responsive), avoid cloning on API-provided lists
  const relatedProductSliderOption = {
    ...productPageRelatedSliderOptions,
    slidesToShow: 4,
    responsive: [
      { breakpoint: 1680, settings: { slidesToShow: 4 } },
      { breakpoint: 1400, settings: { slidesToShow: 4 } },
      // Keep 4 visible on typical laptops; drop to 3 below lg
      { breakpoint: 1200, settings: { slidesToShow: 3 } },
      { breakpoint: 992, settings: { slidesToShow: 3 } },
      { breakpoint: 992, settings: { slidesToShow: 2 } },
      { breakpoint: 660, settings: { slidesToShow: 2 } },
      { breakpoint: 576, settings: { slidesToShow: 2 } },
    ],
  };
  const sliderOption = productDataProp?.length
    ? { ...relatedProductSliderOption, infinite: false }
    : relatedProductSliderOption;
  return (
    <WrapperComponent
      classes={{ sectionClass: 'product-list-section related-product-section section-b-space' }}
      noRowCol={true}
    >
      <ProductSection1
        dataAPI={dataAPI}
        ProductData={productData}
        svgUrl={<LeafSVG className="icon-width" />}
        noCustomClass={true}
        classObj={{
          productStyle: 'product-standard',
          productBoxClass: 'product-box-bg',
        }}
        customSliderOption={sliderOption}
        showNav={true}
      />
      <div className="d-flex justify-content-center mt-4">
        <Link href="/collections">
          <Btn color="primary" size="md" className="">
            View More
          </Btn>
        </Link>
      </div>
    </WrapperComponent>
  );
};

export default RelatedProduct;
