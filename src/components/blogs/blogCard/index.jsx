import React, { useContext, useCallback } from 'react';
import ThemeOptionContext from '@/helper/themeOptionsContext';
import { Col, Row } from 'reactstrap';
import Link from 'next/link';
import { RiArticleLine } from 'react-icons/ri';
import BlogCardContain from './BlogCard';
import Pagination from '@/components/common/Pagination';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslation } from '@/utils/translations';
import BlogSkeletonComponent from './BlogSkeletonComponent';
import SkSearchBar from '@/components/common/skeletonLoader/SkSearchBar';
import { useBlogs } from '@/utils/hooks/useBlogs';
import CommonSearchBar from '@/components/common/CommonSearchBar';
import { fetchBlogSuggestions } from '@/api/blog.api';

const BlogCard = ({ categorySlug, noSidebar = false }) => {
  const { themeOption } = useContext(ThemeOptionContext);
  const { t } = useTranslation('common');
  const searchParams = useSearchParams();
  const router = useRouter();
  const querySearchTag = searchParams?.get('tag');
  const querySearch = searchParams?.get('search') ?? '';
  const queryBoxStyle = searchParams?.get('style');
  const querySidebar = searchParams?.get('sidebar');

  // Read page from URL (same as Press page) so pagination clicks update data
  const rawPage = Number(searchParams?.get('page'));
  const currentPage =
    Number.isFinite(rawPage) && Number.isInteger(rawPage) && rawPage > 0
      ? rawPage
      : 1;
  // Force list_view and right_sidebar as defaults when no query params are present
  // Query params can still override if needed
  const finalBoxStyle = queryBoxStyle || 'list_view';
  const finalSidebarStyle = noSidebar ? 'no_sidebar' : (querySidebar || 'right_sidebar');
  const styleObj = {
    no_sidebar: { colClass: { xxl: 12, xl: 12, lg: 12 } },
    left_sidebar: { class: 'order-lg-2', colClass: { xxl: 9, xl: 8, lg: 7 } },
    right_sidebar: { colClass: { xxl: 9, xl: 8, lg: 7 } },
    list_view: { class: 'blog-list', colClass: { xs: 12 } },
    grid_view: { colClass: { xxl: 4, sm: 6 } },
  };
  const { data: BlogData, isLoading, isError } = useBlogs({
    page: currentPage,
    limit: 10,
    category: categorySlug ?? '',
    tag: querySearchTag ?? '',
    search: querySearch,
  });

  const hasNoBlogs = !isLoading && (isError || !BlogData?.data?.length);

  const updateURL = useCallback(
    (params) => {
      const newParams = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([key, value]) => {
        if (value != null && value !== '') {
          newParams.set(key, value);
        } else {
          newParams.delete(key);
        }
      });
      const base = categorySlug ? `/blogs/${categorySlug}` : '/blogs';
      const qs = newParams.toString();
      router.push(qs ? `${base}?${qs}` : base, { scroll: false });
    },
    [searchParams, router, categorySlug]
  );

  const handleBlogSearch = useCallback(
    (query) => {
      updateURL({ search: query, page: 1 });
    },
    [updateURL]
  );

  const slugify = useCallback((s) => {
    if (!s) return '';
    return String(s)
      .trim()
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  }, []);

  const transformBlogResult = useCallback(
    (blog) => ({
      id: blog.uid,
      title: blog.title,
      subtitle: blog.blogCategory?.name || '',
      slug: blog.slug,
      categorySlug: blog.blogCategory?.slug || slugify(blog.blogCategory?.name) || 'blog',
      searchableFields: ['title', 'subtitle'],
    }),
    [slugify]
  );

  const handleSelectBlog = useCallback(
    (item) => {
      if (item?.slug) {
        const catSlug = item.categorySlug || 'blog';
        router.push(`/blogs/${catSlug}/${item.slug}`, { scroll: false });
      }
    },
    [router]
  );

  if (hasNoBlogs) {
    return (
      <Col xs={12}>
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
      </Col>
    );
  }

  return (
    <>
      {/* Full-width blog heading + search (col 12) */}
      <Col xs={12}>
        <div className="events-header text-center">
          <h1 className="events-title">Discover Our Blogs</h1>
          <p className="events-subtitle">
            Explore insights, stories, and guides on Ayurveda, wellness, and healthy living.
          </p>
        </div>

        {isLoading ? (
          <SkSearchBar />
        ) : (
          <CommonSearchBar
            storageKey="recent_blog_searches"
            placeholderWords={['Ayurveda tips', 'Wellness articles', 'Health guides']}
            searchLabel="Search blogs"
            enableFuzzyMatch={true}
            autoSearch={false}
            fetchResults={fetchBlogSuggestions}
            transformResults={transformBlogResult}
            onSearch={handleBlogSearch}
            onSelectItem={handleSelectBlog}
            initialValue={querySearch}
          />
        )}
      </Col>

      {/* Blog listing column (respects sidebar layout) */}
      <Col
        {...styleObj[finalSidebarStyle]?.colClass}
        className={styleObj[finalSidebarStyle]?.class || ''}
      >
        {isLoading ? (
          <BlogSkeletonComponent boxStyle={finalBoxStyle} />
        ) : (
          <Row className={`g-4 `}>
            {BlogData?.data?.map((blog, i) => (
              <Col
                {...styleObj[finalBoxStyle]?.colClass}
                key={i}
              >
                <div
                  // className={`blog-box ${blog?.is_sticky === 1 ? 'sticky-blog-box' : ''} ${styleObj[finalBoxStyle]?.class}`}
                  className={`blog-box ${styleObj[finalBoxStyle]?.class}`}
                >
                  {/* {blog?.is_featured ? (
                    <div className="blog-label-tag">
                      <span>{t('Featured')}</span>
                    </div>
                  ) : null} */}
                  <BlogCardContain blog={blog} categorySlug={categorySlug} />
                </div>
              </Col>
            ))}
          </Row>
        )}
        {BlogData?.data?.length > 0 && (
          <nav className="custome-pagination">
            <Pagination
              total={BlogData?.total ?? 0}
              perPage={BlogData?.per_page ?? 10}
            />
          </nav>
        )}
      </Col>
    </>
  );
};

export default BlogCard;
