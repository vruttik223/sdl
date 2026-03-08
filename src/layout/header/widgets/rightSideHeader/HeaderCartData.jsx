import React, { useContext, useEffect, useState, useMemo, useRef } from 'react';
import {
  RiCloseLine,
  RiCloseFill,
  RiMapPinLine,
  RiArrowDownSLine,
  RiBuildingLine,
  RiCheckboxCircleFill,
} from 'react-icons/ri';
import { Offcanvas, OffcanvasBody, OffcanvasHeader } from 'reactstrap';
import { useRouter } from 'next/navigation';
import CartContext from '@/helper/cartContext';
import { useTranslation } from '@/utils/translations';
import ThemeOptionContext from '@/helper/themeOptionsContext';
import SettingContext from '@/helper/settingContext';
import AccountContext from '@/helper/accountContext';
import UserContext from '@/helper/userContext';
import HeaderCartBottom from './HeaderCartBottom';
import ResponsiveModal from '@/components/common/ResponsiveModal';
import AddAddressForm from '@/components/checkout/common/AddAddressForm';
import OtpLoginModal from '@/components/auth/login/OtpLoginModal';
import useCreate from '@/utils/hooks/useCreate';
import { AddressAPI } from '@/utils/axiosUtils/API';
import { calculateCheckoutBill } from '@/utils/checkout/billing';
import { formatAddress } from '@/utils/helpers';
import { ToastNotification } from '@/utils/customFunctions/ToastNotification';

