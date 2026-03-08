// 'use client';
// import React, { useContext } from 'react';
// import Link from 'next/link';
// import { AccordionBody, AccordionHeader, AccordionItem } from 'reactstrap';
// import Avatar from '@/components/common/Avatar';
// import { formatDateForDateRange } from '@/utils/customFunctions/DateFormat';
// import { placeHolderImage } from '../../../data/CommonPath';
// import { useTranslation } from '@/utils/translations';
// import BlogContext from '@/helper/blogContext';

// const RecentPost = () => {
//   const { blogState } = useContext(BlogContext);
//   const { t } = useTranslation('common');
//   return (
//     <AccordionItem>
//       <AccordionHeader targetId="1">{t('RecentPost')}</AccordionHeader>
//       <AccordionBody accordionId="1" className="pt-0">
//         <div className="recent-post-box">
//           {blogState?.slice(0, 5).map((blog, index) => (
//             <div className="recent-box" key={index}>
//               <Link
//                 href={`/blogs/${blog?.slug}`}
//                 className="recent-image"
//               >
//                 <Avatar
//                   data={blog?.blog_thumbnail}
//                   placeHolder={placeHolderImage}
//                   name={blog?.blog_thumbnail?.name}
//                   width={124}
//                   height={124}
//                 />
//               </Link>

//               <div className="recent-detail">
//                 <Link href={`/blogs/${blog?.slug}`}>
//                   <h5 className="recent-name">{blog.title}</h5>
//                 </Link>
//                 <h6>{formatDateForDateRange(blog.created_at)}</h6>
//               </div>
//             </div>
//           ))}
//         </div>
//       </AccordionBody>
//     </AccordionItem>
//   );
// };

// export default RecentPost;

'use client';
import React, { useContext } from 'react';
import Link from 'next/link';
import { AccordionBody, AccordionHeader, AccordionItem } from 'reactstrap';
import Avatar from '@/components/common/Avatar';
import { formatDateForDateRange } from '@/utils/customFunctions/DateFormat';
import { placeHolderImage } from '../../../data/CommonPath';
import { useTranslation } from '@/utils/translations';
import BlogContext from '@/helper/blogContext';
import { usePathname } from 'next/navigation';

const RecentPost = ({ categorySlug }) => {
  const { recentPosts } = useContext(BlogContext);
  const { t } = useTranslation('common');
  const pathname = usePathname();

  const sourcePosts = recentPosts || [];
  const latestPosts = sourcePosts.slice(0, 3);

  // Hide "view more" button on blog listing page (/blogs/[category]), show on single blog pages
  const pathSegments = pathname.split('/').filter(Boolean);
  const isBlogListingPage = pathSegments.length === 2 && pathSegments[0] === 'blogs';

  const getBlogHref = (blog) => {
    const cat = blog?.categorySlug || blog?.categories?.[0]?.slug || categorySlug || '';
    return cat ? `/blogs/${cat}/${blog?.slug}` : `/blogs/${blog?.slug}`;
  };

  return (
    <AccordionItem>
      <AccordionHeader targetId="1">{t('RecentPost')}</AccordionHeader>

      <AccordionBody accordionId="1" className="pt-0">
        <div className="recent-post-box">
          {latestPosts?.map((blog, index) => (
            <div className="recent-box" key={index}>
              <Link href={getBlogHref(blog)} className="recent-image">
                <div className="recent-image-wrap">
                  <Avatar
                    data={blog?.blog_thumbnail}
                    placeHolder={placeHolderImage}
                    name={blog?.blog_thumbnail?.name}
                    width={124}
                    height={124}
                  />
                </div>
              </Link>

              <div className="recent-detail">
                <Link href={getBlogHref(blog)}>
                  <h5 className="recent-name">{blog.title}</h5>
                </Link>
                <h6>{formatDateForDateRange(blog.created_at)}</h6>
              </div>
            </div>
          ))}

          {/* ---- View More Button ---- */}
          {!isBlogListingPage && sourcePosts.length > 3 && (
            <div className="text-center mt-3">
              <Link href={categorySlug ? `/blogs/${categorySlug}` : '/blogs'} className="btn btn-theme-outline btn-sm">
                {t('ViewMore')}
              </Link>
            </div>
          )}
        </div>
      </AccordionBody>
    </AccordionItem>
  );
};

export default RecentPost;
