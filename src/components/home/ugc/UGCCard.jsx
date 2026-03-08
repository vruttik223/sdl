'use client';

import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { RiPlayCircleFill, RiAddLine, RiSubtractLine } from 'react-icons/ri';
import CartContext from '@/helper/cartContext';
import VariationModal from '@/components/common/productBox/productBox1/variationModal/index';
import UGCStarRating from './UGCStarRating';
import { formatReviewCount } from '@/utils/helpers';

/**
 * Individual UGC card component.
 *
 * Props:
 *  - data: { name, handle, views, thumbnailUrl, videoUrl, rating, product, review }
 *    product: { id, name, product_thumbnail, sale_price, price, stock_status, type }
 *  - onPlay: (index) => void — called when play button is clicked
 *  - index: number
 */
const UGCCard = ({ data, onPlay, index }) => {
  const { cartProducts, handleIncDec } = useContext(CartContext);
  const [variationModal, setVariationModal] = useState('');
  const [productQty, setProductQty] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const videoRef = useRef(null);

  const productObj = data?.product;

  // Play/pause based on viewport visibility (≥50% visible)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const getSelectedVariant = useMemo(() => {
    return cartProducts.find((elem) => elem.product_id === productObj?.id);
  }, [cartProducts, productObj?.id]);

  useEffect(() => {
    if (!productObj) return;
    if (cartProducts.length > 0) {
      const foundProduct = cartProducts.find(
        (elem) => elem.product_id === productObj.id
      );
      if (foundProduct) {
        setIsOpen(true);
        setProductQty(foundProduct.quantity);
      } else {
        setProductQty(0);
        setIsOpen(false);
      }
    } else {
      setProductQty(0);
      setIsOpen(false);
    }
  }, [cartProducts, productObj]);

  const handleAddToCart = () => {
    if (productObj?.stock_status === 'in_stock') {
      if (productObj?.type === 'classified') {
        setVariationModal(productObj?.id);
      } else {
        handleIncDec(1, productObj, productQty, setProductQty, setIsOpen);
      }
    }
  };

  return (
    <>
      <div className="ugc-card">
        {/* Thumbnail + play overlay */}
        <div className="ugc-card__thumbnail" onClick={() => onPlay?.(index)}>
          <video
            ref={videoRef}
            src={data.videoUrl}
            className="ugc-card__image"
            muted
            loop
            playsInline
            preload="metadata"
          />
          {/* Gradient shadow at bottom */}
          <div className="ugc-card__gradient" />

          {/* Play button */}
          <button className="ugc-card__play-btn" aria-label="Play video">
            <RiPlayCircleFill />
          </button>

          {/* User info overlay */}
          <div className="ugc-card__user-info">
            <h4 className="ugc-card__name">{data.name}</h4>
            <span className="ugc-card__meta">
              {data.handle && `@${data.handle}`}
              {data.views != null && (
                <>
                  {data.handle && <span className="text-warning"> · </span>}
                  {formatReviewCount(data.views)} Views
                </>
              )}
            </span>
          </div>
        </div>

        {/* Card body */}
        <div className="ugc-card__body">
          {/* Star rating */}
          <UGCStarRating rating={data.rating} />

          {/* Mini product card */}
          {productObj && (
            <div className="ugc-card__product">
              {productObj.product_thumbnail && (
                <div className="ugc-card__product-img">
                  <Image
                    src={productObj.product_thumbnail}
                    alt={productObj.name || 'Product'}
                    width={40}
                    height={40}
                  />
                </div>
              )}
              <div className="ugc-card__product-info">
                <span className="ugc-card__product-name">
                  {productObj.name}
                </span>
                <span className="ugc-card__product-pricing">
                  <span className="ugc-card__sale-price">
                    ₹{productObj.sale_price ?? productObj.price}
                  </span>
                  {productObj.sale_price &&
                    productObj.price &&
                    productObj.sale_price < productObj.price && (
                      <span className="ugc-card__original-price">
                        ₹{productObj.price}
                      </span>
                    )}
                </span>
              </div>
            </div>
          )}

          {/* Review */}
          {data.review && (
            <p className="ugc-card__review">&ldquo;{data.review}&rdquo;</p>
          )}

          {/* Add to Cart button (same UI as ProductBox1Cart) */}
          {productObj && (
            <div className="add-to-cart-box ugc-card__cart-box">
              {isOpen && productQty >= 1 ? (
                <div className="ugc-cart-qty-row">
                  <button
                    type="button"
                    className="qty-btn qty-minus"
                    onClick={() =>
                      handleIncDec(
                        -1,
                        productObj,
                        productQty,
                        setProductQty,
                        setIsOpen,
                        getSelectedVariant || null
                      )
                    }
                  >
                    <RiSubtractLine />
                  </button>
                  <span className="qty-value">{productQty}</span>
                  <button
                    type="button"
                    className="qty-btn qty-plus"
                    onClick={() =>
                      handleIncDec(
                        1,
                        productObj,
                        productQty,
                        setProductQty,
                        setIsOpen,
                        getSelectedVariant || null
                      )
                    }
                  >
                    <RiAddLine />
                  </button>
                </div>
              ) : (
                <button
                  className="btn-primary ugc-card__add-btn"
                  onClick={handleAddToCart}
                >
                  Add To Cart
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {productObj && (
        <VariationModal
          setVariationModal={setVariationModal}
          variationModal={variationModal}
          productObj={productObj}
        />
      )}
    </>
  );
};

export default UGCCard;
