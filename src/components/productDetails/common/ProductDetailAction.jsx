import React, { useContext, useEffect, useMemo, useState } from 'react';
import { RiAddLine, RiAddFill, RiSubtractLine, RiShoppingCartLine } from 'react-icons/ri';
import Btn from '@/elements/buttons/Btn';
import CartContext from '@/helper/cartContext';
import { useRouter } from 'next/navigation';
import AddToWishlist from '@/components/common/productBox/AddToWishlist';
import AddToCompare from '@/components/common/productBox/AddToCompare';

const ProductDetailAction = ({ productState, setProductState, extraOption }) => {
  const router = useRouter();
  const { cartProducts, handleIncDec } = useContext(CartContext);

  const [productQty, setProductQty] = useState(productState?.productQty || 1);
  const [isOpen, setIsOpen] = useState(false);

  const selectedVariationId = productState?.selectedVariation?.id;
  const isOutOfStock =
    (productState?.selectedVariation || productState?.product)?.stock_status !==
    'in_stock';

  const cartLineForProduct = useMemo(() => {
    if (!cartProducts?.length || !productState?.product?.id) return null;

    if (selectedVariationId) {
      const matched = cartProducts.find(
        (item) =>
          Number(item?.product_id) === Number(productState.product.id) &&
          Number(item?.variation_id) === Number(selectedVariationId)
      );
      if (matched) return matched;
    }

    return cartProducts.find(
      (item) => Number(item?.product_id) === Number(productState?.product?.id)
    );
  }, [cartProducts, productState?.product?.id, selectedVariationId]);

  useEffect(() => {
    if (cartLineForProduct) {
      setProductQty(cartLineForProduct.quantity || 1);
      setIsOpen(true);
      setProductState((prev) => ({ ...prev, productQty: cartLineForProduct.quantity || 1 }));
    } else {
      setIsOpen(false);
      setProductQty(productState?.productQty || 1);
    }
  }, [cartLineForProduct, productState?.productQty, setProductState]);

  const syncQtyState = (nextQty) => {
    setProductQty(nextQty);
    setProductState((prev) => ({ ...prev, productQty: nextQty }));
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const nextQty = productQty > 0 ? productQty : 1;
    handleIncDec(1, productState?.product, nextQty, setProductQty, setIsOpen, productState, false);
    syncQtyState(nextQty);
    setIsOpen(true);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    const nextQty = productQty > 0 ? productQty : 1;
    
    // Store product for instant checkout (Buy Now)
    const buyNowProduct = {
      product_id: productState?.product?.id,
      product: productState?.product,
      quantity: nextQty,
      variation: productState?.selectedVariation || null,
      sub_total: (productState?.selectedVariation?.sale_price || productState?.product?.sale_price || productState?.product?.price || 0) * nextQty,
      price: productState?.selectedVariation?.sale_price || productState?.product?.sale_price || productState?.product?.price || 0,
    };
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('instantBuyProduct', JSON.stringify(buyNowProduct));
    }
    
    router.push('/checkout');
  };

  const handleQtyChange = (delta) => {
    const nextQty = Math.max(1, (productQty || 1) + delta);
    handleIncDec(delta, productState?.product, productQty, setProductQty, setIsOpen, productState, false);
    syncQtyState(nextQty);
  };

  return (
    <>
      <div className="add-to-cart-box">
        {isOutOfStock ? (
          <Btn className="btn-out-of-stock w-100" disabled>
            Out of Stock
          </Btn>
        ) : (
          <div className="dual-cart-buttons dynamic-checkout">
            <Btn
              color="primary"
              className="btn-buy-now btn btn-md scroll-button"
              onClick={handleBuyNow}
              title={'Buy Now'}
            >
              <RiShoppingCartLine size={18} />
            </Btn>

            {isOpen && productQty >= 1 ? (
              <div className="qty-inline-box">
                <Btn
                  type="button"
                  className="qty-btn qty-minus"
                  onClick={() => handleQtyChange(-1)}
                >
                  <RiSubtractLine />
                </Btn>
                <span className="qty-value">{productQty}</span>
                <Btn
                  type="button"
                  className="qty-btn qty-plus"
                  onClick={() => handleQtyChange(1)}
                >
                  <RiAddLine />
                </Btn>
              </div>
            ) : (
              <Btn
                color="primary"
                className="btn-add-cart addcart-button"
                onClick={handleAddToCart}
              >
                <span className="label-full">Add to Cart</span>
                <span className="label-short">
                  {/* <RiAddFill /> */}
                  Add
                </span>
              </Btn>
            )}
          </div>
        )}
      </div>
      {!isOutOfStock && (
        <>
          <div className="mobile-cart-promo d-lg-none">
            <div className="mobile-cart-promo__inner">
              <span className="mobile-cart-promo__icon">
                <img src="/assets/images/coupon-icon.webp" alt="" />
              </span>
              <p className="mobile-cart-promo__text mb-0">
                Add items worth ₹500 to get FREE DELIVERY
              </p>
            </div>
          </div>

          <div className="mobile-product-action-buttons dynamic-checkout d-lg-none">
            <Btn
              type="button"
              color="primary"
              className="btn-buy-now btn btn-md"
              onClick={handleBuyNow}
              title={'Buy Now'}
            >
              <RiShoppingCartLine size={18} />
            </Btn>
            <Btn
              type="button"
              color="primary"
              className="btn-add-cart addcart-button"
              onClick={handleAddToCart}
            >
              <span className="label-full">Add to Cart</span>
              <span className="label-short">Add</span>
            </Btn>
          </div>
        </>
      )}
    </>
  );
};

export default ProductDetailAction;
