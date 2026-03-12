import React, { useContext } from 'react';
import Link from 'next/link';
import ThemeOptionContext from '@/helper/themeOptionsContext';
import { dateFormat } from '@/utils/customFunctions/DateFormat';
import { RiCalendarLine, RiUserLine, RiHome3Fill } from 'react-icons/ri';

const  BlogImageDetails = ({ Blog }) => {
  const { themeOption } = useContext(ThemeOptionContext);
  return (
    <div className="blog-image-contain text-start">
      <h2 className="mb-2">{Blog?.title}</h2>
      {/** Subtitle shown below main title (uses seo_title or sub_title) */}
      {(Blog?.seo_title || Blog?.sub_title) && (
        <p className="blog-subtitle mb-0">
          {Blog?.seo_title || Blog?.sub_title}
        </p>
      )}
      {/* <nav className="d-flex justify-content-center">
        <ol className="breadcrumb mb-0 d-flex justify-content-center">
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
      </nav> */}
      {/* <ul className="contain-comment-list">
        {themeOption?.blog?.blog_author_enable && (
          <li>
            <div className="user-list">
              <RiUserLine />
              <span>{Blog?.created_by?.name}</span>
            </div>
          </li>
        )}

        <li>
          <div className="user-list">
            <RiCalendarLine />
            <span>{dateFormat(Blog?.created_at)}</span>
          </div>
        </li>
      </ul> */}
    </div>
  );
};

export default BlogImageDetails;
