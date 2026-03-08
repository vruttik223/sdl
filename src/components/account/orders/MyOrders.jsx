import { useEffect, useState } from 'react';
import Image from 'next/image';
import request from '@/utils/axiosUtils';
import { useQuery } from '@tanstack/react-query';
import {
  RiCheckboxCircleFill,
  RiCloseFill,
  RiCloseCircleFill,
  RiStarFill,
} from 'react-icons/ri';
import {
  FaChevronRight,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaUndo,
} from 'react-icons/fa';
// import { HiOutlineChatBubbleLeftEllipsis } from 'react-icons/hi2';
import { IoMdRefresh   } from 'react-icons/io';
import { RxCube } from 'react-icons/rx';
import { Offcanvas, OffcanvasBody, OffcanvasHeader } from 'reactstrap';
import ResponsiveModal from '@/components/common/ResponsiveModal';
import RateOrderModal from './RateOrderModal';
import OrderTracking from './OrderTracking';
import RefundStatus from './RefundStatus';
import OrderDetails from './OrderDetails';
import OrderSummary from './OrderSummary';
import ReturnOrders from './ReturnOrder';
import AccountHeading from '@/components/common/AccountHeading';
import { toast } from 'react-toastify';
import { OrderAPI } from '@/utils/axiosUtils/API';

