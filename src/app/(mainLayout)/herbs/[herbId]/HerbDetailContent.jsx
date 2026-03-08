'use client';

import { useState, useRef, useMemo } from 'react';
import { Col, Row } from 'reactstrap';
import Slider from 'react-slick';
import Image from 'next/image';
import Link from 'next/link';
import { RiCalendarLine } from 'react-icons/ri';
import WrapperComponent from '@/components/common/WrapperComponent';
import { LeafSVG } from '@/components/common/CommonSVG';
import HerbCard from '@/components/herbs/HerbCard';
import Btn from '@/elements/buttons/Btn';
import Loader from '@/layout/loader';
import { useHerbDetail } from '@/utils/hooks/useHerbs';
import { formatDate } from '@/utils/helpers';
import ProductBox1 from '@/components/common/productBox/productBox1/ProductBox1';
import fallbackProductsData from '@/app/api/product/product.json';

const HerbDetailContent = ({ herbSlug }) => {
  const slider1 = useRef();
  const slider2 = useRef();
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);

  // Use React Query hook to fetch herb data
  const { data: herbResponse, isLoading, error } = useHerbDetail(herbSlug);

  // Slider settings for main image
  const mainSliderSettings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    autoHeight: false,
    arrows: false,
    fade: true,
    asNavFor: nav2,
    ref: slider1,
  };

  // Slider settings for thumbnail navigation
  const thumbSliderSettings = {
    slidesToShow: 4,
    slidesToScroll: 1,
    asNavFor: nav1,
    dots: false,
    centerMode: false,
    focusOnSelect: true,
    arrows: true,
    ref: slider2,
    // vertical: true,
    // responsive: [
    //   {
    //     breakpoint: 768,
    //     settings: {
    //       slidesToShow: 3,
    //     },
    //   },
    //   {
    //     breakpoint: 480,
    //     settings: {
    //       slidesToShow: 2,
    //     },
    //   },
    // ],
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error || !herbResponse?.success || !herbResponse?.data?.herb) {
    return (
      <WrapperComponent classes={{ sectionClass: 'section-b-space' }}>
        <div className="text-center py-5">
          <h2>Herb Not Found</h2>
          <p className="mt-3">
            {error?.message || 'The herb you are looking for does not exist.'}
          </p>
          <Link href="/herbs">
            <Btn className="btn theme-bg-color text-white btn-md fw-semibold mt-3">
              Browse All Herbs
            </Btn>
          </Link>
        </div>
      </WrapperComponent>
    );
  }

  const { herb, otherHerbs, relatedProducts } = herbResponse.data;

  const fallbackRelatedProducts = useMemo(() => {
    const fallbackProducts = Array.isArray(fallbackProductsData?.data)
      ? fallbackProductsData.data
      : [];
    return fallbackProducts.slice(0, 8);
  }, []);

  const relatedProductList = useMemo(() => {
    const apiRelated = Array.isArray(relatedProducts?.products)
      ? relatedProducts.products.slice(0, 4)
      : Array.isArray(relatedProducts)
        ? relatedProducts.slice(0, 4)
        : [];

    return apiRelated.length > 0 ? apiRelated : fallbackRelatedProducts;
  }, [relatedProducts, fallbackRelatedProducts]);

  // Prepare images array (coverImage + herbImages)
  const allImages = [
    {
      uid: 'cover',
      image: herb.coverImage,
      imageAlt: herb.coverImageAlt || herb.name,
    },
    ...(herb.herbImages || []),
  ];

  // Transform other herbs for HerbCard component
  const transformedOtherHerbs = (otherHerbs || []).map((h) => ({
    id: h.uid,
    slug: h.slug,
    name: h.name,
    subtitle: h.subtitle,
    coverImage: h.coverImage,
    coverImageAlt: h.coverImageAlt || h.name,
    shortDescription:
      h.subtitle || h.herbInfos?.[0]?.description?.split('\n')[0] || '',
    herbInfos: h.herbInfos || [],
    verifiedFlag: h.verifiedFlag,
    status: h.status,
    created_at: h.created_at,
    created_at: h.created_at,
  }));

  return (
    <>
      {/* Main Content Section - Image Slider Left, Description Right */}
      <WrapperComponent
        classes={{
          sectionClass: 'product-section section-b-space',
          row: 'g-5',
        }}
        customCol={true}
      >
        {/* Left Side - Image Slider */}
        <Col lg={5}>
          <div className="product-left-box">
            <Row className="g-sm-4 g-2">
              <Col xs={12}>
                <div className="product-main-2 no-arrow">
                  {allImages.length > 0 && (
                    <Slider
                      {...mainSliderSettings}
                      asNavFor={nav2}
                      ref={(slider) => {
                        slider1.current = slider;
                        setNav1(slider);
                      }}
                      className="product-main-slider"
                    >
                      {allImages.map((image, index) => (
                        <div key={image.uid}>
                          <div className="slider-image">
                            <Image
                              width={500}
                              height={500}
                              src={image.image}
                              alt={
                                image.imageAlt ||
                                `${herb.name} - Image ${index + 1}`
                              }
                              className="img-fluid"
                              style={{
                                // maxHeight: 400,
                                width: 'auto',
                                marginInline: 'auto',
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </Slider>
                  )}
                </div>
              </Col>
              {allImages.length > 1 && (
                <Col xs={12}>
                  <div className="bottom-slider-image left-slider slick-top">
                    <Slider
                      {...thumbSliderSettings}
                      asNavFor={nav1}
                      ref={(slider) => {
                        slider2.current = slider;
                        setNav2(slider);
                      }}
                      className="bottom-slider"
                    >
                      {allImages.map((image, index) => (
                        <div key={image.uid}>
                          <div className="sidebar-image">
                            <Image
                              width={250}
                              height={250}
                              style={{
                                minHeight: 110,
                                maxHeight: 110,
                                width: '100%',
                                marginInline: 'auto',
                              }}
                              src={image.image}
                              alt={
                                image.imageAlt ||
                                `${herb.name} - Thumbnail ${index + 1}`
                              }
                              className="object-fit-cover"
                            />
                          </div>
                        </div>
                      ))}
                    </Slider>
                  </div>
                </Col>
              )}
            </Row>
          </div>
        </Col>

        {/* Right Side - Description */}
        <Col lg={7}>
          <div className="right-box-contain herb-detail">
            <h2 className="name">{herb.name}</h2>
            {herb.subtitle && (
              <h5 className="text-content scientific-name mb-3">
                <em>{herb.subtitle}</em>
              </h5>
            )}

            {/* Herb Info Sections */}
            {herb.herbInfos && herb.herbInfos.length > 0 && (
              <div className="herb-infos mt-4">
                {herb.herbInfos.map((infoItem) => (
                  <div key={infoItem.uid} className="mb-4">
                    <div className="title">{infoItem.title}</div>
                    <p className="description mt-2">{infoItem.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Timestamps */}
            <div className="mt-4 text-muted small">
              <p>
                <RiCalendarLine className="me-2" />
                Created on:{' '}
                {formatDate(new Date(herb.created_at).toLocaleDateString())}
              </p>
            </div>
          </div>
        </Col>
      </WrapperComponent>

      {/* Related Products Slider Section */}
      {relatedProductList.length > 0 && (
        <WrapperComponent
          classes={{
            sectionClass:
              'product-list-section related-product-section section-b-space',
          }}
          noRowCol={true}
        >
          <div className="title mb-0">
            <h2>Related Products</h2>
            <span className="title-leaf">
              <LeafSVG className="icon-width" />
            </span>
          </div>

          {/* Placeholder for ProductSection1 - will be integrated later */}
          <div className="product-slider-placeholder">
            <div className="row g-sm-4 g-3">
              <Row
                // xxl={4}
                // xl={4}
                // lg={3}
                // md={2}
                className={`g-sm-4 g-3 product-list-section`}
              >
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
            </div>
          </div>

          <div className="d-flex justify-content-center mt-4">
            <Link href="/collections">
              <Btn color="primary" className="btn btn-primary">
                View All Related Products
              </Btn>
            </Link>
          </div>
        </WrapperComponent>
      )}

      {/* Other Herbs Slider Section */}
      {transformedOtherHerbs.length > 0 && (
        <WrapperComponent
          classes={{
            sectionClass:
              'product-list-section other-herbs-section section-b-space bg-light',
          }}
          noRowCol={true}
        >
          <div className="title mb-0">
            <h2>Explore Other Herbs</h2>
            <span className="title-leaf">
              <LeafSVG className="icon-width" />
            </span>
          </div>

          <div className="product-slider-placeholder mt-4">
            <Row className="g-3 g-md-4">
              {transformedOtherHerbs.slice(0, 8).map((otherHerb) => (
                <Col key={otherHerb.id} xs={6} sm={4} lg={3}>
                  <HerbCard herb={otherHerb} />
                </Col>
              ))}
            </Row>
          </div>

          <div className="d-flex justify-content-center mt-4">
            <Link href="/herbs">
              <Btn className="btn theme-bg-color text-white btn-md fw-semibold">
                Browse All Herbs
              </Btn>
            </Link>
          </div>
        </WrapperComponent>
      )}
    </>
  );
};

export default HerbDetailContent;
