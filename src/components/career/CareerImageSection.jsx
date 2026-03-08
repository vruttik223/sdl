'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Slider from 'react-slick';
import { RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri';
import { latestBlogSlider } from '@/data/SliderSettings';
import CustomHeading from '@/components/common/CustomHeading';
import { LeafSVG } from '@/components/common/CommonSVG';
import styles from './CareerImageSection.module.scss';

const galleryItems = [
  {
    id: 1,
    image: '/assets/images/career/careerpagehero.png',
  },
  {
    id: 2,
    image: '/assets/images/career/culture.png',
  },
  {
    id: 3,
    image: '/assets/images/career/equality.png',
  },
  {
    id: 4,
    image: '/assets/images/career/careerpagehero.png',
  },
  {
    id: 5,
    image: '/assets/images/career/equality.png',
  },
  {
    id: 6,
    image: '/assets/images/career/balance.jpg',
  },
];

const sliderConfig = {
  ...latestBlogSlider,
  arrows: false,
  infinite: false,
  slidesToShow: 4,
  responsive: [
    { breakpoint: 1400, settings: { slidesToShow: 3 } },
    // { breakpoint: 1200, settings: { slidesToShow: 3 } },
    { breakpoint: 1024, settings: { slidesToShow: 3 } },
    { breakpoint: 876, settings: { slidesToShow: 2 } },
    { breakpoint: 576, settings: { slidesToShow: 1 } },
  ],
};

const CareerImageSection = () => {
  const sliderRef = useRef(null);

  return (
    <section className={`${styles.section} related-blogs-section section-lg-space`}>
      <div className="container-fluid-lg">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 title mb-3 mb-md-4">
          <CustomHeading
            customClass="mb-0"
            title="Life at Shree Doothpappeshwar"
            subTitle="Glimpses from our workplace and teams"
            svgUrl={<LeafSVG className="icon-width" />}
          />
          {/* Desktop: nav buttons in title row */}
          <div className={`d-none d-md-flex align-items-center gap-2 ${styles.navButtons}`}>
            <button
              type="button"
              className="slider-nav-btn"
              onClick={() => sliderRef.current?.slickPrev()}
              aria-label="Previous"
            >
              <RiArrowLeftLine />
            </button>
            <button
              type="button"
              className="slider-nav-btn"
              onClick={() => sliderRef.current?.slickNext()}
              aria-label="Next"
            >
              <RiArrowRightLine />
            </button>
          </div>
        </div>

        <div className={styles.sliderWrapper}>
          <Slider ref={sliderRef} {...sliderConfig}>
            {galleryItems.map((item) => (
              <div key={item.id} className='h-100'>
                  <div className={`${styles.card} h-100`}>
                  <div className={`${styles.cardImageWrapper} h-100`}>
                    <Image
                      src={item.image}
                      alt="Career gallery"
                      width={600}
                      height={400}
                      className={styles.cardImage}
                    />
                  </div>
                </div>
              </div>
            ))}
          </Slider>
          {/* Mobile: nav buttons below dots */}
          {/* <div className={`d-flex d-md-none align-items-center justify-content-center gap-2 mt-3 ${styles.navButtons}`}>
            <button
              type="button"
              className="slider-nav-btn"
              onClick={() => sliderRef.current?.slickPrev()}
              aria-label="Previous"
            >
              <RiArrowLeftLine />
            </button>
            <button
              type="button"
              className="slider-nav-btn"
              onClick={() => sliderRef.current?.slickNext()}
              aria-label="Next"
            >
              <RiArrowRightLine />
            </button>
          </div> */}
          {/* Mobile: nav buttons on left/right edges */}
<button
  type="button"
  className={`d-flex d-md-none slider-nav-btn ${styles.navButtonLeft}`}
  onClick={() => sliderRef.current?.slickPrev()}
  aria-label="Previous"
>
  <RiArrowLeftLine />
</button>

<button
  type="button"
  className={`d-flex d-md-none slider-nav-btn ${styles.navButtonRight}`}
  onClick={() => sliderRef.current?.slickNext()}
  aria-label="Next"
>
  <RiArrowRightLine />
</button>
        </div>
      </div>
    </section>
  );
};

export default CareerImageSection;

