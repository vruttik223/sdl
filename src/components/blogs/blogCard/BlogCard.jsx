import { useContext } from 'react';
import Link from 'next/link';
import RatioImage from '@/utils/RatioImage';
import BlogContain from './BlogContain';
import { placeHolderImage } from '../../../data/CommonPath';
import Image from 'next/image';

const BlogCardContain = ({ blog, categorySlug }) => {
  const catSlug = categorySlug || blog?.categories?.[0]?.slug || '';
  const blogHref = catSlug ? `/blogs/${catSlug}/${blog.slug}` : `/blogs/${blog.slug}`;
  return (
    <>
      <div className="blog-image">
        <Link href={blogHref}>
          <Image
            src={blog?.blog_thumbnail?.original_url || placeHolderImage}
            alt="blog-image"
            height={244}
            width={490}
            unoptimized
          />
        </Link>
      </div>
      <BlogContain blog={blog} categorySlug={categorySlug} />
    </>
  );
};

export default BlogCardContain;
