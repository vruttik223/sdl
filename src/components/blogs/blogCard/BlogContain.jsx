import React, { useContext } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RiArrowRightFill, RiTimeLine } from 'react-icons/ri';
import Btn from '@/elements/buttons/Btn';
import ThemeOptionContext from '@/helper/themeOptionsContext';
import { dateFormat } from '@/utils/customFunctions/DateFormat';
import TextLimit from '@/utils/customFunctions/TextLimit';
import { useTranslation } from '@/utils/translations';

// Safely get author display name (API may return created_by.name as string or object { uid, name, image, imageAlt })
const getAuthorDisplayName = (createdBy) => {
  const name = createdBy?.name;
  if (name == null) return '';
  if (typeof name === 'string') return name;
  return name?.name ?? '';
};

const BlogContain = ({ blog, categorySlug }) => {
  const { t } = useTranslation('common');
  const { themeOption } = useContext(ThemeOptionContext);
  const router = useRouter();
  const catSlug = categorySlug || blog?.categories?.[0]?.slug || '';
  const blogHref = catSlug ? `/blogs/${catSlug}/${blog.slug}` : `/blogs/${blog.slug}`;

  const authorName = blog?.created_by?.name || blog?.created_by?.uid || '';
  return (
    <div className="blog-contain">
      <div className="blog-label">
        <span className="time">
          <RiTimeLine />
          {dateFormat(blog?.created_at)}
        </span>
        {themeOption?.blog?.blog_author_enable && authorName && (
          <span className="super" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textTransform: 'capitalize', }}>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              {blog?.created_by?.image ? (
                <img
                  src={blog.created_by.image}
                  alt={authorName}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <span
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#e9ecef',
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#495057',
                    textTransform: 'capitalize !important',
                  }}
                  aria-hidden
                >
                  {authorName}
                </span>
              )}
            </div>
            {getAuthorDisplayName(blog?.created_by)}
          </span>
        )}
      </div>
      <Link href={blogHref}>
        <h3>{blog?.title}</h3>
      </Link>
      {/* <TextLimit value={typeof blog?.description === 'string' ? blog.description : ''} maxLength={200} tag="p" /> */}
      <p className='lc-3'>{blog.description}</p>
      <Link
        href={blogHref}
        className="blog-button btn-primary"
      >
        Read More <RiArrowRightFill />
      </Link>
    </div>
  );
};

export default BlogContain;
