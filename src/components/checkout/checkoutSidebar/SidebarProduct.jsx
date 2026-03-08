import React, { useContext } from 'react';
import { CardBody } from 'reactstrap';
import Image from 'next/image';
import { RiAddLine, RiSubtractLine, RiDeleteBinLine } from 'react-icons/ri';
import { useRouter } from 'next/navigation';
import CartContext from '@/helper/cartContext';
import { placeHolderImage } from '../../../data/CommonPath';
import { useTranslation } from '@/utils/translations';

// Currency helper
const convertToRupees = (value) => `₹${Number(value).toFixed(0)}`;

const SidebarProduct = ({ checkoutProducts, isInstantBuy }) => {
  const { t } = useTranslation('common');
  const { cartProducts, handleIncDec, removeCart } = useContext(CartContext);
  const router = useRouter();

  // Use checkoutProducts if provided (for instant buy), otherwise use cartProducts
  const displayProducts = checkoutProducts || cartProducts;

  const goToProductDetails = (productSlug) => {
    if (!productSlug) return;
    router.push(`/products/${productSlug}`);
  };

  return (
    <CardBody>
      <ul className="order-items">
        {displayProducts?.length === 0 && (
          <li className="text-center text-muted py-3">Your cart is empty</li>
        )}
        {displayProducts?.map((item, index) => {
          const product = item?.product;
          const variation = item?.variation;

          const image =
            variation?.variation_image?.original_url ||
            product?.product_thumbnail?.original_url ||
            placeHolderImage;

          const name = variation?.name || product?.name;
          const salePrice = variation?.sale_price || product?.sale_price;
          const mrp = variation?.price || product?.price;

          return (
            <li className="order-item" key={index}>
              {/* Product Image */}
              <div className="thumb">
                <Image
                  src={image}
                  alt={name}
                  width={48}
                  height={48}
                  draggable={false}
                  unoptimized
                  onClick={() => goToProductDetails(product?.slug)}
                  style={{ cursor: product?.slug ? 'pointer' : 'default' }}
                />
              </div>

              {/* Product Info */}
              <div className="info">
                <span
                  className="name"
                  role="button"
                  tabIndex={0}
                  onClick={() => goToProductDetails(product?.slug)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      goToProductDetails(product?.slug);
                    }
                  }}
                  style={{ cursor: product?.slug ? 'pointer' : 'default' }}
                >
                  {name}
                </span>
                <div className="d-flex align-items-center gap-2 mt-1">
                  {!isInstantBuy && (
                    <>
                      <button
                        type="button"
                        className="btn btn-sm p-0 border-0"
                        style={{ lineHeight: 1 }}
                        onClick={() => {
                          if (item.quantity <= 1) {
                            removeCart(item.product_id);
                          } else {
                            handleIncDec(-1, product, item.quantity, null, null, item, false);
                          }
                        }}
                      >
                        {item.quantity <= 1 ? (
                          <RiDeleteBinLine size={14} className="text-danger" />
                        ) : (
                          <RiSubtractLine size={14} />
                        )}
                      </button>
                    </>
                  )}
                  <span className="meta fw-semibold">{item.quantity}</span>
                  {!isInstantBuy && (
                    <button
                      type="button"
                      className="btn btn-sm p-0 border-0"
                      style={{ lineHeight: 1 }}
                      onClick={() =>
                        handleIncDec(1, product, item.quantity, null, null, item, false)
                      }
                    >
                      <RiAddLine size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="price">
                <span className="current">
                  {convertToRupees(salePrice * item.quantity)}
                </span>

                {mrp > salePrice && (
                  <del>{convertToRupees(mrp * item.quantity)}</del>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </CardBody>
  );
};

export default SidebarProduct;
