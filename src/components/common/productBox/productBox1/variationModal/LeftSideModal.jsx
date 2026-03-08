import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Col } from 'reactstrap';
import Slider from 'react-slick';
import { placeHolderImage } from '../../../../../data/CommonPath';
import { viewModalSliderOption } from '../../../../../data/SliderSettings';
import ProductBagde from '../ProductBagde';

const LeftSideModal = ({ cloneVariation, productObj }) => {
  const [state, setState] = useState({ nav1: null, nav2: null });
  const slider1 = useRef();
  const slider2 = useRef();
  const { nav1, nav2 } = state;
  useEffect(() => {
    setState({
      nav1: slider1.current,
      nav2: slider2.current,
    });
  }, []);
  return (
    <Col lg="6" className="position-relative" style={{ marginTop: '12px' }}>
      <ProductBagde productDetail={productObj} />
      <div className="view-image-slider">
        <Slider asNavFor={nav2} ref={(slider) => (slider1.current = slider)}>
          {cloneVariation?.product?.product_galleries?.map((item, i) => (
            <div className="slider-image" key={i}>
              <Image
                src={item ? item?.original_url : placeHolderImage}
                className="img-fluid mx-auto"
                alt={cloneVariation?.product?.name}
                width={500}
                height={500}
                style={{
                  maxHeight: 400,
                  width: 'auto',
                }}
                unoptimized
              />
            </div>
          ))}
        </Slider>
      </div>
      <div className="thumbnail-slider">
        <Slider
          {...viewModalSliderOption}
          // slidesToShow={cloneVariation?.product?.product_galleries?.length - 1}
          slidesToShow={3}
          asNavFor={nav1}
          ref={(slider) => (slider2.current = slider)}
        >
          {cloneVariation?.product?.product_galleries?.map((item, i) => (
            <div className="slider-image" key={i}>
              <div className="thumbnail-image">
                <Image
                  src={item ? item?.original_url : placeHolderImage}
                  className="img-fluid"
                  alt={cloneVariation?.product?.name}
                  width={250}
                  height={250}
                  style={{
                    maxHeight: 110,
                    width: 'auto',
                  }}
                  unoptimized
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </Col>
  );
};

export default LeftSideModal;
