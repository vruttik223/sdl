'use client';

import React, { useState, useCallback } from 'react';
import { Col, Row } from 'reactstrap';
import WrapperComponent from '@/components/common/WrapperComponent';
import CustomHeading from '@/components/common/CustomHeading';
import { LeafSVG } from '@/components/common/CommonSVG';
import UGCCard from './ugc/UGCCard';
import UGCVideoOverlay from './ugc/UGCVideoOverlay';

/**
 * Dummy UGC data — replace with API-driven data later.
 * Each item follows the shape expected by <UGCCard />.
 */
const UGC_DATA = [
  {
    name: 'Priya Sharma',
    handle: 'priyasharma',
    views: 2300,
    thumbnailUrl: '/assets/images/inner-page/user/1.jpg',
    videoUrl: '/assets/uploads/medicine-video.mp4',
    rating: 5,
    review:
      "Best thing I've added to my morning routine in years. My energy levels are incredible now.",
    product: {
      id: 101,
      name: 'Swamala Classic',
      product_thumbnail: '/assets/images/product/WhatsApp Image test.jpeg',
      sale_price: 1372.5,
      price: 1525,
      stock_status: 'in_stock',
      type: 'simple',
    },
  },
  {
    name: 'Brijmohan Das',
    handle: 'brijmohandas',
    views: 2300,
    thumbnailUrl: '/assets/images/inner-page/user/3.jpg',
    videoUrl: '/assets/uploads/medicine-video.mp4',
    rating: 5,
    review:
      "Best thing I've added to my morning routine in years. My energy levels are incredible now.",
    product: {
      id: 102,
      name: 'Maha Swarna Brahma Yog',
      product_thumbnail: '/assets/images/product/Maha-Swarna-Brahma-Yog.webp',
      sale_price: 1372.5,
      price: 1525,
      stock_status: 'in_stock',
      type: 'simple',
    },
  },
  {
    name: 'Preeti Desai',
    handle: 'preetidesai',
    views: 2500,
    thumbnailUrl: '/assets/images/inner-page/user/4.jpg',
    videoUrl: '/assets/uploads/medicine-video.mp4',
    rating: 5,
    review:
      "Best thing I've added to my morning routine in years. My energy levels are incredible now.",
    product: {
      id: 101,
      name: 'Swamala Classic',
      product_thumbnail: '/assets/images/product/WhatsApp Image test.jpeg',
      sale_price: 1372.5,
      price: 1525,
      stock_status: 'in_stock',
      type: 'simple',
    },
  },
  {
    name: 'Vijayraj Patil',
    handle: 'vijayraj',
    views: 1800,
    thumbnailUrl: '/assets/images/inner-page/user/5.jpg',
    videoUrl: '/assets/uploads/medicine-video.mp4',
    rating: 5,
    review:
      "Best thing I've added to my morning routine in years. My energy levels are incredible now.",
    product: {
      id: 103,
      name: 'Hingawashtak Choorna',
      product_thumbnail: '/assets/images/product/Hingwashtak_Choorna.webp',
      sale_price: 1372.5,
      price: 1525,
      stock_status: 'in_stock',
      type: 'simple',
    },
  },
];

const UGCContent = () => {
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  const handlePlay = useCallback((index) => {
    setActiveVideoIndex(index);
    setOverlayOpen(true);
  }, []);

  const handleCloseOverlay = useCallback(() => {
    setOverlayOpen(false);
  }, []);

  return (
    <>
      <WrapperComponent
        classes={{ sectionClass: 'ugc-section' }}
        noRowCol={true}
      >
        <Row>
          <Col>
            <CustomHeading
              customClass="mb-0"
              title="See What Our Customers Have To Say"
              subTitle="Explore What Our Customers Say"
              svgUrl={<LeafSVG className="icon-width" />}
            />
          </Col>
        </Row>

        <Row className="g-sm-4 g-3 ugc-grid">
          {UGC_DATA.map((item, idx) => (
            <Col key={idx} xl={3} lg={4} md={6} sm={6} xs={12}>
              <UGCCard data={item} index={idx} onPlay={handlePlay} />
            </Col>
          ))}
        </Row>
      </WrapperComponent>

      {overlayOpen && (
        <UGCVideoOverlay
          videos={UGC_DATA}
          activeIndex={activeVideoIndex}
          onClose={handleCloseOverlay}
        />
      )}
    </>
  );
};

export default UGCContent