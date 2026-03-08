import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Slider from 'react-slick';
import { Col, Row } from 'reactstrap';

import ImageMagnifier from '@/components/ImageZoom/ImageMagnifier';

/**
 * Default magnifier configuration
 * You can customize these values or pass them as props
 */
const defaultMagnifierConfig = {
  lensWidth: 100,
  lensHeight: 100,
  containerWidth: 300,
  containerHeight: 300,
  zoomLevel: 2.5,
  position: 'right', // 'top' | 'right' | 'bottom' | 'left'
  gap: 20,
  mobileBreakpoint: 992,
  lensColor: 'rgba(0, 0, 0, 0.2)',
  lensBorderColor: '#333',
};

const ProductThumbnailSlider = ({ productState, magnifierConfig = {} }) => {
  const [state, setState] = useState({ nav1: null, nav2: null });
  const slider1 = useRef();
  const slider2 = useRef();
  const { nav1, nav2 } = state;

  // Merge default config with passed config
  const mergedMagnifierConfig = {
    ...defaultMagnifierConfig,
    ...magnifierConfig,
  };

  useEffect(() => {
    setState({
      nav1: slider1.current,
      nav2: slider2.current,
    });
  }, []);

  // Clone images if count is less than required slides for seamless loop
  const getGalleryImages = () => {
    const galleries = productState?.product?.product_galleries || [];
    const minSlides = 4;

    if (galleries.length === 0) return [];
    if (galleries.length >= minSlides) return galleries;

    const clonedGalleries = [];
    const timesToRepeat = Math.ceil(minSlides / galleries.length);
    for (let i = 0; i < timesToRepeat; i++) {
      clonedGalleries.push(...galleries);
    }
    return clonedGalleries;
  };

  const galleryImages = getGalleryImages();

  // Vertical thumbnail slider settings
  const thumbSliderSettings = {
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: false,
    dots: false,
    focusOnSelect: true,
    infinite: false,
    vertical: true,
    verticalSwiping: false,
    centerMode: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 576,
        settings: {
          vertical: false,
          slidesToShow: 4,
        },
      },
    ],
  };

  return (
    <Col xs={12}>
      <div className="product-left-box position-sticky top-0" style={{maxHeight: '600px'}}>
        <Row className="g-3 flex-sm-row flex-column-reverse">
          <Col xs={12} sm={2}>
            <div className="bottom-slider-image left-slider slick-top product-thumb-vertical">
              <Slider
                {...thumbSliderSettings}
                asNavFor={nav1}
                ref={(slider) => (slider2.current = slider)}
              >
                {galleryImages.map((elem, i) => (
                  <div key={`thumb-${i}`}>
                    <div className="sidebar-image">
                      <Image
                        height={100}
                        width={100}
                        src={elem?.original_url}
                        className="img-fluid"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        alt={elem?.name}
                      />
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </Col>

          {/* Main image slider — col-10 on md+ */}
          <Col xs={12} sm={10}>
            <div className="product-main-1 position-relative">
              {productState?.product?.is_sale_enable ? (
                <div className="product-label-tag sale-tag">
                  <span>Sale</span>
                </div>
              ) : productState?.product?.is_featured ? (
                <div className="product-label-tag featured-tag">
                  <span>Featured</span>
                </div>
              ) : null}
              <Slider
                arrows={true}
                asNavFor={nav2}
                ref={(slider) => (slider1.current = slider)}
              >
                {galleryImages.map((elem, i) => (
                  <div key={`main-${i}`}>
                    <div className="slider-image">
                      <ImageMagnifier
                        src={elem?.original_url}
                        alt={elem?.name}
                        width={580}
                        height={580}
                        className="img-fluid"
                        magnifierConfig={mergedMagnifierConfig}
                      />
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </Col>
        </Row>
      </div>
    </Col>
  );
};

export default ProductThumbnailSlider;
