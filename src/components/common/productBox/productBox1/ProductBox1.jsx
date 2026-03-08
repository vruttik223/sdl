import React, { useMemo } from 'react';
import Link from 'next/link';
import { RiStarFill } from 'react-icons/ri';
import ProductBoxAction from './ProductBox1Action';
import ProductBox1Cart from './ProductBox1Cart';
import ProductBox1Rating from './ProductBox1Rating';
import Avatar from '../../Avatar';
import { placeHolderImage } from '../../../../data/CommonPath';
import ProductBagde from './ProductBagde';
import { ModifyString } from '@/utils/customFunctions/ModifyString';
import AddToWishlistNew from '../AddToWishlistNew';
import { convertToRupees, formatReviewCount } from '@/utils/helpers';

const ProductBox1 = ({
  imgUrl,
  productDetail,
  isClose,
  addAction = true,
  classObj,
  onRemoveClick,
}) => {
  const displayPrices = useMemo(() => {
    const variations = productDetail?.variations;
    if (
      productDetail?.type === 'classified' &&
      Array.isArray(variations) &&
      variations.length > 0
    ) {
      const inStock = variations.filter((v) => v.stock_status === 'in_stock');
      const pool = inStock.length > 0 ? inStock : variations;
      const cheapest = pool.reduce((min, v) => {
        const p = v.sale_price ?? v.price ?? Infinity;
        const mp = min.sale_price ?? min.price ?? Infinity;
        return p < mp ? v : min;
      }, pool[0]);
      return {
        salePrice: cheapest.sale_price ?? cheapest.price,
        price: cheapest.price,
        discount: cheapest.discount ?? productDetail?.discount,
      };
    }
    return {
      salePrice: productDetail?.sale_price,
      price: productDetail?.price,
      discount: productDetail?.discount,
    };
  }, [productDetail]);

  // Get rating and review count from product data
  const ratingData = useMemo(() => {
    return {
      rating: productDetail?.rating ?? 4.7,
      reviewCount: productDetail?.rating_count ?? 0,
    };
  }, [productDetail]);

  // console.log({ productDetail });

  return (
    <div
      className={`product-box d-flex flex-column h-100 ${classObj?.productBoxClass} p-0`}
    >
      <ProductBagde productDetail={productDetail} />
      {/* {isClose && (
        <div className="product-header-top" onClick={handleRemoveClick}>
          <Btn className="wishlist-button close_button">
            <RiCloseLine />
          </Btn>
        </div>
      )} */}
      <div className="product-image">
        <Link
          className="d-block h-100 w-100"
          href={`/products/${productDetail?.slug}`}
          title={productDetail?.name}
        >
          <Avatar
            data={imgUrl}
            placeHolder={productDetail.product_thumbnail ?? placeHolderImage}
            customClass={'img-fluid h-100'}
            name={productDetail.name}
            height={500}
            width={500}
          />
        </Link>
        <AddToWishlistNew
          productObj={productDetail}
          isActive={isClose}
          onRemoveClick={onRemoveClick}
        />
        {/* <ProductBoxAction
          productObj={productDetail}
          listClass="product-option"
        /> */}
      </div>
      <div className="product-detail">
        <div className="product-detail--wrapper">
          <Link
            title={productDetail.name}
            href={`/products/${productDetail?.slug}`}
            className="name"
          >
            {productDetail.name}
          </Link>
          <div className="product-detail-bottom">
            {productDetail?.unit &&
              productDetail?.weight &&
              productDetail?.stock_status && (
                <>
                  <div className="meta-1">
                    <div className="">
                      <h6 className="unit">
                        {productDetail?.weight}
                        {productDetail?.unit}
                      </h6>
                      <span
                        className={`${productDetail?.stock_status === 'out_of_stock' ? 'out_of_stock-color' : 'in_stock-color'}`}
                      >
                        {ModifyString(productDetail.stock_status, false, '_')}
                      </span>
                    </div>
                    <div className="">
                      <div className="rating-section">
                        <span className="stars">
                          <RiStarFill size={14} />
                        </span>
                        <span className="review-count">
                          <span className="count">
                            {ratingData.rating.toFixed(1)}
                          </span>{' '}
                          ({`${formatReviewCount(ratingData.reviewCount)}`})
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="price-row">
                    <div className="disc-price">
                      {convertToRupees(displayPrices.salePrice)}
                    </div>
                    <div className="selling-price">
                      {convertToRupees(displayPrices.price)}
                    </div>
                    <div className="percent-off">
                      {displayPrices.discount
                        ? `${displayPrices.discount}% Off`
                        : null}
                    </div>
                  </div>
                </>
              )}

            {addAction && <ProductBox1Cart productObj={productDetail} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductBox1;
