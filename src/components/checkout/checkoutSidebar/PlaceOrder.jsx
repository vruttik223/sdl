import { useContext, useState } from 'react';
import Btn from '@/elements/buttons/Btn';
import { useRouter } from 'next/navigation';
import UserContext from '@/helper/userContext';
import CartContext from '@/helper/cartContext';
import { ToastNotification } from '@/utils/customFunctions/ToastNotification';
import OtpLoginModal from '@/components/auth/login/OtpLoginModal';
import ResponsiveModal from '@/components/common/ResponsiveModal';
import { RiCheckboxCircleFill } from 'react-icons/ri';
import { formatAddress } from '@/utils/helpers';

const PlaceOrder = ({ values, cartProducts, billDetails, instantBuyProduct }) => {
  const router = useRouter();
  const { userData, isAuthenticated } = useContext(UserContext);
  const { setCartProducts, setCartTotal } = useContext(CartContext);
  const [otpModal, setOtpModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');

  // Get the selected address from session storage or user addresses
  const getSelectedAddress = () => {
    if (typeof window === 'undefined') return null;
    try {
      const draft = JSON.parse(sessionStorage.getItem('checkout-offcanvas-data') || '{}');
      if (draft?.selectedAddress) return draft.selectedAddress;
    } catch (e) { /* ignore */ }
    // Fallback: find from user addresses
    const addresses = userData?.addresses || [];
    const shippingId = values?.shipping_address_id;
    if (shippingId && addresses.length > 0) {
      return addresses.find((a) => a.id === shippingId || a.uid === shippingId) || addresses[0];
    }
    return addresses[0] || null;
  };

  const handleClick = () => {
    // Validate cart is not empty
    if (!cartProducts || cartProducts.length === 0) {
      ToastNotification('error', 'Your cart is empty. Please add items before placing an order.');
      return;
    }

    // Check login
    if (!isAuthenticated) {
      ToastNotification('info', 'Please login to place your order.');
      setOtpModal(true);
      return;
    }

    // Validate shipping address
    if (!values?.shipping_address_id) {
      ToastNotification('error', 'Please select a delivery address.');
      return;
    }

    // Place order
    setIsSubmitting(true);

    const orderPayload = {
      products: cartProducts.map((item) => ({
        product_id: item.product_id,
        variation_id: item.variation_id || null,
        quantity: item.quantity,
        sub_total: item.sub_total,
      })),
      shipping_address_id: values.shipping_address_id,
      billing_address_id: values.billing_address_id || values.shipping_address_id,
      total: billDetails?.grandTotal || 0,
      coupon_discount: billDetails?.couponDiscount || 0,
      sdl_coin_discount: billDetails?.superCoinDiscount || 0,
      shipping_charge: billDetails?.shippingCharge || 0,
    };

    // Simulate order placement (replace with actual API call)
    console.log('Order Payload:', orderPayload);
    
    setTimeout(() => {
      const selectedAddress = getSelectedAddress();

      const mappedItems = cartProducts.map((item) => {
        const quantity = Number(item?.quantity || 1);
        const unitPrice =
          Number(item?.sale_price) ||
          Number(item?.salePrice) ||
          Number(item?.variation?.sale_price) ||
          Number(item?.variation?.price) ||
          Number(item?.product?.sale_price) ||
          Number(item?.product?.price) ||
          0;

        const unitMrp =
          Number(item?.price) ||
          Number(item?.variation?.price) ||
          Number(item?.product?.price) ||
          unitPrice;

        const computedSubTotal =
          Number(item?.sub_total) ||
          Number(item?.subTotal) ||
          unitPrice * quantity;

        return {
          id: item.id || item.product_id,
          name: item.name || item.product?.name || 'Product',
          image:
            item?.product?.product_thumbnail?.original_url ||
            item?.variation?.variation_image?.original_url ||
            '/assets/images/product/placeholder.png',
          variant:
            item?.variation?.name ||
            item?.variation?.selected_variation ||
            item?.variation?.attribute_values
              ?.map((attribute) => attribute?.value)
              .filter(Boolean)
              .join(' / ') ||
            '',
          price: unitPrice,
          mrp: unitMrp,
          subTotal: computedSubTotal,
          quantity,
        };
      });

      const itemTotal = mappedItems.reduce(
        (sum, item) => sum + Number(item.subTotal || 0),
        0
      );
      const mrpTotal = mappedItems.reduce(
        (sum, item) => sum + Number(item.mrp || 0) * Number(item.quantity || 1),
        0
      );

      const orderId = `SDL${Date.now()}`;

      const placedOrder = {
        id: orderId,
        status: 'confirmed',
        placedAt: new Date().toISOString(),
        total: billDetails?.grandTotal || 0,
        itemTotal,
        mrp: mrpTotal,
        discountedPrice: itemTotal,
        couponDiscount: billDetails?.couponDiscount || 0,
        shippingCharge: billDetails?.shippingCharge || 0,
        sdlCoinDiscount: billDetails?.superCoinDiscount || 0,
        receiverName: selectedAddress
          ? `${selectedAddress.firstName || ''} ${selectedAddress.lastName || ''}`.trim()
          : userData?.name || userData?.first_name || '',
        receiverPhone: selectedAddress?.phone || userData?.phone || '',
        deliveryAddress: selectedAddress ? formatAddress(selectedAddress) : '',
        items: mappedItems,
      };

      if (typeof window !== 'undefined') {
        const existingOrders = JSON.parse(
          localStorage.getItem('placedOrders') || '[]'
        );
        localStorage.setItem(
          'placedOrders',
          JSON.stringify([placedOrder, ...existingOrders])
        );
      }

      // Clear cart after successful order
      if (instantBuyProduct) {
        // Clear instant buy product from session storage
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('instantBuyProduct');
        }
      } else {
        // Clear regular cart
        setCartProducts([]);
        setCartTotal(0);
        localStorage.removeItem('cart');
      }
      
      setPlacedOrderId(orderId);
      setIsSubmitting(false);
      setShowSuccessModal(true);
    }, 1000);
  };

  const handleGoToOrders = () => {
    setShowSuccessModal(false);
    router.push('/account/order');
  };

  return (
    <>
      <Btn
        className="btn-md fw-bold mt-4 text-white theme-bg-color w-100"
        onClick={handleClick}
        disabled={isSubmitting || !cartProducts?.length}
      >
        {isSubmitting 
          ? 'Placing Order...' 
          : !isAuthenticated 
          ? 'Please Login' 
          : `Place Order${billDetails?.grandTotal ? ` • ₹${billDetails.grandTotal.toFixed(2)}` : ''}`}
      </Btn>
      <OtpLoginModal isOpen={otpModal} setOpen={setOtpModal} />

      {/* Order Success Modal */}
      <ResponsiveModal
        modal={showSuccessModal}
        setModal={setShowSuccessModal}
        extraFunction={handleGoToOrders}
        classes={{
          modalClass: 'theme-modal success-modal modal-sm',
          offcanvasClass: 'order-success-offcanvas',
          modalHeaderClass: 'p-0 border-0',
          modalBodyClass: 'text-center',
          title: '',
        }}
        showCloseButton={false}
      >
        <div className="order-success-content text-center py-4 px-3">
          <RiCheckboxCircleFill className="text-success" style={{ fontSize: 64, marginBottom: 16 }} />
          <h5 className="fw-bold mb-2">Order Placed Successfully!</h5>
          <p className="text-muted mb-1" style={{ fontSize: 14 }}>
            Your order <strong>#{placedOrderId}</strong> has been confirmed.
          </p>
          <p className="text-muted mb-4" style={{ fontSize: 13 }}>
            We&apos;ll notify you when your order is on its way.
          </p>
          <button
            className="btn btn-md fw-bold text-white theme-bg-color w-100"
            onClick={handleGoToOrders}
          >
            Go to Orders
          </button>
        </div>
      </ResponsiveModal>
    </>
  );
};

export default PlaceOrder;
