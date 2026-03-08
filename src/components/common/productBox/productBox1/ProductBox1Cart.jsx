import React, { useContext, useEffect, useMemo, useState } from 'react';
import Btn from '@/elements/buttons/Btn';
import CartContext from '@/helper/cartContext';
import VariationModal from './variationModal/index';
import { RiAddLine, RiAddFill, RiSubtractLine, RiShoppingCartLine } from 'react-icons/ri';
import { useRouter } from 'next/navigation';

const ProductBox1Cart = ({ productObj }) => {
  const { cartProducts, handleIncDec } = useContext(CartContext);
  const [variationModal, setVariationModal] = useState('');
  const [productQty, setProductQty] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  
  const getSelectedVariant = useMemo(() => {
    return cartProducts.find((elem) => elem.product_id === productObj.id);
  }, [cartProducts]);
  
  useEffect(() => {
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
  }, [cartProducts]);

  const handleAddToCart = () => {
    if (productObj?.stock_status === 'in_stock') {
      if (productObj?.type === 'classified') {
        setVariationModal(productObj?.id);
      } else {
        handleIncDec(1, productObj, productQty, setProductQty, setIsOpen);
      }
    }
  };

  const handleBuyNow = () => {
    if (productObj?.stock_status === 'in_stock') {
      if (productObj?.type === 'classified') {
        setVariationModal(productObj?.id);
      } else {
        // Store product for instant checkout (Buy Now)
        const buyNowProduct = {
          product_id: productObj.id,
          product: productObj,
          quantity: 1,
          variation: null,
          sub_total: productObj?.sale_price || productObj?.price || 0,
          price: productObj?.sale_price || productObj?.price || 0,
        };
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('instantBuyProduct', JSON.stringify(buyNowProduct));
        }
        router.push('/checkout');
      }
    }
  };

  const handleNotifyMe = () => {
    // TODO: Implement notify me functionality
    console.log('Notify me clicked for product:', productObj.id);
  };

  return (
    <>
      <div className="add-to-cart-box">
        {productObj?.stock_status !== 'in_stock' ? (
          <div className="dual-cart-buttons out-of-stock-buttons">
            <button className="btn-out-of-stock" disabled>
              Out of Stock
            </button>
            <button className="btn-notify-me btn-primary" onClick={handleNotifyMe}>
              Notify Me
            </button>
          </div>
        ) : (
          <div className="dual-cart-buttons">
            {/* Buy button */}
            <button className="btn-buy-now" onClick={handleBuyNow}>
              <span className="label-full">Buy Now</span>
              <span className="label-short">Buy</span>
            </button>

            {/* Add to Cart button OR Quantity controls */}
            {isOpen && productQty >= 1 ? (
              <div className="qty-inline-box">
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
                      getSelectedVariant ? getSelectedVariant : null
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
                      getSelectedVariant ? getSelectedVariant : null
                    )
                  }
                >
                  <RiAddLine />
                </button>
              </div>
            ) : (
              <button
                className="btn-add-cart addcart-button"
                onClick={handleAddToCart}
              >
                <span className="label-full">Add to Cart</span>
                <span className="label-short">Add</span>
              </button>
            )}
          </div>
        )}
      </div>
      <VariationModal
        setVariationModal={setVariationModal}
        variationModal={variationModal}
        productObj={productObj}
      />
    </>
  );
};

export default ProductBox1Cart;
