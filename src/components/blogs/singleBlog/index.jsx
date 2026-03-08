'use client';
import { useRef, useState, useMemo } from 'react';
import { Row } from 'reactstrap';
import Link from 'next/link';
import Sidebar from '../sidebar/Sidebar';
import BlogCardDetails from '../BlogCardDetails';
import WrapperComponent from '@/components/common/WrapperComponent';
import RelatedProduct from '@/components/productDetails/common/RelatedProduct';
import FeatureBlog from '@/components/parisTheme/FeatureBlog';
import { latestBlogSlider } from '@/data/SliderSettings';
import CustomHeading from '@/components/common/CustomHeading';
import { LeafSVG } from '@/components/common/CommonSVG';
import { RiArrowLeftLine, RiArrowRightLine, RiArticleLine, RiHome3Fill } from 'react-icons/ri';
import Btn from '@/elements/buttons/Btn';
import { useBlog } from '@/utils/hooks/useBlog';
import SkSingleBlog from '@/components/common/skeletonLoader/blogSkeleton/SkSingleBlog';
import fallbackProductsData from '@/app/api/product/product.json';

const SingleBlog = ({ categorySlug, blogSlug }) => {
  const { data, isLoading, isError } = useBlog(blogSlug);
  const Blog = data?.blog;
  const rawBlog = data?.raw?.data?.blog;
  const hasNoBlog = !isLoading && (isError || !Blog?.slug);
  // Show only API quantity: exclude current blog and dedupe by id
  const relatedBlogs = (data?.relatedBlogs || [])
    .filter((b) => b.slug !== blogSlug && b.id !== Blog?.id)
    .filter((b, i, arr) => arr.findIndex((x) => x.id === b.id) === i);

  const sliderRef = useRef(null);
  // Disable infinite so react-slick doesn't clone slides and repeat the same blogs; show 4 per row
  const blogSliderConfig = {
    ...latestBlogSlider,
    arrows: false,
    infinite: false,
    slidesToShow: 4,
    responsive: [
      // Keep 4 visible on typical laptops; drop to 3 below lg
      { breakpoint: 1200, settings: { slidesToShow: 4 } },
      { breakpoint: 992, settings: { slidesToShow: 3 } },
      { breakpoint: 876, settings: { slidesToShow: 2 } },
      { breakpoint: 576, settings: { slidesToShow: 1 } },
    ],
  };

  // Use local product.json file instead of API data
  const blogProducts = useMemo(() => {
    const products = Array.isArray(fallbackProductsData?.data)
      ? fallbackProductsData.data
      : [];
    // Dedupe by id and return up to 8 products
    return products
      .filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i)
      .slice(0, 8);
  }, []);
  
  const sidebarType = 'right_sidebar';

  const [selectedVideo, setSelectedVideo] = useState(null);

  const getYouTubeEmbedUrl = (videoId) =>
    `https://www.youtube.com/embed/${videoId}?autoplay=1`;

  if (isLoading) {
    return (
      <WrapperComponent
        classes={{ sectionClass: 'blog-section section-b-space', row: 'g-4' }}
        customCol={true}
      >
        <SkSingleBlog sidebarType={sidebarType} />
        <Sidebar categorySlug={categorySlug} sidebarType={sidebarType} forceLoading />
      </WrapperComponent>
    );
  }

  if (hasNoBlog) {
    return (
      <WrapperComponent
        classes={{ sectionClass: 'blog-section section-b-space', row: 'g-4' }}
        customCol={true}
      >
        <div className="empty-cart-box my-5">
          <div className="empty-icon">
            <RiArticleLine />
          </div>
          <h5>This blog could not be found or failed to load.</h5>
          <Link
            href={categorySlug ? `/blogs/${categorySlug}` : '/blogs'}
            className="btn btn-md theme-bg-color text-white mt-3 d-inline-block"
          >
            Back to Blogs
          </Link>
        </div>
      </WrapperComponent>
    );
  }

  return (
    <>
      {/* <Breadcrumb
        title={Blog?.title}
        subNavigation={[
          { name: 'Blogs', link: '/blogs' },
          { name: Blog?.title },
        ]}
        bgImage="/assets/images/A7.webp"
      /> */}
      <WrapperComponent
        classes={{ sectionClass: 'blog-section section-b-space', row: 'g-4' }}
        customCol={true}
      >
         <nav className="d-flex mt-2">
        <ol className="breadcrumb mb-0 d-flex">
          <li className="breadcrumb-item">
            <Link href="/">
              <RiHome3Fill />
            </Link>
          </li>
          <li className="breadcrumb-item">
            <Link href="/blogs">Blogs</Link>
          </li>
          <li className="breadcrumb-item">
            <Link href={Blog?.categories?.[0]?.slug ? `/blogs/${Blog.categories[0].slug}` : '/blogs'} className="text-capitalize">
              {Blog?.categories?.[0]?.name || 'Blog'}
            </Link>
          </li>
          <li className="breadcrumb-item active text-capitalize">
            {Blog?.title}
          </li>
        </ol>
      </nav>
        <BlogCardDetails
          Blog={Blog}
          rawBlog={rawBlog}
          categorySlug={categorySlug}
          key={blogSlug}
          sidebarType={sidebarType}
          onVideoSelect={setSelectedVideo}
        />
        <Sidebar categorySlug={categorySlug} sidebarType={sidebarType} />

        
      </WrapperComponent>

      {selectedVideo?.videoId && (
        <div
          className="video-modal"
          onClick={() => setSelectedVideo(null)}
          style={{ zIndex: 10000 }}
        >
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="video-modal-close"
              onClick={() => setSelectedVideo(null)}
              aria-label="Close"
              style={{
                position: 'absolute',
                top: '-50px',
                right: '0',
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '48px',
                cursor: 'pointer',
                width: '48px',
                height: '48px',
                lineHeight: '1',
                padding: '0',
                zIndex: 10001,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ×
            </button>
            <div className="video-wrapper">
              <iframe
                src={getYouTubeEmbedUrl(selectedVideo.videoId)}
                title={selectedVideo.title}
                // frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="video-iframe"
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Blog Slider Section - uses relatedBlogs/recentPosts from detail API */}
      {relatedBlogs.length > 0 && (
        <WrapperComponent
          classes={{ sectionClass: 'related-blogs-section section-lg-space' }}
          noRowCol
        >
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 title">
            <CustomHeading
              customClass="mb-0"
              title="Related Blogs"
              subTitle="Explore More Blogs"
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
          <div className="position-relative">
            <Row>
              <FeatureBlog
                classes={{ 
                  sliderClass: 'col-12', 
                  sliderOption: blogSliderConfig 
                }}
                sliderRef={sliderRef}
                blogs={relatedBlogs}
              />
            </Row>
            <button
              type="button"
              className="d-flex d-md-none slider-nav-btn position-absolute top-50 start-0 translate-middle-y"
              onClick={() => sliderRef.current?.slickPrev()}
              aria-label="Previous"
            >
              <RiArrowLeftLine />
            </button>
            <button
              type="button"
              className="d-flex d-md-none slider-nav-btn position-absolute top-50 end-0 translate-middle-y"
              onClick={() => sliderRef.current?.slickNext()}
              aria-label="Next"
            >
              <RiArrowRightLine />
            </button>
          </div>
          <div className="d-flex justify-content-center mt-4">
            <Link href={categorySlug ? `/blogs/${categorySlug}` : '/blogs'}>
              <Btn color="primary" size="md" className="">
                View More
              </Btn>
            </Link>
          </div>
        </WrapperComponent>
      )}

      {blogProducts.length > 0 && (
        <RelatedProduct productData={blogProducts} />
      )}
    </>
  );
};

export default SingleBlog;
