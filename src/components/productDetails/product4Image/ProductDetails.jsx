'use client';

import Cookies from 'js-cookie';
import { useContext, useEffect, useRef, useState } from 'react';
// import ProductBox1Rating from '@/components/common/productBox/productBox1/ProductBox1Rating';
// import CustomerOrderCount from '../common/CustomerOrderCount';
import SettingContext from '@/helper/settingContext';
import { useRouter } from 'next/navigation';
import {
  RiFacebookFill,
  RiFileCopyLine,
  RiHeartFill,
  RiHeartLine,
  RiLinkedinFill,
  RiShareLine,
  RiStarFill,
  RiTwitterFill,
  RiWhatsappFill,
} from 'react-icons/ri';
import {
  buildProductUrl,
  copyLinkToClipboard,
  getShareLinks,
  openShareWindow,
} from '@/utils/helpers';

const ProductDetails = ({ productState }) => {
  const { convertCurrency } = useContext(SettingContext);
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showShareDropdown, setShowShareDropdown] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isDescriptionOverflowing, setIsDescriptionOverflowing] = useState(false);
  const descriptionRef = useRef(null);

  const product = productState?.product || {};
  const selectedVariation = productState?.selectedVariation;

  const stockStatus = selectedVariation?.stock_status ?? product?.stock_status;
  const isInStock = stockStatus === 'in_stock';
  const sku = selectedVariation?.sku ?? product?.sku;

  const productName = selectedVariation?.name ?? product?.name ?? '';
  const productSlug = product?.slug ?? '';

  const categories = product?.categories || [];
  const tags = product?.tags || [];
  const keywords = [
    ...categories.map((c) => c?.name),
    ...tags.map((t) => t?.name),
  ].filter(Boolean);

  const salePrice = selectedVariation?.sale_price ?? product?.sale_price ?? 0;
  const listPrice = selectedVariation?.price ?? product?.price ?? salePrice;
  const discount = selectedVariation?.discount ?? product?.discount;

  const ratingCount = selectedVariation?.rating_count ?? product?.rating_count;
  const reviewsCount =
    selectedVariation?.reviews_count ?? product?.reviews_count ?? 0;
  const shortDescription =
    selectedVariation?.short_description ?? product?.short_description;

  const productUrl = buildProductUrl(productSlug);
  const shareLinks = getShareLinks(productUrl, productName);

  const handleWishlist = () => {
    // if (Cookies.get('uat')) {
      setIsWishlisted((prev) => !prev);
    // } else {
      // router.push('/');
    // }
  };

  const shareOnFacebook = () => {
    openShareWindow(shareLinks.facebook, () => setShowShareDropdown(false));
  };

  const shareOnTwitter = () => {
    openShareWindow(shareLinks.twitter, () => setShowShareDropdown(false));
  };

  const shareOnWhatsApp = () => {
    openShareWindow(shareLinks.whatsapp, () => setShowShareDropdown(false));
  };

  const shareOnLinkedIn = () => {
    openShareWindow(shareLinks.linkedin, () => setShowShareDropdown(false));
  };

  const copyToClipboard = () => {
    copyLinkToClipboard(productUrl, () => setShowShareDropdown(false));
  };

  const handleShare = async () => {
    const sharePayload = {
      title: productName,
      text: productName,
      url: productUrl,
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(sharePayload);
        return;
      } catch (error) {
        console.error('Share dialog dismissed or failed:', error);
        // setShowShareDropdown((prev) => !prev);
      }
    }
  };

  useEffect(() => {
    if (!shortDescription) {
      setIsDescriptionOverflowing(false);
      return undefined;
    }

    const element = descriptionRef.current;
    if (!element) return undefined;

    const checkOverflow = () => {
      if (!element) return;
      const { scrollHeight, clientHeight } = element;
      setIsDescriptionOverflowing(scrollHeight - clientHeight > 1);
    };

    if (!showFullDescription) {
      checkOverflow();
      window.addEventListener('resize', checkOverflow);
      return () => window.removeEventListener('resize', checkOverflow);
    }

    return undefined;
  }, [shortDescription, showFullDescription]);

  return (
    <>
      {/* <CustomerOrderCount productState={productState} /> */}
      <div className="variation-top-info">
        <div className="variation-sku-stock">
          <span>
            <strong>SKU:</strong> {sku || 'N/A'}
          </span>
          <span
            className={`variation-stock-badge ${isInStock ? 'in_stock-color' : 'out_of_stock-color'}`}
          >
            {isInStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
        <div className="variation-action-buttons">
          <button
            className={`variation-icon-btn ${isWishlisted ? 'wishlist-active' : ''}`}
            onClick={handleWishlist}
            title="Add to Wishlist"
          >
            {isWishlisted ? (
              <RiHeartFill size={18} />
            ) : (
              <RiHeartLine size={18} />
            )}
          </button>
          <div className="variation-share-wrapper">
            <button
              className="variation-icon-btn"
              onClick={handleShare}
              title="Share"
            >
              <RiShareLine size={18} />
            </button>
            {showShareDropdown && (
              <div className="variation-share-dropdown">
                <div
                  className="variation-share-icon facebook"
                  onClick={shareOnFacebook}
                  title="Facebook"
                >
                  <RiFacebookFill size={16} />
                </div>
                <div
                  className="variation-share-icon twitter"
                  onClick={shareOnTwitter}
                  title="Twitter"
                >
                  <RiTwitterFill size={16} />
                </div>
                <div
                  className="variation-share-icon whatsapp"
                  onClick={shareOnWhatsApp}
                  title="WhatsApp"
                >
                  <RiWhatsappFill size={16} />
                </div>
                <div
                  className="variation-share-icon linkedin"
                  onClick={shareOnLinkedIn}
                  title="LinkedIn"
                >
                  <RiLinkedinFill size={16} />
                </div>
                <div
                  className="variation-share-icon copy-link"
                  onClick={copyToClipboard}
                  title="Copy Link"
                >
                  <RiFileCopyLine size={16} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <h2 className="name">{productName}</h2>
      {keywords.length > 0 && (
        <div className="variation-keywords">
          {keywords.slice(0, 5).map((keyword, index) => (
            <span key={index} className="variation-keyword-tag">
              {keyword}
            </span>
          ))}
        </div>
      )}
      <div className="price-rating">
        <h3 className="theme-color price">
          {convertCurrency(salePrice)}
          <del className="text-content">{convertCurrency(listPrice)}</del>
          {discount ? <span className="offer-top">{discount}% Off</span> : null}
        </h3>
        <div className="product-rating custom-rate">
          {/* <ProductBox1Rating totalRating={1} /> */}
          <ul className={`rating`}>
            <li>
              <RiStarFill />
            </li>
          </ul>
          <span className="ms-2">4.5</span>
          <span className="review">({reviewsCount} Review)</span>
        </div>
      </div>
      {/* <div className="product-contain">
        <p>{shortDescription}</p>
      </div> */}
      <div className="product-detail">
        {shortDescription ? (
          <>
            <p
              ref={descriptionRef}
              className={`product-short-description ${showFullDescription ? 'expanded' : 'collapsed'}`}
              style={
                showFullDescription
                  ? undefined
                  : {
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }
              }
            >
              {shortDescription}
            </p>
            {isDescriptionOverflowing ? (
              <button
                type="button"
                className="btn btn-link p-0 read-more-btn fs-6 mt-1"
                onClick={() => setShowFullDescription((prev) => !prev)}
              >
                {showFullDescription ? 'Read less' : 'Read more'}
              </button>
            ) : null}
          </>
        ) : null}
      </div>
    </>
  );
};

export default ProductDetails;
