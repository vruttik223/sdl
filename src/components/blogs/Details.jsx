'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
// import Breadcrumb from '../common/Breadcrumb';
import BlogCard from './blogCard';
import Sidebar from './sidebar/Sidebar';
import WrapperComponent from '../common/WrapperComponent';
import { useBlogs } from '@/utils/hooks/useBlogs';
import { RiArticleLine } from 'react-icons/ri';

const BlogDetail = ({ categorySlug }) => {
  const searchParams = useSearchParams();
  const { data, isLoading, isError } = useBlogs({
    page: 1,
    limit: 10,
    category: categorySlug ?? '',
    tag: searchParams?.get('tag') ?? '',
  });
  const showOnlyEmpty = !isLoading && (isError || !data?.data?.length);

  // const breadcrumbTitle = categorySlug
  //   ? `Blogs:${categorySlug.replace(/-/g, ' ')}`
  //   : 'Blogs';

  if (showOnlyEmpty) {
    return (
      <>
        {/* <Breadcrumb
          title={breadcrumbTitle}
          subNavigation={[
            { name: 'Blog', link: '/blogs' },
            ...(categorySlug ? [{ name: categorySlug.replace(/-/g, ' '), link: `/blogs/${categorySlug}` }] : []),
          ]}
        /> */}
        <WrapperComponent
          classes={{ sectionClass: 'blog-section section-b-space', row: 'g-4' }}
          customCol={true}
        >
          <div className="empty-cart-box my-5">
            <div className="empty-icon">
              <RiArticleLine />
            </div>
            <h5>Currently you don&apos;t have blogs to see</h5>
            <Link
              href="/"
              className="btn btn-md theme-bg-color text-white mt-3 d-inline-block"
            >
              Go to Home
            </Link>
          </div>
        </WrapperComponent>
      </>
    );
  }

  return (
    <>
      {/* <Breadcrumb
        title={breadcrumbTitle}
        subNavigation={[
          { name: 'Blog', link: '/blogs' },
          ...(categorySlug ? [{ name: categorySlug.replace(/-/g, ' '), link: `/blogs/${categorySlug}` }] : []),
        ]}
      /> */}
      <WrapperComponent
        classes={{ sectionClass: 'blog-section section-b-space', row: 'g-4' }}
        customCol={true}
      >
        <BlogCard
          categorySlug={categorySlug}
          noSidebar={!isLoading && !data?.data?.length}
        />
        {(isLoading || data?.data?.length > 0) && (
          <Sidebar
            categorySlug={categorySlug}
            forceLoading={isLoading}
          />
        )}
      </WrapperComponent>
    </>
  );
};

export default BlogDetail;
