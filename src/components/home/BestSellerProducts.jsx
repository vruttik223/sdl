'use client';

import WrapperComponent from '../common/WrapperComponent';
import CustomHeading from '@/components/common/CustomHeading';
import { LeafSVG } from '@/components/common/CommonSVG';
import { Col, Row } from 'reactstrap';
import { useHome } from '@/utils/hooks/useHome';
import fallbackProductsData from '@/app/api/product/product.json';
import ProductBox1 from '@/components/common/productBox/productBox1/ProductBox1';
import Link from 'next/link';
import Btn from '@/elements/buttons/Btn';
import { useMemo } from 'react';

// Dummy data for development
const DUMMY_BEST_SELLER_PRODUCTS = [];

const BestSellerProducts = () => {
  const { data, isLoading, isError } = useHome();

  const bestSellerProducts =
    data?.data?.bestSellerProducts || DUMMY_BEST_SELLER_PRODUCTS;
  const fallbackRelatedProducts = useMemo(() => {
    const fallbackProducts = Array.isArray(fallbackProductsData?.data)
      ? fallbackProductsData.data
      : [];
    return fallbackProducts.slice(0, 4);
  }, []);

  const relatedProductList = useMemo(() => {
    const apiRelated = [];

    return apiRelated.length > 0 ? apiRelated : fallbackRelatedProducts;
  }, [fallbackRelatedProducts]);

  return (
    <WrapperComponent
      classes={{ sectionClass: 'best-seller-products-section' }}
      noRowCol={true}
    >
      <Row>
        <Col>
          <CustomHeading
            customClass="mb-0"
            title="Best Seller Products"
            subTitle="Explore Our Top Products"
            svgUrl={<LeafSVG className="icon-width" />}
          />
        </Col>
      </Row>

      <Row>
        <Col>
          {relatedProductList.length > 0 && (
            <>
              <div className="product-slider-placeholder">
                {/* <div className="row g-sm-4 g-3"> */}
                <Row className={`g-sm-4 g-3 product-list-section`}>
                  {relatedProductList.map((product, i) => (
                    <Col xl={3} lg={4} md={6} xs={6} key={i}>
                      <ProductBox1
                        imgUrl={product?.product_thumbnail}
                        productDetail={{ ...product }}
                        classObj={{ productBoxClass: 'product-box-3' }}
                      />
                    </Col>
                  ))}
                </Row>
                {/* </div> */}
              </div>

              <div className="d-flex justify-content-center mt-4">
                <Link href="/collections">
                  <Btn color="primary" size="md">
                    View All Related Products
                  </Btn>
                </Link>
              </div>
            </>
          )}
        </Col>
      </Row>
    </WrapperComponent>
  );
};

export default BestSellerProducts;
