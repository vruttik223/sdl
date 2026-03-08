import Image from 'next/image';
import { useContext } from 'react';
import Link from 'next/link';
import { Col, Row } from 'reactstrap';
import ProductBox1 from '@/components/common/productBox/productBox1/ProductBox1';
import { placeHolderImage } from '../../../../data/CommonPath';
import { dateFormat } from '@/utils/customFunctions/DateFormat';
import ProductIdsContext from '@/helper/productIdsContext';
import BlogContext from '@/helper/blogContext';
import bannerImage from '../../../../../public/assets/images/mega-menu.png';
import banner2Image from '../../../../../public/assets/images/mega-menu2.png';
import ProductContext from '@/helper/productContext';

const MenuSlider = ({ menu }) => {
  const { filteredProduct } = useContext(ProductIdsContext);
  const { productAPIData } = useContext(ProductContext);
  const { blogState } = useContext(BlogContext);
  return (
    <>
      {menu?.slider === 'product' && (
        <Col xl={6} className="dropdown-column d-xl-block d-none">
          <div className="menu-product-slider">
            <Row>
              {(filteredProduct?.length > 0
                ? filteredProduct
                : productAPIData?.data
              )
                ?.slice(0, 2)
                ?.map((product, i) => (
                  <Col xs={6} key={i}>
                    <ProductBox1
                      imgUrl={product?.product_thumbnail}
                      productDetail={{ ...product }}
                    />
                  </Col>
                ))}
            </Row>
          </div>
        </Col>
      )}
      {menu.slider === 'banner' && (
        <Col xl={3} className="dropdown-column d-xl-block d-none">
          <div className="menu-img-banner">
            <Link
              href={`/products/deliciously-sweet-watermelon`}
              className="text-title"
            >
              <Image
                src={bannerImage}
                alt="banner"
                className="img-fluid"
                height={511}
                width={270}
              />
            </Link>
          </div>
        </Col>
      )}
      {menu.slider === 'banner_landscape' && (
        <Col xl={12} className="dropdown-column d-xl-block d-none">
          <div className="menu-img-banner rounded overflow-hidden mx-0 mt-3 mb-0">
            <Image
              src={banner2Image}
              alt="banner_landscape"
              className="img-fluid"
              height={190}
              width={954}
            />
          </div>
        </Col>
      )}
      {menu?.slider === 'blog' && (
        <Col xl={6} className="dropdown-column d-xl-block d-none">
          <Row>
            {blogState?.slice(0, 1)?.map((blog, i) => {
              const catSlug = blog?.categories?.[0]?.slug || '';
              const blogHref = catSlug ? `/blogs/${catSlug}/${blog?.slug}` : `/blogs/${blog?.slug}`;
              return (
              <Col xs={12} key={i}>
                <div className="blog-box sticky-blog">
                  <div className="blog-box-image">
                    <Link href={blogHref} className="blog-image">
                      <Image
                        src={
                          blog?.blog_thumbnail?.original_url
                            ? blog.blog_thumbnail.original_url
                            : placeHolderImage
                        }
                        className="img-fluid"
                        alt={blog.title}
                        height={299}
                        width={398}
                        unoptimized
                      />
                    </Link>
                  </div>
                  <Link href={blogHref} className="blog-detail">
                    <h6>{dateFormat(blog.created_at)}</h6>
                    <h5>{blog?.title}</h5>
                  </Link>
                </div>
              </Col>
            );
            })}
          </Row>
        </Col>
      )}
    </>
  );
};

export default MenuSlider;
