'use client';

import { useRef } from 'react';
import { Row } from 'reactstrap';
import Link from 'next/link';
import WrapperComponent from '@/components/common/WrapperComponent';
import FeatureBlog from '@/components/parisTheme/FeatureBlog';
import { latestBlogSlider } from '@/data/SliderSettings';
import CustomHeading from '@/components/common/CustomHeading';
import { LeafSVG } from '@/components/common/CommonSVG';
import { RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri';
import Btn from '@/elements/buttons/Btn';

// Dummy blog data
const DUMMY_BLOGS = [
  {
    id: 1,
    title: 'The Benefits of Ayurvedic Medicine in Modern Healthcare',
    slug: 'benefits-ayurvedic-medicine-modern-healthcare',
    blog_thumbnail: {
      original_url: '/assets/images/inner-page/blog/1.jpg',
    },
    created_at: '2024-01-15T10:30:00Z',
    // is_sticky: 0,
    is_featured: 1,
    categories: [
      {
        name: 'Health & Wellness',
        slug: 'health-wellness',
      },
    ],
  },
  {
    id: 2,
    title: 'Understanding Dosha: A Complete Guide to Your Body Type',
    slug: 'understanding-dosha-guide-body-type',
    blog_thumbnail: {
      original_url: '/assets/images/inner-page/blog/2.jpg',
    },
    created_at: '2024-01-20T14:45:00Z',
    // is_sticky: 0,
    is_featured: 0,
    categories: [
      {
        name: 'Ayurveda Basics',
        slug: 'ayurveda-basics',
      },
    ],
  },
  {
    id: 3,
    title: 'Top 10 Ayurvedic Herbs for Immunity Boosting',
    slug: 'top-10-ayurvedic-herbs-immunity-boosting',
    blog_thumbnail: {
      original_url: '/assets/images/inner-page/blog/3.jpg',
    },
    created_at: '2024-01-25T09:15:00Z',
    // is_sticky: 1,
    is_featured: 1,
    categories: [
      {
        name: 'Herbal Medicine',
        slug: 'herbal-medicine',
      },
    ],
  },
  {
    id: 4,
    title: 'Ayurvedic Diet: Foods for Balance and Wellness',
    slug: 'ayurvedic-diet-foods-balance-wellness',
    blog_thumbnail: {
      original_url: '/assets/images/inner-page/blog/4.jpg',
    },
    created_at: '2024-02-01T11:20:00Z',
    // is_sticky: 0,
    is_featured: 0,
    categories: [
      {
        name: 'Nutrition',
        slug: 'nutrition',
      },
    ],
  },
  {
    id: 5,
    title: 'Stress Management Through Ayurvedic Practices',
    slug: 'stress-management-ayurvedic-practices',
    blog_thumbnail: {
      original_url: '/assets/images/inner-page/blog/5.jpg',
    },
    created_at: '2024-02-05T16:30:00Z',
    // is_sticky: 0,
    is_featured: 1,
    categories: [
      {
        name: 'Mental Health',
        slug: 'mental-health',
      },
    ],
  },
  {
    id: 6,
    title: 'The Power of Turmeric in Ayurvedic Medicine',
    slug: 'power-turmeric-ayurvedic-medicine',
    blog_thumbnail: {
      original_url: '/assets/images/inner-page/blog/6.jpg',
    },
    created_at: '2024-02-10T13:00:00Z',
    // is_sticky: 0,
    is_featured: 0,
    categories: [
      {
        name: 'Herbal Medicine',
        slug: 'herbal-medicine',
      },
    ],
  },
  {
    id: 7,
    title: 'Ayurvedic Skincare: Natural Beauty from Within',
    slug: 'ayurvedic-skincare-natural-beauty-within',
    blog_thumbnail: {
      original_url: '/assets/images/inner-page/blog/7.jpg',
    },
    created_at: '2024-02-15T10:45:00Z',
    // is_sticky: 0,
    is_featured: 1,
    categories: [
      {
        name: 'Beauty & Wellness',
        slug: 'beauty-wellness',
      },
    ],
  },
  {
    id: 8,
    title: 'Seasonal Routines: Living in Harmony with Nature',
    slug: 'seasonal-routines-harmony-nature',
    blog_thumbnail: {
      original_url: '/assets/images/inner-page/blog/8.jpg',
    },
    created_at: '2024-02-20T08:30:00Z',
    // is_sticky: 0,
    is_featured: 0,
    categories: [
      {
        name: 'Lifestyle',
        slug: 'lifestyle',
      },
    ],
  },
];

const HomeBlogs = () => {
  const sliderRef = useRef(null);

  // Blog slider configuration
  const blogSliderConfig = {
    ...latestBlogSlider,
    arrows: false,
    infinite: false,
    slidesToShow: 4,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 4 } },
      { breakpoint: 992, settings: { slidesToShow: 3 } },
      { breakpoint: 876, settings: { slidesToShow: 2 } },
      { breakpoint: 576, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <WrapperComponent
      classes={{ sectionClass: 'home-blogs-section section-lg-space' }}
      noRowCol
    >
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 title">
        <CustomHeading
          customClass="mb-0"
          title="Latest Blogs"
          subTitle="Explore Our Insights"
          svgUrl={<LeafSVG className="icon-width" />}
        />
        <div className="d-none d-md-flex align-items-center gap-2">
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
      <Row>
        <FeatureBlog
          classes={{
            sliderClass: 'col-12',
            sliderOption: blogSliderConfig,
          }}
          sliderRef={sliderRef}
          blogs={DUMMY_BLOGS}
        />
      </Row>
      <div className="d-flex d-md-none align-items-center justify-content-center gap-2 mt-3">
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
      <div className="d-flex justify-content-center mt-4">
        <Link href="/blogs">
          <Btn color="primary" size="md">
            View More
          </Btn>
        </Link>
      </div>
    </WrapperComponent>
  );
};

export default HomeBlogs;