const MyOrders = () => {
  const [page, setPage] = useState(1);
  const [openOrderDetails, setOpenOrderDetails] = useState(false);
  const [helpModal, setHelpModal] = useState(false);
  const [returnOrderModal, setReturnOrderModal] = useState(false);
  const [rateOrderModal, setRateOrderModal] = useState(false);
  const [selectedOrderForRating, setSelectedOrderForRating] = useState(null);
  const [placedOrders, setPlacedOrders] = useState([]);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [returnStatusMap, setReturnStatusMap] = useState({});

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedOrders = JSON.parse(localStorage.getItem('placedOrders') || '[]');
    setPlacedOrders(Array.isArray(storedOrders) ? storedOrders : []);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const orderIds = [
      ...placedOrders.map((order) => order?.id).filter(Boolean),
      staticReferenceOrder.id,
    ];

    const nextStatusMap = {};
    orderIds.forEach((orderId) => {
      const requests = JSON.parse(
        localStorage.getItem(`returnRequests-${orderId}`) || '[]'
      );
      if (Array.isArray(requests) && requests.length > 0) {
        nextStatusMap[orderId] = requests[0]?.status || null;
      }
    });

    setReturnStatusMap(nextStatusMap);
  }, [placedOrders]);

  const formatPlacedAt = (isoDate) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const mapStatusToTrackingStatus = (status) => {
    const statusMap = {
      confirmed: 'CONFIRMED',
      onway: 'OUT_FOR_DELIVERY',
      delivered: 'DELIVERED',
    };
    return statusMap[status] || 'CONFIRMED';
  };

  const buildOrderDetailsModel = (order) => {
    const fallbackPlacedAt = '10 Dec 2025, 1:14 PM';
    const placedAt = order?.placedAt ? formatPlacedAt(order.placedAt) : fallbackPlacedAt;
    const items = Array.isArray(order?.items) ? order.items : [];

    const itemTotal = items.reduce(
      (sum, item) => sum + (Number(item?.subTotal) || Number(item?.price || 0) * Number(item?.quantity || 1)),
      0
    );
    const discount = items.reduce((sum, item) => {
      const mrp = Number(item?.mrp || 0);
      const price = Number(item?.price || 0);
      const quantity = Number(item?.quantity || 1);
      return sum + Math.max(0, (mrp - price) * quantity);
    }, 0);

    const itemTotalValue = Number(order?.itemTotal || itemTotal || 0);
    const mrpValue = Number(order?.mrp || itemTotalValue + discount || 0);
    const couponDiscountValue = Number(order?.couponDiscount || 0);
    const deliveryChargeValue = Number(order?.shippingCharge || 0);
    const sdlCoinDiscountValue = Number(order?.sdlCoinDiscount || 0);
    const grandTotalValue = Number(order?.total || itemTotalValue || 0);

    return {
      orderId: order?.id || 'QVHVHMPAH58331',
      status: order?.status || 'delivered',
      placedAt,
      arrivedAt: order?.arrivedAt || '',
      total: grandTotalValue,
      items,
      summary: {
        mrp: mrpValue,
        itemTotal: itemTotalValue,
        discountedPrice: itemTotalValue,
        couponDiscount: couponDiscountValue,
        deliveryCharge: deliveryChargeValue,
        sdlCoinDiscount: sdlCoinDiscountValue,
        grandTotal: grandTotalValue,
      },
      receiverName: order?.receiverName || 'Shreyas Munot',
      receiverPhone: order?.receiverPhone || '',
      deliveryAddress: order?.deliveryAddress || '',
      tracking: {
        orderStatus: mapStatusToTrackingStatus(order?.status),
        steps: [
          { key: 'PLACED', label: 'Order Placed', date: placedAt },
          { key: 'CONFIRMED', label: 'Confirmed' },
          { key: 'PACKED', label: 'Packed' },
          { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
          { key: 'DELIVERED', label: 'Delivered' },
        ],
      },
    };
  };

  const staticReferenceOrder = {
    id: 'QVHVHMPAH58331',
    status: 'delivered',
    placedAt: '2025-12-10T13:14:00.000Z',
    total: 419,
    receiverName: 'Shreyas Munot',
    receiverPhone: '+91 9082272677',
    deliveryAddress:
      '501 Heritage heights, plot no 132 prajapita bramhakumari marg near axis bank',
    arrivedAt: '10 Dec 2025, 2:39 PM',
    items: [
      {
        id: 'prod-1',
        name: 'Swamala Classic 200gm',
        image: '/assets/images/product/Swamala-Classic.jpg',
        variant: '1 pack (200 gm)',
        price: 355.5,
        mrp: 395,
        quantity: 1,
        subTotal: 355.5,
      },
      {
        id: 'prod-2',
        name: 'Hingwashtak Choorna 500gm',
        image: '/assets/images/product/Hingwashtak_Choorna.webp',
        variant: '1 pack (500 gm)',
        price: 13.5,
        mrp: 15,
        quantity: 1,
        subTotal: 13.5,
      },
    ],
  };

  const openOrderDetailsWith = (order) => {
    setSelectedOrderDetails(buildOrderDetailsModel(order));
    setOpenOrderDetails(true);
  };

  const getReturnBadgeConfig = (orderId) => {
    const status = returnStatusMap[orderId];
    if (!status) return null;

    const statusMap = {
      REQUESTED: { text: 'RETURN REQUESTED', className: 'pending' },
      APPROVED: { text: 'RETURN APPROVED', className: 'pending' },
      PICKUP_SCHEDULED: { text: 'PICKUP SCHEDULED', className: 'pending' },
      PICKED_UP: { text: 'PICKUP COMPLETED', className: 'pending' },
      REJECTED: { text: 'RETURN REJECTED', className: 'cancelled' },
      REFUNDED: { text: 'REFUND COMPLETED', className: 'completed' },
    };

    return statusMap[status] || null;
  };

  const handleReturnRequestsChange = (orderId, requests = []) => {
    const latestStatus = Array.isArray(requests) && requests.length > 0
      ? requests[0]?.status
      : null;

    setReturnStatusMap((prev) => {
      const next = { ...prev };
      if (latestStatus) {
        next[orderId] = latestStatus;
      } else {
        delete next[orderId];
      }
      return next;
    });
  };

  // Helper function to get status icon and styling
  const getStatusConfig = (status) => {
    const statusMap = {
      confirmed: {
        icon: <FaCheckCircle />,
        text: 'Confirmed',
        className: 'status-confirmed',
      },
      onway: {
        icon: <FaTruck />,
        text: 'On the Way',
        className: 'status-onway',
      },
      delivered: {
        icon: <FaCheckCircle />,
        text: 'Delivered',
        className: 'status-delivered',
      },
      cancelled: {
        icon: <FaTimesCircle />,
        text: 'Cancelled',
        className: 'status-cancelled',
      },
      refunded: {
        icon: <FaUndo />,
        text: 'Refunded',
        className: 'status-refunded',
      },
    };
    return statusMap[status] || statusMap.delivered;
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: [page],
    queryFn: () =>
      request({ url: OrderAPI, params: { page: page, paginate: 10 } }),
    enabled: true,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    select: (res) => res?.data,
  });

  const handleHelpClick = (event) => {
    event.preventDefault();
    console.log("open help dialog")
    // setHelpModal(true);
  };

  const handleReturnClick = (event) => {
    event.preventDefault();
    if (!selectedOrderDetails) {
      toast.info('Please select an order first');
      return;
    }
    setReturnOrderModal(true);
  }

  const handleHelpSubmit = (event) => {
    event.preventDefault();
    setHelpModal(false);
  };

  const handleTrackOrderClick = (event) => {
    event.preventDefault();
    const trackingSection = document.getElementById('order-tracking');
    if (trackingSection) {
      trackingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleRateOrderClick = (event, order = null) => {
    event.preventDefault();
    // If order is provided use it, otherwise use the currently open order details
    const orderToRate = order || selectedOrderDetails;
    if (orderToRate) {
      setSelectedOrderForRating(orderToRate);
    }
    setRateOrderModal(true);
  };

  const handleRateOrderSubmit = async (reviewData) => {
    console.log('Review submitted:', reviewData);
    // toast.success('Thank you for your review!');
    setRateOrderModal(false);
    // TODO: API call to submit review
    // await request({ url: '/reviews', method: 'POST', data: reviewData });
  };

  const activeOrderDetails =
    selectedOrderDetails || buildOrderDetailsModel(staticReferenceOrder);

  return (
    <>
      <AccountHeading title="MyOrders" />
      <div className="total-box mt-0">
        <div className="wallet-table mt-0">
          {/* orders list shows here */}
          {placedOrders.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            const returnBadge = getReturnBadgeConfig(order.id);
            return (
              <div className="order-card" key={order.id}>
                <a
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    openOrderDetailsWith(order);
                  }}
                  className="order-header"
                >
                  <div className="order-info">
                    <div className="status">
                      <span>{`Order ${statusConfig.text.toLowerCase()}`}</span>
                      <span>
                        <RiCheckboxCircleFill className={statusConfig.className} />
                      </span>
                      {returnBadge && (
                        <div className="refund-badge-wrapper">
                          <span className={`refund-badge ${returnBadge.className}`}>
                            {returnBadge.text}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="meta">{`Placed at ${formatPlacedAt(order.placedAt)}`}</p>
                  </div>

                  <div className="order-actions">
                    <span className="price">₹{Number(order.total || 0).toFixed(2)}</span>
                    <span className="menu-btn">
                      <FaChevronRight size={10} />
                    </span>
                  </div>
                </a>

                <a
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    openOrderDetailsWith(order);
                  }}
                  className="product-list"
                >
                  {(order.items || []).slice(0, 3).map((item, index) => (
                    <div
                      className={`product ${Number(item?.quantity || 1) > 1 ? 'more' : ''}`}
                      key={`${order.id}-${item.id || index}`}
                    >
                      <Image
                        src={item.image}
                        alt={item.name || 'product'}
                        draggable={false}
                        width={48}
                        height={48}
                        className="image"
                        unoptimized
                      />
                      {Number(item?.quantity || 1) > 1 && (
                        <span className="count">{Number(item.quantity)}</span>
                      )}
                    </div>
                  ))}
                </a>

                <div className="order-footer">
                  <button
                    className="btn secondary"
                    onClick={(event) => handleRateOrderClick(event, order)}
                  >
                    Rate Order <RiStarFill color="#f5c518" />
                  </button>
                  <button className="btn primary">
                    Order Again
                    <IoMdRefresh   />
                  </button>
                </div>
              </div>
            );
          })}

          <div className="order-card">
            {/* Order header with status */}
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                openOrderDetailsWith(staticReferenceOrder);
              }}
              className="order-header"
            >
              <div className="order-info">
                <div className="status">
                  <span>Order delivered</span>
                  <span>
                    <RiCheckboxCircleFill className={`status-delivered`} />
                  </span>
                  {/* Refund Badge */}
                  <div className="refund-badge-wrapper">
                    <span className="refund-badge completed">
                      REFUND COMPLETED
                    </span>
                  </div>
                </div>
                <p className="meta">Placed at 12th Dec 2025, 10:49 PM</p>
              </div>

              <div className="order-actions">
                <span className="price">₹407</span>
                <span className="menu-btn">
                  <FaChevronRight size={10} />
                </span>
              </div>
            </a>
            {/* Product thumbnails at top */}
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                openOrderDetailsWith(staticReferenceOrder);
              }}
              className="product-list"
            >
              <div className="product">
                {isLoading ? (
                  <div className="imageSkeleton" />
                ) : (
                  <Image
                    src={'/assets/images/product/Swamala-Classic.jpg'}
                    alt={'product.name'}
                    draggable={false}
                    width={48}
                    height={48}
                    className={'image'}
                    unoptimized
                  />
                )}
              </div>
              <div className="product">
                {isLoading ? (
                  <div className="imageSkeleton" />
                ) : (
                  <Image
                    src={'/assets/images/product/Swamala-Classic.jpg'}
                    alt={'product.name'}
                    draggable={false}
                    width={48}
                    height={48}
                    className={'image'}
                    unoptimized
                  />
                )}
              </div>
              <div className="product">
                {isLoading ? (
                  <div className="imageSkeleton" />
                ) : (
                  <Image
                    src={'/assets/images/product/Swamala-Classic.jpg'}
                    alt={'product.name'}
                    draggable={false}
                    width={48}
                    height={48}
                    className={'image'}
                    unoptimized
                  />
                )}
              </div>
            </a>

            <div className="order-footer">
              <button
                className="btn full-width"
                onClick={(e) => handleRateOrderClick(e)}
              >
                Rate Order <RiStarFill color="#f5c518" />
              </button>
              <button className="btn primary">
                Order Again
                <IoMdRefresh   />
              </button>
            </div>
          </div>
          <div className="order-card">
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                openOrderDetailsWith(staticReferenceOrder);
              }}
              className="order-header"
            >
              <div className="order-info">
                <div className="status">
                  <span>Order confirmed</span>
                  <span>
                    <RiCheckboxCircleFill className={`status-confirmed`} />
                  </span>
                </div>
                <p className="meta">Placed at 21st Dec 2025, 01:12 AM</p>
              </div>

              <div className="order-actions">
                <span className="price">₹254</span>
                <span className="menu-btn">
                  <FaChevronRight size={10} />
                </span>
              </div>
            </a>

            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                openOrderDetailsWith(staticReferenceOrder);
              }}
              className="product-list"
            >
              <div className="product">
                {isLoading ? (
                  <div className="imageSkeleton" />
                ) : (
                  <Image
                    src={'/assets/images/product/Hingwashtak_Choorna.webp'}
                    alt={'product.name'}
                    draggable={false}
                    width={48}
                    height={48}
                    className={'image'}
                    unoptimized
                  />
                )}
              </div>
              <div className="product">
                {isLoading ? (
                  <div className="imageSkeleton" />
                ) : (
                  <Image
                    src={'/assets/images/product/Hingwashtak_Choorna.webp'}
                    alt={'product.name'}
                    draggable={false}
                    width={48}
                    height={48}
                    className={'image'}
                    unoptimized
                  />
                )}
              </div>
              <div className="product more">
                {isLoading ? (
                  <div className="imageSkeleton" />
                ) : (
                  <Image
                    src={'/assets/images/product/Hingwashtak_Choorna.webp'}
                    alt={'product.name'}
                    draggable={false}
                    width={48}
                    height={48}
                    className={'image'}
                    unoptimized
                  />
                )}
                <span className="count">2</span>
              </div>
            </a>

            <div className="order-footer">
              <button
                className="btn secondary"
                onClick={(e) => handleRateOrderClick(e)}
              >
                Rate Order <RiStarFill color="#f5c518" />
              </button>
              <button className="btn primary">
                Order Again
                <IoMdRefresh   />
              </button>
            </div>
          </div>
          <div className="order-card">
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                openOrderDetailsWith(staticReferenceOrder);
              }}
              className="order-header"
            >
              <div className="order-info">
                <div className="status">
                  <span>Order cancelled</span>
                  <span>
                    <RiCloseCircleFill className={`status-cancelled`} />
                  </span>
                </div>
                <p className="meta">Placed at 21st Dec 2025, 01:12 AM</p>
              </div>

              <div className="order-actions">
                <span className="price">₹254</span>
                <span className="menu-btn">
                  <FaChevronRight size={10} />
                </span>
              </div>
            </a>

            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                openOrderDetailsWith(staticReferenceOrder);
              }}
              className="product-list"
            >
              <div className="product">
                {isLoading ? (
                  <div className="imageSkeleton" />
                ) : (
                  <Image
                    src={'/assets/images/product/Hingwashtak_Choorna.webp'}
                    alt={'product.name'}
                    draggable={false}
                    width={48}
                    height={48}
                    className={'image'}
                    unoptimized
                  />
                )}
              </div>
              <div className="product more">
                {isLoading ? (
                  <div className="imageSkeleton" />
                ) : (
                  <Image
                    src={'/assets/images/product/Swamala-Classic.jpg'}
                    alt={'product.name'}
                    draggable={false}
                    width={48}
                    height={48}
                    className={'image'}
                    unoptimized
                  />
                )}
                <span className="count">2</span>
              </div>
            </a>

            <div className="order-footer">
              <button
                className="btn secondary"
                onClick={(e) => handleRateOrderClick(e)}
              >
                Rate Order <RiStarFill color="#f5c518" />
              </button>
              <button className="btn primary">
                Order Again
                <IoMdRefresh   />
              </button>
            </div>
          </div>

          {/* this is offcanvas for order details */}
          <Offcanvas
            direction="end"
            isOpen={openOrderDetails}
            className="order-details-offcanvas"
          >
            <OffcanvasHeader toggle={null}>
              <div className="d-flex align-items-center gap-2 flex-grow-1">
                <button
                  type="button"
                  className="close-btn"
                  onClick={() => setOpenOrderDetails(false)}
                  aria-label="Close"
                >
                  <RiCloseFill />
                </button>
                <span className="header-text">
                  <span className="id">Order #{activeOrderDetails?.orderId || 'QVHVHMPAH58331'}</span>
                  <span className="item-count">{activeOrderDetails?.items?.length || 0} items</span>
                </span>
              </div>
              {/* <button type="button" className="pill" onClick={handleHelpClick}>
                <HiOutlineChatBubbleLeftEllipsis className="icon" />
                <span>Get Help</span>
              </button> */}
              <button
                type="button"
                className="pill"
                onClick={handleReturnClick}
              >
                <IoMdRefresh className="icon stroke-w-1" />
                <span>Return</span>
              </button>
            </OffcanvasHeader>
            <OffcanvasBody className="order-details-body" data-lenis-prevent>
              <div
                className={`d-flex justify-content-between align-items-center gap-1 order-status-container ${getStatusConfig(activeOrderDetails?.status || 'delivered').className}`}
              >
                <div className="order-status">
                  <span className="status-icon">
                    {getStatusConfig(activeOrderDetails?.status || 'delivered').icon}
                  </span>
                  <span className="status-text">
                    {getStatusConfig(activeOrderDetails?.status || 'delivered').text}
                  </span>
                </div>
                <button
                  onClick={handleTrackOrderClick}
                  className="btn-tracking"
                >
                  <RxCube /> Track Order
                </button>
              </div>
              <h6 className="order-count">{activeOrderDetails?.items?.length || 0} items in order</h6>
              <ul className="order-items">
                {(activeOrderDetails?.items || []).map((item, index) => (
                  <li className="order-item" key={`${activeOrderDetails?.orderId}-${item?.id || index}`}>
                    <div className="thumb">
                      <img src={item?.image} alt={item?.name || 'Product'} draggable={false} />
                      {Number(item?.quantity || 1) > 1 && (
                        <span className="count">{Number(item.quantity)}</span>
                      )}
                    </div>

                    <div className="info">
                      <span className="name">{item?.name || 'Product'}</span>
                      <span className="meta">
                        {item?.variant || 'Item'}
                        {` • Qty ${item?.quantity || 1}`}
                      </span>
                    </div>

                    <div className="price">
                      <span className="current">
                        ₹{Number(item?.subTotal || (Number(item?.price || 0) * Number(item?.quantity || 1))).toFixed(2)}
                      </span>
                      {Number(item?.mrp || 0) > Number(item?.price || 0) && (
                        <del>₹{(Number(item?.mrp || 0) * Number(item?.quantity || 1)).toFixed(2)}</del>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              {/* Order Summary Section */}
              <OrderSummary
                summary={activeOrderDetails?.summary}
              />

              {/* Order Details Section */}
              <OrderDetails
                order={{
                  orderId: activeOrderDetails?.orderId,
                  receiverName: activeOrderDetails?.receiverName,
                  receiverPhone: activeOrderDetails?.receiverPhone,
                  deliveryAddress: activeOrderDetails?.deliveryAddress,
                  placedAt: activeOrderDetails?.placedAt,
                  arrivedAt: activeOrderDetails?.arrivedAt,
                }}
                onHelpClick={handleHelpClick}
              />

              {/* Order Tracking Section */}
              <div className="tracking-section-wrapper" id="order-tracking">
                <h6 className="section-title">Order Tracking</h6>
                <OrderTracking
                  order={{
                    orderStatus: activeOrderDetails?.tracking?.orderStatus || 'CONFIRMED',
                  }}
                  steps={activeOrderDetails?.tracking?.steps}
                />
              </div>

              {/* Refund Status Section */}
              {/* <div className="refund-section-wrapper">
                <h6 className="section-title">Refund Status</h6>
                <RefundStatus
                  refund={{
                    amount: 106,
                    destination: 'SDLINDIA Cash',
                    initiatedDate: '10 Dec 2025',
                    status: 'COMPLETED',
                    steps: [
                      {
                        key: 'INITIATED',
                        label: 'Refund Initiated',
                        date: '10 Dec 2025',
                      },
                      {
                        key: 'PROCESSING',
                        label: 'Processing',
                        date: '11 Dec 2025',
                      },
                      {
                        key: 'COMPLETED',
                        label: 'Completed',
                        date: '12 Dec 2025',
                      },
                    ],
                  }}
                  variant="timeline"
                />
              </div> */}
              {/* <div className="refund-section-wrapper">
                <h6 className="section-title">Refund Status</h6>
                <RefundStatus
                  refund={{
                    amount: 106,
                    destination: 'SDLINDIA Cash',
                    initiatedDate: '10 Dec 2025',
                    status: 'COMPLETED',
                  }}
                />
              </div> */}
            </OffcanvasBody>
            <div className="order-details-footer">
              <button
                className="btn-secondary"
                onClick={(e) => handleRateOrderClick(e)}
              >
                Rate Order <RiStarFill className="stroke-w-1" color="#f5c518" />
              </button>
              <button className="btn-primary">
                Order Again <IoMdRefresh    className="stroke-w-1" />
              </button>
            </div>
          </Offcanvas>

          <Offcanvas
            direction="end"
            isOpen={returnOrderModal}
            className="order-details-offcanvas return-order-offcanvas"
          >
            <OffcanvasHeader toggle={null}>
              <div className="d-flex align-items-center gap-2 flex-grow-1">
                <button
                  type="button"
                  className="close-btn"
                  onClick={() => setReturnOrderModal(false)}
                  aria-label="Close"
                >
                  <RiCloseFill />
                </button>
                <span className="header-text">
                  <span className="id">Return Orders</span>
                </span>
              </div>
            </OffcanvasHeader>
            <OffcanvasBody className="order-details-body" data-lenis-prevent>
              <ReturnOrders
                showHeading={false}
                orderData={selectedOrderDetails}
                onReturnRequestsChange={handleReturnRequestsChange}
              />
            </OffcanvasBody>
          </Offcanvas>

          {/* help modal */}
          <ResponsiveModal
            modal={helpModal}
            setModal={setHelpModal}
            classes={{
              modalClass: 'theme-modal view-modal modal-md',
              modalHeaderClass: 'justify-content-between',
              modalBodyClass: 'right-sidebar-box',
              title: 'Get Help',
            }}
            backdrop="static"
          >
            <form className="auth-form" onSubmit={handleHelpSubmit}>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    className="form-control"
                    placeholder="Briefly describe the issue"
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">Order Number</label>
                  <input
                    type="text"
                    name="orderNumber"
                    className="form-control"
                    placeholder="e.g. QVHVHMPAH58331"
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">Details</label>
                  <textarea
                    name="message"
                    className="form-control"
                    rows={4}
                    placeholder="Share more details so we can help quickly"
                    required
                  />
                </div>
                <div className="col-12 d-flex gap-2 justify-content-end">
                  <button
                    type="button"
                    className="btn secondary"
                    onClick={() => setHelpModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn primary">
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </ResponsiveModal>

          {/* Rate Order Modal */}
          <RateOrderModal
            isOpen={rateOrderModal}
            onClose={() => setRateOrderModal(false)}
            order={selectedOrderForRating}
            onSubmit={handleRateOrderSubmit}
          />
        </div>
      </div>
    </>
  );
};

export default MyOrders;
