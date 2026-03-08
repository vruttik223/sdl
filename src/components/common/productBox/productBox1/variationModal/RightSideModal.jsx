import TextLimit from '@/utils/customFunctions/TextLimit';
import { useEffect, useState } from 'react';
import { Label } from 'reactstrap';
import ProductBox1Rating from '../ProductBox1Rating';
import {
  RiHeartLine,
  RiHeartFill,
  RiShareLine,
  RiFacebookFill,
  RiTwitterFill,
  RiWhatsappFill,
  RiLinkedinFill,
  RiFileCopyLine,
  RiCoinsLine,
  RiShoppingCartLine,
  RiCopperCoinLine,
  RiStarFill,
} from 'react-icons/ri';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import {
  buildProductUrl,
  copyLinkToClipboard,
  getShareLinks,
  openShareWindow,
  convertToRupees,
  formatReviewCount,
} from '@/utils/helpers';
import { ModifyString } from '@/utils/customFunctions/ModifyString';

const RightVariationModal = ({ cloneVariation, setCloneVariation }) => {
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showShareDropdown, setShowShareDropdown] = useState(false);

  const variations = cloneVariation?.product?.variations || [];
  const selectedVariationId = cloneVariation?.selectedVariation?.id;

  // Get current stock status
  const stockStatus =
    cloneVariation?.selectedVariation?.stock_status ??
    cloneVariation?.product?.stock_status;
  const isInStock = stockStatus === 'in_stock';

  // Get SKU
  const sku =
    cloneVariation?.selectedVariation?.sku ?? cloneVariation?.product?.sku;

  // Get product name
  const productName =
    cloneVariation?.selectedVariation?.name ?? cloneVariation?.product?.name;

  // Get keywords/tags from categories or product tags
  const categories = cloneVariation?.product?.categories || [];
  const tags = cloneVariation?.product?.tags || [];
  const keywords = [
    ...categories.map((c) => c?.name),
    ...tags.map((t) => t?.name),
  ].filter(Boolean);

  // Calculate SDL Coins (example: 1 coin per ₹100 spent)
  const salePrice =
    cloneVariation?.selectedVariation?.sale_price ??
    cloneVariation?.product?.sale_price ??
    0;
  const superCoins = Math.floor(Number(salePrice) / 10);

  // Get weight and unit
  const weight = cloneVariation?.selectedVariation?.weight ?? cloneVariation?.product?.weight;
  const unit = cloneVariation?.selectedVariation?.unit ?? cloneVariation?.product?.unit;

  // Get rating data
  const rating = cloneVariation?.product?.rating ?? 4.7;
  const reviewCount = cloneVariation?.product?.rating_count ?? 0;

  // Get price and discount
  const displaySalePrice = cloneVariation?.selectedVariation?.sale_price ?? cloneVariation?.product?.sale_price;
  const displayPrice = cloneVariation?.selectedVariation?.price ?? cloneVariation?.product?.price;
  const displayDiscount = cloneVariation?.selectedVariation?.discount ?? cloneVariation?.product?.discount;

  // Selected quantity snapshot for the badge
  const selectedQuantity =
    cloneVariation?.selectedVariation?.quantity ??
    cloneVariation?.product?.quantity ??
    0;

  const handleVariantSelect = (variation) => {
    if (!setCloneVariation || !variation) return;

    const attributeIds = (variation?.attribute_values || [])
      .map((val) => val?.id)
      .filter(Boolean);

    setCloneVariation((prev) => ({
      ...prev,
      attributeValues: attributeIds,
      variantIds: attributeIds,
      selectedVariation: variation,
      variation: variation,
      variation_id: variation?.id,
    }));
  };

  // Auto-select the first available variation to avoid empty state and duplicate selections elsewhwere
  useEffect(() => {
    if (selectedVariationId || !variations.length) return;
    const firstAvailable =
      variations.find((v) => v?.stock_status === 'in_stock') || variations[0];
    handleVariantSelect(firstAvailable);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVariationId, variations]);

  // Wishlist handler
  const handleWishlist = () => {
    if (Cookies.get('uat')) {
      setIsWishlisted(!isWishlisted);
      console.log(
        `${isWishlisted ? 'Removed from' : 'Added to'} wishlist:`,
        productName
      );
    } else {
      router.push('/');
    }
  };

  // Share handlers
  const productSlug = cloneVariation?.product?.slug || '';
  const productUrl = buildProductUrl(productSlug);
  const shareLinks = getShareLinks(productUrl, productName);

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

  return (
    <>
      {/* 1. SKU - Stock Status - Wishlist & Share */}
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

      {/* 2. Full Name of the Product */}
      <h4 className="title-name">{productName}</h4>

      {/* 3. Meta info - Weight/Unit and Stock Status with Rating */}
      <div className="meta-1">
        <div className="">
          <h6 className="unit">
            {weight}{unit}
          </h6>
          <span
            className={`${!isInStock ? 'out_of_stock-color' : 'in_stock-color'}`}
          >
            {ModifyString(stockStatus, false, '_')}
          </span>
        </div>
        <div className="">
          <div className="rating-section">
            <span className="stars">
              <RiStarFill size={14} />
            </span>
            <span className="review-count">
              <span className="count">
                {rating.toFixed(1)}
              </span>{' '}
              ({formatReviewCount(reviewCount)})
            </span>
          </div>
        </div>
      </div>

      {/* 4. Price Row */}
      <div className="price-row">
        <div className="disc-price">
          {convertToRupees(displaySalePrice)}
        </div>
        <div className="selling-price">
          {convertToRupees(displayPrice)}
        </div>
        <div className="percent-off">
          {displayDiscount ? `${displayDiscount}% Off` : null}
        </div>
      </div>

      {/* 5. Keywords Related to Product/Category */}
      {keywords.length > 0 && (
        <div className="variation-keywords">
          {keywords.slice(0, 5).map((keyword, index) => (
            <span key={index} className="variation-keyword-tag">
              {keyword}
            </span>
          ))}
        </div>
      )}

      {/* 6. Short Description */}
      <div className="product-detail">
        <TextLimit
          value={cloneVariation?.product?.short_description}
          maxLength={200}
          tag={'p'}
        />
      </div>

      {/* 7. Availability / Variants Section */}
      <div className="pickup-box">
        <div className="product-info">
          {/* variation-availability-summary */}
          <div className="">
            <span className="variation-availability-label property-title">
              <h4>Availability</h4>
            </span>
          </div>

          {variations.length > 0 && (
            <div className="variation-radio-list">
              {variations.map((variation) => {
                const attrValues = variation?.attribute_values || [];
                const valueLabel = attrValues
                  .map((val) => val?.value)
                  .filter(Boolean)
                  .join(' / ');
                const sale = variation?.sale_price ?? variation?.price;
                const list = variation?.price;
                const priceToShow = sale ?? list;
                const discountValue =
                  variation?.discount ??
                  (list && priceToShow
                    ? Math.round(((list - priceToShow) / list) * 100)
                    : 0);
                const inStock = variation?.stock_status === 'in_stock';
                const isSelected =
                  Number(selectedVariationId) === Number(variation?.id);

                return (
                  <button
                    type="button"
                    key={variation?.id ?? valueLabel}
                    className={`variation-radio-card ${isSelected ? 'active' : ''} ${!inStock ? 'disabled' : ''}`}
                    onClick={() => inStock && handleVariantSelect(variation)}
                    disabled={!inStock}
                    aria-pressed={isSelected}
                  >
                    <div className="variation-radio-content">
                      <div className="variation-radio-title-row">
                        <span className="variation-radio-title">
                          {valueLabel || 'Variant'}
                        </span>
                      </div>

                      <div className="variation-radio-pricing">
                        <span className="variation-price-strong">
                          {priceToShow !== undefined
                            ? convertToRupees(priceToShow)
                            : ''}
                        </span>
                        {/* {list !== undefined && list !== priceToShow && (
                          <span className="variation-price-mrp">MRP: <del>{convertToRupees(list)}</del></span>
                        )} */}
                        {/* {discountValue > 0 && (
                          <span className="variation-price-discount">{discountValue}% off</span>
                        )} */}
                      </div>

                      <div className="variation-radio-bottom">
                        <span
                          className={`variation-radio-stock ${inStock ? 'in_stock-color' : 'out_of_stock-color'}`}
                        >
                          {inStock ? 'In stock' : 'Out of stock'}
                        </span>
                        {/* <span className="variation-meta-chip">
                          {variation?.quantity ?? 0} items left
                        </span> */}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {superCoins > 0 &&<div className="variation-coin-inline">
        <span className="variation-coin-inline__text">
          Earn <RiCopperCoinLine className="variation-coin-inline__icon" /> {superCoins} {" "}
          SDL Coins
        </span>
      </div>}

      {/* 8. Full product page link for more details */}
      <div className="variation-more-details">
        <a
          href={`/products/${productSlug}`}
          // target="_blank"
          rel="noopener noreferrer"
          className="variation-more-details-link"
        >
          View full product details
        </a>
      </div>
    </>
  );
};

export default RightVariationModal;