const HeaderCartData = ({ cartStyle }) => {
  const { setCartCanvas, cartCanvas } = useContext(ThemeOptionContext);
  const [shippingCal, setShippingCal] = useState(0);
  const [shippingFreeAmt, setShippingFreeAmt] = useState(0);
  const [confetti, setConfetti] = useState(0);
  const confettiItems = Array.from({ length: 150 }, (_, index) => index);
  const [modal, setModal] = useState(false);
  const { settingData, convertCurrency } = useContext(SettingContext);
  const { cartProducts, getTotal, setCartProducts, setCartTotal } = useContext(CartContext);
  // const { refetch, accountData } = useContext(AccountContext);
  const { userData, isAuthenticated } = useContext(UserContext);
  const router = useRouter();
  const [otpModal, setOtpModal] = useState(false);
  const [addressModal, setAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const [showAddressLimitModal, setShowAddressLimitModal] = useState(false);
  const [isProceedingToCheckout, setIsProceedingToCheckout] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');
  const [checkoutState, setCheckoutState] = useState({
    appliedCoupon: '',
    isSuperCoinsApplied: false,
    billDetails: null,
  });
  const addressDropdownRef = useRef(null);

  // Mutation for adding address
  const { mutate: addAddressMutate, isPending: isAddingAddress } = useCreate(
    AddressAPI,
    null,
    false,
    // 'Address added successfully',
    () => {
      setAddressModal(false);
      // refetch && refetch();
    }
  );

  useEffect(() => {
    setShippingFreeAmt(settingData?.general?.min_order_free_shipping);
    cartProducts?.filter((elem) => {
      if (elem?.variation) {
        elem.variation.selected_variation = elem?.variation?.attribute_values
          ?.map((values) => values.value)
          .join('/');
      }
    });
  }, [cartProducts, settingData?.general?.min_order_free_shipping]);

  // Effect 2: Calculate shippingCal and confetti
  useEffect(() => {
    let tempCal =
      (getTotal(cartProducts) * 100) /
      (settingData?.general?.min_order_free_shipping || shippingFreeAmt);
    let tempConfetti = confetti;
    let timer;
    if (tempCal > 100) {
      tempCal = 100;
      if (tempConfetti === 0) {
        setConfetti((prev) => 1);
        timer = setTimeout(() => {
          // Update the confetti state after the setTimeout completes
          setConfetti((prev) => 2);
        }, 4500);
      }
    } else {
      tempConfetti = 0;
      setConfetti((prev) => 0); // Update the confetti state immediately
    }
    setShippingCal((prev) => tempCal);
    return () => clearTimeout(timer);
  }, [getTotal(cartProducts), cartCanvas]);

  // Get user addresses
  const userAddresses = useMemo(() => {
    // const accountAddresses = Array.isArray(accountData?.address) ? accountData.address : [];
    const authUserAddresses = Array.isArray(userData?.addresses)
      ? userData.addresses
      : [];
    return authUserAddresses;
  }, [userData?.addresses]);

  // Set default address when addresses are loaded
  useEffect(() => {
    if (userAddresses?.length > 0 && !selectedAddress) {
      const defaultAddress =
        userAddresses.find((addr) => addr.is_default) || userAddresses[0];
      setSelectedAddress(defaultAddress);
    }
  }, [userAddresses, selectedAddress]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        addressDropdownRef.current &&
        !addressDropdownRef.current.contains(event.target)
      ) {
        setShowAddressDropdown(false);
      }
    };

    if (showAddressDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAddressDropdown]);

  const fallbackBillDetails = useMemo(
    () =>
      calculateCheckoutBill({
        cartProducts,
        appliedCoupon: checkoutState.appliedCoupon,
        isSuperCoinsApplied: checkoutState.isSuperCoinsApplied,
      }),
    [
      cartProducts,
      checkoutState.appliedCoupon,
      checkoutState.isSuperCoinsApplied,
    ]
  );

  const activeBillDetails = checkoutState.billDetails || fallbackBillDetails;
  const grandTotal = activeBillDetails?.grandTotal || 0;

  const handleAddAddressClick = () => {
    if (isAddingAddress) return;
    if (!isAuthenticated) {
      setOtpModal(true);
      return;
    }
    if (userAddresses.length >= 5) {
      setShowAddressLimitModal(true);
      return;
    }
    setAddressModal(true);
  };

  const handleProceedToCheckout = () => {
    if (isProceedingToCheckout || isAddingAddress) {
      return;
    }

    // Validate cart is not empty
    if (!cartProducts || cartProducts.length === 0) {
      ToastNotification('error', 'Your cart is empty. Please add items before placing an order.');
      return;
    }

    // Check if address is selected
    if (!selectedAddress) {
      ToastNotification('error', 'Please select a delivery address.');
      return;
    }

    setIsProceedingToCheckout(true);

    // Place order
    setTimeout(() => {
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
        total: activeBillDetails?.grandTotal || 0,
        itemTotal,
        mrp: mrpTotal,
        discountedPrice: itemTotal,
        couponDiscount: activeBillDetails?.couponDiscount || 0,
        shippingCharge: activeBillDetails?.shippingCharge || 0,
        sdlCoinDiscount: activeBillDetails?.superCoinDiscount || 0,
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
      setCartProducts([]);
      setCartTotal(0);
      localStorage.removeItem('cart');
      
      setPlacedOrderId(orderId);
      setIsProceedingToCheckout(false);
      setCartCanvas(false);
      setShowSuccessModal(true);
    }, 1000);
  };

  const handleGoToOrders = () => {
    setShowSuccessModal(false);
    router.push('/account/order');
  };

  return (
    <>
      {cartStyle == 'cart_sidebar' ? (
        <Offcanvas
          direction="end"
          isOpen={cartCanvas}
          toggle={() => setCartCanvas(false)}
          className="cart-offcanvas"
        >
          <OffcanvasHeader toggle={null}>
            <div className="d-flex align-items-center justify-content-between w-100">
              <span className="header-text">
                <h4 className="id">Shopping Cart</h4>
                {cartProducts?.length > 0 && (
                  <span className="item-count">
                    ({cartProducts.length}{' '}
                    {cartProducts.length === 1 ? 'item' : 'items'})
                  </span>
                )}
              </span>
              <button
                type="button"
                className="close-btn"
                onClick={() => setCartCanvas(false)}
                aria-label="Close"
              >
                <RiCloseFill />
              </button>
            </div>
          </OffcanvasHeader>
          <OffcanvasBody className="cart-body" data-lenis-prevent>
            <HeaderCartBottom
              modal={modal}
              setModal={setModal}
              shippingCal={shippingCal}
              shippingFreeAmt={shippingFreeAmt}
              onCheckoutDataChange={setCheckoutState}
            />
          </OffcanvasBody>
          {cartProducts?.length > 0 && (
            <div className="cart-footer">
              {isAuthenticated && userAddresses?.length > 0 ? (
                <>
                  {/* Delivery Address Section */}
                  <div
                    className="delivery-address-section"
                    ref={addressDropdownRef}
                  >
                    <div
                      className="delivery-location-header"
                      onClick={() =>
                        setShowAddressDropdown(!showAddressDropdown)
                      }
                    >
                      <div className="location-icon-wrapper">
                        <RiBuildingLine />
                      </div>

                      <div className="location-content">
                        <div className="location-title">
                          Delivering to {selectedAddress?.type || 'Address'}
                          <RiArrowDownSLine
                            className={`dropdown-icon ${showAddressDropdown ? 'open' : ''}`}
                          />
                        </div>

                        <div className="location-address">
                          {selectedAddress
                            ? formatAddress(selectedAddress)
                            : 'Select an address'}
                        </div>
                      </div>
                    </div>

                    {/* Address Dropdown */}
                    {showAddressDropdown && (
                      <div className="address-dropdown" data-lenis-prevent>
                        {userAddresses.map((address) => (
                          <div
                            key={address.uid}
                            className={`address-option ${
                              selectedAddress?.uid === address.uid
                                ? 'active'
                                : ''
                            }`}
                            onClick={() => {
                              setSelectedAddress(address);
                              setShowAddressDropdown(false);
                            }}
                          >
                            <div className="address-option-title">
                              {address.type?.toUpperCase() || 'Address'}
                            </div>

                            <div className="address-option-details">
                              {address.firstName} {address.lastName} <br />
                              {formatAddress(address)}
                            </div>
                          </div>
                        ))}

                        <div
                          className="address-option add-new"
                          onClick={() => {
                            setShowAddressDropdown(false);
                            handleAddAddressClick();
                          }}
                        >
                          + Add New Address
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Payment Button */}
                  <button
                    className="btn-payment"
                    onClick={handleProceedToCheckout}
                    disabled={isProceedingToCheckout || isAddingAddress}
                  >
                    {isProceedingToCheckout
                      ? 'Processing...'
                      : `Click to Pay ${convertCurrency(grandTotal)}`}
                  </button>
                </>
              ) : (
                <button
                  className="btn-primary btn-payment"
                  onClick={() => {
                    if (!isAuthenticated) {
                      setOtpModal(true);
                    } else {
                      handleAddAddressClick();
                    }
                  }}
                  disabled={isAddingAddress}
                >
                  {!isAuthenticated ? 'Please Login' : 'Add Address to proceed'}
                </button>
              )}
            </div>
          )}
        </Offcanvas>
      ) : (
        <div className={`onhover-div ${cartCanvas ? 'show' : ''}`}>
          <div className="cart-title">
            <h4>Shopping Cart</h4>
            <a onClick={() => setCartCanvas((prev) => !prev)}>
              <RiCloseLine />
            </a>
          </div>
          <HeaderCartBottom
            modal={modal}
            setModal={setModal}
            shippingCal={shippingCal}
            shippingFreeAmt={shippingFreeAmt}
          />
        </div>
      )}
      <div
        className={`confetti-wrapper ${confetti == 1 && cartCanvas ? 'show' : ''} `}
      >
        {confettiItems?.map((elem, i) => (
          <div className={`confetti-${elem}`} key={i}></div>
        ))}
      </div>
      <ResponsiveModal
        modal={addressModal}
        setModal={setAddressModal}
        classes={{
          modalClass: 'theme-modal view-modal modal-md',
          modalHeaderClass: 'justify-content-between',
          title: 'Add Address',
        }}
        backdrop="static"
      >
        <div className="right-sidebar-box">
          <AddAddressForm
            mutate={addAddressMutate}
            setModal={setAddressModal}
            type="shipping"
            modal={false}
            isSubmitting={isAddingAddress}
          />
        </div>
      </ResponsiveModal>
      <ResponsiveModal
        modal={showAddressLimitModal}
        setModal={setShowAddressLimitModal}
        classes={{
          modalClass: 'theme-modal modal-sm',
          modalHeaderClass: 'justify-content-between',
          title: 'Address Limit Reached',
        }}
      >
        <div className="p-2">Maximum 5 addresses can be added.</div>
      </ResponsiveModal>
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

export default HeaderCartData;
