import { useState, useContext, useEffect, useMemo } from 'react';
import { Col, Row } from 'reactstrap';
import ResponsiveModal from '@/components/common/ResponsiveModal';
import LeftSideModal from './LeftSideModal';
import RightVariationModal from './RightSideModal';
import VariationBuyNow from './VariationBuyNow';
import ProductAttribute from '@/components/productDetails/common/productAttribute/ProductAttribute';
import CartContext from '@/helper/cartContext';
import { RiAddLine, RiSubtractLine } from 'react-icons/ri';

const VariationModal = ({ productObj, variationModal, setVariationModal }) => {
  const { cartProducts, handleIncDec } = useContext(CartContext);
  const [isOpen, setIsOpen] = useState(false);
  const [productQty, setProductQty] = useState(0);
  const [cloneVariation, setCloneVariation] = useState({
    product: productObj,
    attributeValues: [],
    productQty: 1,
    selectedVariation: '',
    variantIds: [],
  });

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
    const productInStock = cloneVariation?.selectedVariation
      ? cloneVariation?.selectedVariation?.stock_status == 'in_stock'
      : cloneVariation?.product?.stock_status == 'in_stock';

    if (productInStock) {
      if (cloneVariation?.selectedVariation) {
        handleIncDec(
          cloneVariation.productQty,
          cloneVariation.product,
          productQty,
          setProductQty,
          setIsOpen,
          cloneVariation
        );
      } else {
        handleIncDec(
          cloneVariation.productQty,
          cloneVariation.product,
          productQty,
          setProductQty,
          setIsOpen
        );
      }
    }
  };
  return (
    <ResponsiveModal
      modal={productObj?.id == variationModal}
      setModal={setVariationModal}
      mobileBreakpoint={992}
      // closeButton={<RiCloseLine className="btn-close" />}
      classes={{
        modalClass: 'view-modal modal-lg theme-modal',
        modalHeaderClass: 'p-0',
        offcanvasClass: 'variation-offcanvas',
        title: '',
      }}
    >
      <div className="variation-modal-content" data-lenis-prevent>
        <div className="variation-modal-body">
          <Row className="m-0">
            <LeftSideModal
              cloneVariation={cloneVariation}
              productObj={productObj}
            />
            <Col lg="6">
              <div className="right-sidebar-modal">
                <div className="right-sidebar-scroll hide-scrollbar">
                  <RightVariationModal
                    cloneVariation={cloneVariation}
                    setCloneVariation={setCloneVariation}
                  />
                  {cloneVariation?.product &&
                    productObj?.id == variationModal &&
                    !(cloneVariation?.product?.variations?.length > 0) && (
                      <ProductAttribute
                        productState={cloneVariation}
                        setProductState={setCloneVariation}
                      />
                    )}
                </div>
                {/* Desktop: show buttons inline */}
                <div className="modal-bottom-cart d-none d-lg-block">
                  <div className="dual-cart-buttons">
                    <VariationBuyNow
                      cloneVariation={cloneVariation}
                      setVariationModal={setVariationModal}
                    />
                    {isOpen && productQty >= 1 ? (
                      <div className="qty-inline-box">
                        <button
                          type="button"
                          className="qty-btn qty-minus"
                          onClick={() =>
                            handleIncDec(
                              -1,
                              cloneVariation.product,
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
                              cloneVariation.product,
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
                        disabled={
                          (cloneVariation?.selectedVariation &&
                            cloneVariation?.selectedVariation?.stock_status !==
                              'in_stock') ||
                          cloneVariation?.product?.stock_status !== 'in_stock'
                        }
                      >
                        <span className="label-full">Add To Cart</span>
                        <span className="label-short">Add</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
        {/* Mobile: Fixed bottom buttons */}
        <div className="variation-modal-footer d-lg-none">
          <div className="dual-cart-buttons">
            <VariationBuyNow
              cloneVariation={cloneVariation}
              setVariationModal={setVariationModal}
            />
            {isOpen && productQty >= 1 ? (
              <div className="qty-inline-box">
                <button
                  type="button"
                  className="qty-btn qty-minus"
                  onClick={() =>
                    handleIncDec(
                      -1,
                      cloneVariation.product,
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
                      cloneVariation.product,
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
                disabled={
                  (cloneVariation?.selectedVariation &&
                    cloneVariation?.selectedVariation?.stock_status !==
                      'in_stock') ||
                  cloneVariation?.product?.stock_status !== 'in_stock'
                }
              >
                <span className="label-full">Add To Cart</span>
                <span className="label-short">Add</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </ResponsiveModal>
  );
};

export default VariationModal;
