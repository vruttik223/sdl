import React, { useContext, useMemo } from 'react';
import Slider from 'react-slick';
import RatioImage from '@/utils/RatioImage';
import Link from 'next/link';
import { dateFormat } from '@/utils/customFunctions/DateFormat';
import { useTranslation } from '@/utils/translations';
import BlogContext from '@/helper/blogContext';

const FeatureBlog = ({ classes = {}, dataAPI, blogs: blogsProp, sliderRef }) => {
  const { t } = useTranslation('common');
  const { blogState } = useContext(BlogContext);

  const filterBlogs = useMemo(() => {
    if (blogsProp && blogsProp.length > 0) {
      return blogsProp;
    }
    if (dataAPI) {
      return blogState?.filter((el) => dataAPI?.blog_ids.includes(el.id)) || [];
    }
    return blogState || [];
  }, [blogState, dataAPI, blogsProp]);

  // When blogs come from props (e.g. relatedBlogs from API), show full API quantity; else limit to 5
  const sliderBlogs = useMemo(() => {
    if (!filterBlogs) return [];
    if (blogsProp?.length) return filterBlogs;
    return filterBlogs.slice(0, 5);
  }, [filterBlogs, blogsProp]);
  return (
    <div className={classes?.sliderClass ? classes?.sliderClass : ''}>
      <Slider ref={sliderRef} {...classes?.sliderOption}>
        {sliderBlogs?.map((elem) => {
          const catSlug = elem?.categories?.[0]?.slug || elem?.categorySlug || '';
          const blogHref = catSlug ? `/blogs/${catSlug}/${elem?.slug}` : `/blogs/${elem?.slug}`;
          return (
          <div key={elem.id}>
            <div
              className={`blog-box ${classes?.ratioClass ? classes?.ratioClass : ''}`}
            >
              {/* {elem?.is_featured ? (
                <div className="blog-label-tag">
                  <span>{t('Featured')}</span>
                </div>
              ) : null} */}
              <div className="blog-box-image">
                <Link href={blogHref} className="blog-image">
                  <RatioImage
                    src={elem?.blog_thumbnail?.original_url}
                    className="bg-img"
                    alt="blog"
                    height={classes?.height}
                    width={classes?.width}
                  />
                </Link>
              </div>

              <Link href={blogHref} className="blog-detail">
                <h6>{dateFormat(elem?.created_at)}</h6>
                <h5>{elem?.title}</h5>
              </Link>
            </div>
          </div>
        );
        })}
      </Slider>
    </div>
  );
};

export default FeatureBlog;
