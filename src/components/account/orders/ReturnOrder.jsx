import { useEffect, useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import {
  RiCheckboxCircleFill,
  RiCloseFill,
  RiImageAddLine,
  RiInformationLine,
  RiVideoLine,
  RiErrorWarningLine,
} from 'react-icons/ri';
import {
  FaChevronRight,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaUndo,
  FaMinus,
  FaPlus,
} from 'react-icons/fa';
import { Offcanvas, OffcanvasBody, OffcanvasHeader } from 'reactstrap';
import OrderTracking from './OrderTracking';
import RefundStatus from './RefundStatus';
import OrderDetails from './OrderDetails';
import OrderSummary from './OrderSummary';
import AccountHeading from '@/components/common/AccountHeading';
import './ReturnOrder.scss';

const FALLBACK_PRODUCT_IMAGE = '/assets/images/product/placeholder.png';

const MAX_FILES = 5;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 20 * 1024 * 1024; // 20MB

const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
const allowedVideoTypes = ['video/mp4', 'video/webm'];


// --- Dummy Data ---
const DUMMY_ORDER = {
  orderId: 'QVHVHMPAH58331',
  orderDate: '10 Dec 2025, 1:14 PM',
  deliveryDate: '10 Dec 2025, 2:39 PM',
  receiverName: 'Shreyas Munot',
  receiverPhone: '+91 9082272677',
  deliveryAddress:
    '501 Heritage heights, plot no 132 prajapita bramhakumari marg near axis bank',
};

const DUMMY_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Swamala Classic 200gm',
    slug: 'swamala-classic',
    image: '/assets/images/product/Swamala-Classic.jpg',
    variant: '1 pack (200 gm)',
    price: 355.5,
    mrp: 395,
    orderedQty: 3,
    returnedQty: 0,
  },
  {
    id: 'prod-2',
    name: 'Hingwashtak Choorna 500gm',
    slug: 'hingwashtak-choorna',
    image: '/assets/images/product/Hingwashtak_Choorna.webp',
    variant: '1 pack (500 gm)',
    price: 13.5,
    mrp: 15,
    orderedQty: 2,
    returnedQty: 1,
  },
];

const RETURN_REASONS = [
  'Damaged product',
  'Wrong item received',
  'Quality not as expected',
  'Expired product',
  'Missing items',
  'Changed my mind',
  'Other',
];

const DUMMY_RETURN_REQUESTS = [
  {
    id: 'RET-001',
    submittedDate: '11 Dec 2025, 3:00 PM',
    status: 'REFUNDED',
    products: [
      {
        id: 'prod-2',
        name: 'Hingwashtak Choorna 500gm',
        image: '/assets/images/product/Hingwashtak_Choorna.webp',
        returnQty: 1,
        price: 13.5,
      },
    ],
    reason: 'Damaged product',
    refundAmount: 13.5,
    steps: [
      { key: 'RETURN_REQUESTED', label: 'Return Requested', date: '11 Dec 2025' },
      { key: 'RETURN_APPROVED', label: 'Approved', date: '11 Dec 2025' },
      { key: 'PICKUP_SCHEDULED', label: 'Pickup Scheduled', date: '12 Dec 2025' },
      { key: 'PICKED_UP', label: 'Picked Up', date: '12 Dec 2025' },
      { key: 'REFUNDED', label: 'Refunded', date: '13 Dec 2025' },
    ],
  },
];

// --- Helpers ---
const getStatusConfig = (status) => {
  const map = {
    REQUESTED: { label: 'Requested', className: 'status-requested', icon: <FaUndo /> },
    APPROVED: { label: 'Approved', className: 'status-confirmed', icon: <FaCheckCircle /> },
    REJECTED: { label: 'Rejected', className: 'status-cancelled', icon: <FaTimesCircle /> },
    PICKUP_SCHEDULED: { label: 'Pickup Scheduled', className: 'status-onway', icon: <FaTruck /> },
    PICKED_UP: { label: 'Picked Up', className: 'status-onway', icon: <FaTruck /> },
    REFUNDED: { label: 'Refunded', className: 'status-delivered', icon: <FaCheckCircle /> },
    PARTIAL: { label: 'Partial', className: 'status-requested', icon: <FaUndo /> },
  };
  return map[status] || map.REQUESTED;
};

const VIEW = { CREATE: 'CREATE', OVERVIEW: 'OVERVIEW' };

// === Main Component ===
const ReturnOrders = ({
  showHeading = true,
  orderData = null,
  onReturnRequestsChange,
}) => {
  const [currentView, setCurrentView] = useState(VIEW.OVERVIEW);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // create-return state
  const [selectedProducts, setSelectedProducts] = useState({});
  const [returnQty, setReturnQty] = useState({});
  const [returnReasons, setReturnReasons] = useState({}); // productId -> reason
  const [returnNotes, setReturnNotes] = useState({}); // productId -> notes
  const [returnImages, setReturnImages] = useState({}); // productId -> array of images
  const [uploadErrors, setUploadErrors] = useState({}); // productId -> error message
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [returnRequests, setReturnRequests] = useState(
    orderData ? [] : DUMMY_RETURN_REQUESTS
  );

  const fileInputRef = useRef(null);
  const isInitialized = useRef(false);
  const onReturnRequestsChangeRef = useRef(onReturnRequestsChange);
  const products = useMemo(() => {
    if (!orderData?.items?.length) {
      return DUMMY_PRODUCTS;
    }

    return orderData.items.map((item, index) => ({
      id: String(item?.id || `prod-${index + 1}`),
      name: item?.name || `Product ${index + 1}`,
      slug: item?.slug || '',
      image: item?.image || FALLBACK_PRODUCT_IMAGE,
      variant: item?.variant || 'Standard',
      price: Number(item?.price || item?.subTotal || 0),
      mrp: Number(item?.mrp || item?.price || item?.subTotal || 0),
      orderedQty: Number(item?.quantity || 1),
      returnedQty: 0,
    }));
  }, [orderData]);

  const order = useMemo(() => {
    if (!orderData) {
      return DUMMY_ORDER;
    }

    return {
      orderId: orderData.orderId || DUMMY_ORDER.orderId,
      orderDate: orderData.placedAt || DUMMY_ORDER.orderDate,
      deliveryDate: orderData.arrivedAt || DUMMY_ORDER.deliveryDate,
      receiverName: orderData.receiverName || DUMMY_ORDER.receiverName,
      receiverPhone: orderData.receiverPhone || DUMMY_ORDER.receiverPhone,
      deliveryAddress: orderData.deliveryAddress || DUMMY_ORDER.deliveryAddress,
    };
  }, [orderData]);

  // Update ref when callback changes
  useEffect(() => {
    onReturnRequestsChangeRef.current = onReturnRequestsChange;
  }, [onReturnRequestsChange]);

  // Initialize from localStorage only once
  useEffect(() => {
    if (!orderData || typeof window === 'undefined' || !order?.orderId || isInitialized.current) return;
    const key = `returnRequests-${order.orderId}`;
    const stored = JSON.parse(localStorage.getItem(key) || '[]');
    if (Array.isArray(stored)) {
      setReturnRequests(stored);
    }
    isInitialized.current = true;
  }, [orderData, order?.orderId]);

  useEffect(() => {
    if (!orderData || typeof window === 'undefined' || !order?.orderId) return;
    const key = `returnRequests-${order.orderId}`;
    localStorage.setItem(key, JSON.stringify(returnRequests));
  }, [orderData, order?.orderId, returnRequests]);

  useEffect(() => {
    if (!order?.orderId || typeof onReturnRequestsChangeRef.current !== 'function') return;
    onReturnRequestsChangeRef.current(order.orderId, returnRequests);
  }, [order?.orderId, returnRequests]);

  // cumulative returned qty per product
  const cumulativeReturned = useMemo(() => {
    const map = {};
    products.forEach((p) => {
      map[p.id] = p.returnedQty || 0;
    });
    returnRequests.forEach((req) => {
      req.products.forEach((rp) => {
        map[rp.id] = (map[rp.id] || 0) + (req.status !== 'REJECTED' ? rp.returnQty : 0);
      });
    });
    products.forEach((p) => {
      map[p.id] = Math.min(map[p.id], p.orderedQty);
    });
    return map;
  }, [products, returnRequests]);

  const maxReturnable = (productId) => {
    const normalizedProductId = String(productId);
    const product = products.find((p) => String(p.id) === normalizedProductId);
    if (!product) return 0;
    return product.orderedQty - (cumulativeReturned[normalizedProductId] || 0);
  };

  const selectedCount = Object.keys(selectedProducts).filter((k) => selectedProducts[k]).length;

  const estimatedRefund = useMemo(() => {
    let total = 0;
    Object.keys(selectedProducts).forEach((pid) => {
      if (selectedProducts[pid]) {
        const product = products.find((p) => String(p.id) === String(pid));
        if (product) total += product.price * (returnQty[pid] || 1);
      }
    });
    return total;
  }, [selectedProducts, returnQty, products]);

  // Check if all selected products have reasons and minimum uploads
  const canSubmit = useMemo(() => {
    if (selectedCount === 0 || isSubmitting) return false;
    const selectedIds = Object.keys(selectedProducts).filter(k => selectedProducts[k]);
    // Check if all have reasons
    const hasReasons = selectedIds.every(pid => returnReasons[pid]?.trim());
    // Check if all have minimum 2 uploads
    const hasMinUploads = selectedIds.every(pid => {
      const files = returnImages[pid] || [];
      return files.length >= 2;
    });
    return hasReasons && hasMinUploads;
  }, [selectedCount, isSubmitting, selectedProducts, returnReasons, returnImages]);

  // --- Handlers ---
  const handleToggleProduct = (productId) => {
    const normalizedProductId = String(productId);
    const maxQty = maxReturnable(normalizedProductId);
    if (maxQty <= 0) return;
    setSelectedProducts((prev) => {
      const next = {
        ...prev,
        [normalizedProductId]: !prev[normalizedProductId],
      };
      if (!next[normalizedProductId]) {
        // Clear all data for this product when deselected
        setReturnQty((q) => { const nq = { ...q }; delete nq[normalizedProductId]; return nq; });
        setReturnReasons((r) => { const nr = { ...r }; delete nr[normalizedProductId]; return nr; });
        setReturnNotes((n) => { const nn = { ...n }; delete nn[normalizedProductId]; return nn; });
        setReturnImages((imgs) => {
          const nimgs = { ...imgs };
          // Revoke URLs before deleting
          if (nimgs[normalizedProductId]) {
            nimgs[normalizedProductId].forEach(img => URL.revokeObjectURL(img.preview));
          }
          delete nimgs[normalizedProductId];
          return nimgs;
        });
      } else {
        setReturnQty((q) => ({ ...q, [normalizedProductId]: 1 }));
      }
      return next;
    });
  };

  const handleQtyChange = (productId, delta) => {
    const normalizedProductId = String(productId);
    const max = maxReturnable(normalizedProductId);
    setReturnQty((prev) => ({
      ...prev,
      [normalizedProductId]: Math.min(max, Math.max(1, (prev[normalizedProductId] || 1) + delta)),
    }));
  };

  const handleImageUpload = (productId, e) => {
    const files = Array.from(e.target.files || []);
    const existingFiles = returnImages[productId] || [];
    
    // Clear previous errors
    setUploadErrors(prev => ({ ...prev, [productId]: null }));

    // Validate file count
    if (existingFiles.length + files.length > MAX_FILES) {
      setUploadErrors(prev => ({
        ...prev,
        [productId]: `Maximum ${MAX_FILES} files allowed. You can upload ${MAX_FILES - existingFiles.length} more.`
      }));
      if (e.target) e.target.value = '';
      return;
    }

    // Validate each file
    const validatedFiles = [];
    const errors = [];

    for (const file of files) {
      const fileType = file.type;
      const fileSize = file.size;
      const isImage = allowedImageTypes.includes(fileType);
      const isVideo = allowedVideoTypes.includes(fileType);

      // Check file type
      if (!isImage && !isVideo) {
        errors.push(`${file.name}: Invalid file type. Only JPG, PNG, WebP images and MP4, WebM videos are allowed.`);
        continue;
      }

      // Check file size
      if (isImage && fileSize > MAX_IMAGE_SIZE) {
        errors.push(`${file.name}: Image size must be less than 5MB.`);
        continue;
      }

      if (isVideo && fileSize > MAX_VIDEO_SIZE) {
        errors.push(`${file.name}: Video size must be less than 20MB.`);
        continue;
      }

      // File is valid
      validatedFiles.push({
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        preview: URL.createObjectURL(file),
        type: isImage ? 'image' : 'video',
        size: fileSize,
        name: file.name,
      });
    }

    // Show errors if any
    if (errors.length > 0) {
      setUploadErrors(prev => ({
        ...prev,
        [productId]: errors.join(' ')
      }));
    }

    // Add valid files
    if (validatedFiles.length > 0) {
      setReturnImages((prev) => ({
        ...prev,
        [productId]: [...existingFiles, ...validatedFiles]
      }));
    }

    if (e.target) e.target.value = '';
  };

  const handleRemoveImage = (productId, imageId) => {
    setReturnImages((prev) => {
      const productImages = prev[productId] || [];
      const img = productImages.find((i) => i.id === imageId);
      if (img) URL.revokeObjectURL(img.preview);
      return {
        ...prev,
        [productId]: productImages.filter((i) => i.id !== imageId)
      };
    });
    // Clear error if exists
    setUploadErrors(prev => ({ ...prev, [productId]: null }));
  };

  const handleSubmitReturn = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    
    try {
      // Prepare FormData for API submission
      const formData = new FormData();
      
      // Add order information
      formData.append('orderId', order.orderId);
      formData.append('totalRefundAmount', estimatedRefund);
      
      // Add each selected product with its details
      const selectedIds = Object.keys(selectedProducts).filter((pid) => selectedProducts[pid]);
      
      selectedIds.forEach((pid, index) => {
        const product = products.find((p) => String(p.id) === String(pid));
        if (!product) return;
        
        const qty = returnQty[pid] || 1;
        const reason = returnReasons[pid] || '';
        const notes = returnNotes[pid] || '';
        const files = returnImages[pid] || [];
        
        // Add product data
        formData.append(`products[${index}][id]`, pid);
        formData.append(`products[${index}][name]`, product.name);
        formData.append(`products[${index}][returnQty]`, qty);
        formData.append(`products[${index}][price]`, product.price);
        formData.append(`products[${index}][reason]`, reason);
        formData.append(`products[${index}][notes]`, notes);
        
        // Add files for this product
        files.forEach((fileObj, fileIndex) => {
          formData.append(`products[${index}][files][${fileIndex}]`, fileObj.file);
          formData.append(`products[${index}][files][${fileIndex}][type]`, fileObj.type);
        });
      });
      
      // TODO: Replace with your actual API endpoint
      // const response = await fetch('/api/orders/return', {
      //   method: 'POST',
      //   body: formData,
      // });
      // const result = await response.json();
      // if (!response.ok) throw new Error(result.message || 'Failed to submit return');
      
      // Simulate API call for now
      await new Promise((r) => setTimeout(r, 800));
      
      const newRequest = {
        id: `RET-${Date.now().toString(36).toUpperCase()}`,
        submittedDate: new Date().toLocaleString('en-IN', {
          day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true,
        }),
        status: 'REQUESTED',
        reason: 'Multiple items', // Overall reason for compatibility
        notes: 'See individual product reasons',
        refundAmount: estimatedRefund,
        products: Object.keys(selectedProducts)
          .filter((pid) => selectedProducts[pid])
          .map((pid) => {
            const p = products.find((pr) => String(pr.id) === String(pid));
            return {
              id: String(pid),
              name: p?.name || 'Product',
              image: p?.image || FALLBACK_PRODUCT_IMAGE,
              returnQty: returnQty[pid] || 1,
              price: Number(p?.price || 0),
              reason: returnReasons[pid] || '',
              notes: returnNotes[pid] || '',
              filesCount: (returnImages[pid] || []).length,
            };
          }),
        steps: [
          { key: 'RETURN_REQUESTED', label: 'Return Requested', date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
          { key: 'RETURN_APPROVED', label: 'Approved' },
          { key: 'PICKUP_SCHEDULED', label: 'Pickup Scheduled' },
          { key: 'PICKED_UP', label: 'Picked Up' },
          { key: 'REFUNDED', label: 'Refunded' },
        ],
      };
      
      setReturnRequests((prev) => [newRequest, ...prev]);
      setSubmitSuccess(true);
      setIsSubmitting(false);
      setTimeout(() => {
        resetCreateForm();
        setCurrentView(VIEW.OVERVIEW);
        setSubmitSuccess(false);
      }, 1500);
    } catch (error) {
      console.error('Error submitting return:', error);
      setIsSubmitting(false);
      // Show error to user
      alert('Failed to submit return request. Please try again.');
    }
  };

  const resetCreateForm = () => {
    setSelectedProducts({});
    setReturnQty({});
    setReturnReasons({});
    setReturnNotes({});    setUploadErrors({});    // Revoke all image URLs before clearing
    Object.values(returnImages).forEach(images => {
      images.forEach(img => URL.revokeObjectURL(img.preview));
    });
    setReturnImages({});
  };

  const handleViewRequestDetails = (req) => {
    setSelectedRequest(req);
    setOpenDetails(true);
  };

  const returnableProducts = products.filter((p) => maxReturnable(p.id) > 0);
  const fullyReturnedProducts = products.filter((p) => maxReturnable(p.id) <= 0);

  // === RENDER ===
  return (
    <>
      {showHeading && <AccountHeading title="Return Orders" />}
      <div className="total-box mt-0">
        <div className="wallet-table mt-0">
          {/* View Tabs */}
          <div className="return-view-tabs">
            <button
              className={`tab-btn ${currentView === VIEW.OVERVIEW ? 'active' : ''}`}
              onClick={() => setCurrentView(VIEW.OVERVIEW)}
            >
              Return Requests
            </button>
            <button
              className={`tab-btn ${currentView === VIEW.CREATE ? 'active' : ''}`}
              onClick={() => {
                resetCreateForm();
                setCurrentView(VIEW.CREATE);
              }}
              disabled={returnableProducts.length === 0}
            >
              New Return
            </button>
          </div>

          {/* === CREATE VIEW === */}
          {currentView === VIEW.CREATE && (
            <div className="return-create-form">
              {/* 1. Product Selection */}
              <div className="return-section">
                <h6 className="section-title">Select Products to Return</h6>
                <p className="section-subtitle">
                  Choose items and set the quantity you want to return.
                </p>
                <ul className="return-product-list">
                  {returnableProducts.map((product) => {
                    const maxQty = maxReturnable(product.id);
                    const isSelected = !!selectedProducts[product.id];
                    const alreadyReturned = cumulativeReturned[product.id] || 0;
                    return (
                      <li
                        key={product.id}
                        className={`return-product-item ${isSelected ? 'selected' : ''}`}
                      >
                        <label className="product-checkbox-label">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleProduct(product.id)}
                            className="product-checkbox"
                          />
                          <div className="product-thumb">
                            <Image
                              src={product.image || FALLBACK_PRODUCT_IMAGE}
                              alt={product.name}
                              width={56}
                              height={56}
                              draggable={false}
                              unoptimized
                            />
                          </div>
                          <div className="product-info">
                            <span className="product-name">{product.name}</span>
                            <span className="product-variant">
                              {product.variant}
                            </span>
                            <div className="product-price-row">
                              <span className="product-price">
                                ₹{product.price.toFixed(2)}
                              </span>
                              {product.mrp > product.price && (
                                <del className="product-mrp">
                                  ₹{product.mrp.toFixed(2)}
                                </del>
                              )}
                            </div>
                            <span className="product-ordered-qty">
                              Ordered: {product.orderedQty}
                              {alreadyReturned > 0 && (
                                <span className="already-returned">
                                  {' '}
                                  · {alreadyReturned} already returned
                                </span>
                              )}
                            </span>
                          </div>
                        </label>
                        {isSelected && (
                          <div className="qty-selector">
                            <span className="qty-label">Return Qty</span>
                            <div className="qty-controls">
                              <button
                                type="button"
                                className="qty-btn"
                                disabled={(returnQty[product.id] || 1) <= 1}
                                onClick={() => handleQtyChange(product.id, -1)}
                              >
                                <FaMinus size={10} />
                              </button>
                              <span className="qty-value">
                                {returnQty[product.id] || 1}
                              </span>
                              <button
                                type="button"
                                className="qty-btn"
                                disabled={
                                  (returnQty[product.id] || 1) >= maxQty
                                }
                                onClick={() => handleQtyChange(product.id, 1)}
                              >
                                <FaPlus size={10} />
                              </button>
                            </div>
                            <span className="qty-max">Max: {maxQty}</span>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
                {fullyReturnedProducts.length > 0 && (
                  <div className="fully-returned-section">
                    <h6 className="subsection-title">Fully Returned</h6>
                    <ul className="return-product-list disabled">
                      {fullyReturnedProducts.map((product) => (
                        <li
                          key={product.id}
                          className="return-product-item disabled"
                        >
                          <div className="product-thumb">
                            <Image
                              src={product.image || FALLBACK_PRODUCT_IMAGE}
                              alt={product.name}
                              width={56}
                              height={56}
                              draggable={false}
                              unoptimized
                            />
                          </div>
                          <div className="product-info">
                            <span className="product-name">{product.name}</span>
                            <span className="product-variant">
                              {product.variant}
                            </span>
                            <span className="badge-returned">
                              All items returned
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* 2. Return Details - Per Product */}
              {selectedCount > 0 && (
                <div className="return-section">
                  <h6 className="section-title">
                    Return Details for Each Product
                  </h6>
                  <p className="section-subtitle">
                    Provide reason and details for each product you're
                    returning.
                  </p>

                  {Object.keys(selectedProducts)
                    .filter((pid) => selectedProducts[pid])
                    .map((pid) => {
                      const product = products.find(
                        (p) => String(p.id) === String(pid)
                      );
                      if (!product) return null;
                      const productReason = returnReasons[pid] || '';
                      const productNotes = returnNotes[pid] || '';
                      const productImages = returnImages[pid] || [];

                      return (
                        <div key={pid} className="product-return-detail-card">
                          <div className="product-return-header">
                            <div className="product-thumb-small">
                              <Image
                                src={product.image || FALLBACK_PRODUCT_IMAGE}
                                alt={product.name}
                                width={40}
                                height={40}
                                draggable={false}
                                unoptimized
                              />
                            </div>
                            <div className="product-details">
                              <span className="product-name-small">
                                {product.name}
                              </span>
                              <span className="product-qty-small">
                                Returning: {returnQty[pid] || 1}{' '}
                                {(returnQty[pid] || 1) > 1 ? 'items' : 'item'}
                              </span>
                            </div>
                          </div>

                          <div className="form-group">
                            <label className="form-label">
                              Reason for Return{' '}
                              <span className="required">*</span>
                            </label>
                            <select
                              className="form-select"
                              value={productReason}
                              onChange={(e) =>
                                setReturnReasons((prev) => ({
                                  ...prev,
                                  [pid]: e.target.value,
                                }))
                              }
                            >
                              <option value="">Select a reason</option>
                              {RETURN_REASONS.map((reason) => (
                                <option key={reason} value={reason}>
                                  {reason}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="form-group">
                            <label className="form-label">
                              Additional Details (Optional)
                            </label>
                            <textarea
                              className="form-control"
                              rows={2}
                              placeholder="Share more details about the issue..."
                              value={productNotes}
                              onChange={(e) =>
                                setReturnNotes((prev) => ({
                                  ...prev,
                                  [pid]: e.target.value,
                                }))
                              }
                            />
                          </div>

                          <div className="form-group">
                            <label className="form-label">
                              Upload Proof (Images/Videos){' '}
                              <span className="required">
                                * Min 2 files required
                              </span>
                            </label>
                            <p className="form-helper-text">
                              Max {MAX_FILES} files • Images: max 5MB • Videos:
                              max 20MB • {productImages.length}/{MAX_FILES}{' '}
                              uploaded
                            </p>

                            {uploadErrors[pid] && (
                              <div className="upload-error-message">
                                <RiErrorWarningLine size={16} />
                                <span>{uploadErrors[pid]}</span>
                              </div>
                            )}

                            <div className="proof-upload-area">
                              {productImages.map((file) => (
                                <div
                                  key={file.id}
                                  className={`proof-thumb ${file.type}`}
                                >
                                  {file.type === 'image' ? (
                                    <img
                                      src={file.preview}
                                      alt="Proof"
                                      draggable={false}
                                    />
                                  ) : (
                                    <div className="video-preview">
                                      <video
                                        src={file.preview}
                                        draggable={false}
                                      />
                                      <div className="video-overlay">
                                        <RiVideoLine size={24} />
                                      </div>
                                    </div>
                                  )}
                                  <button
                                    type="button"
                                    className="remove-proof"
                                    onClick={() =>
                                      handleRemoveImage(pid, file.id)
                                    }
                                    aria-label="Remove file"
                                  >
                                    <RiCloseFill size={14} />
                                  </button>
                                  <div className="file-info">
                                    <span className="file-type-badge">
                                      {file.type === 'image' ? 'IMG' : 'VID'}
                                    </span>
                                    <span className="file-size">
                                      {(file.size / 1024 / 1024).toFixed(2)}MB
                                    </span>
                                  </div>
                                </div>
                              ))}

                              {productImages.length < MAX_FILES && (
                                <button
                                  type="button"
                                  className="add-proof-btn"
                                  onClick={() =>
                                    document
                                      .getElementById(`file-input-${pid}`)
                                      .click()
                                  }
                                >
                                  <RiImageAddLine size={20} />
                                  <span>Add Files</span>
                                  <span className="btn-helper">
                                    Images/Videos
                                  </span>
                                </button>
                              )}

                              <input
                                id={`file-input-${pid}`}
                                type="file"
                                accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
                                multiple
                                hidden
                                onChange={(e) => handleImageUpload(pid, e)}
                              />
                            </div>

                            {productImages.length < 2 && (
                              <div className="upload-warning-message">
                                <RiInformationLine size={14} />
                                <span>
                                  Please upload at least 2 files (images or
                                  videos) as proof for your return request.
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}

              {/* 3. Order Information */}
              <div className="return-section">
                <h6 className="section-title">Order Information</h6>
                <div className="return-info-grid">
                  <div className="info-row">
                    <span className="info-label">Order ID</span>
                    <span className="info-value">#{order.orderId}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Order Date</span>
                    <span className="info-value">{order.orderDate}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Delivery Date</span>
                    <span className="info-value">{order.deliveryDate}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Refund Method</span>
                    <span className="info-value">SDLINDIA Cash</span>
                  </div>
                </div>

                {/* Delivery Address */}
                {order.deliveryAddress && (
                  <div className="return-address-section">
                    <h6 className="subsection-title">Pickup Address</h6>
                    <div className="address-card">
                      <p className="address-name">{order.receiverName}</p>
                      {order.receiverPhone && (
                        <p className="address-phone">{order.receiverPhone}</p>
                      )}
                      <p className="address-text">{order.deliveryAddress}</p>
                    </div>
                  </div>
                )}

                <div className="return-policy-note">
                  <RiInformationLine size={16} />
                  <span>
                    Items are eligible for return within 7 days of delivery.
                    Refunds are processed within 5-7 business days after pickup.
                  </span>
                </div>

                {/* SDL Coins Disclaimer */}
                <div className="return-policy-note sdl-coins-disclaimer">
                  <RiInformationLine size={16} />
                  <span>
                    <strong>SDL Coins Notice:</strong> Any SDL coins used for
                    this order will also be returned when the refund is
                    completed. Please note that the returned SDL coins will not
                    be available for use until the refund process is finalized.
                  </span>
                </div>
              </div>

              {/* 4. Summary & Submission */}
              {selectedCount > 0 && (
                <div className="return-section return-summary-section">
                  <h6 className="section-title">Return Summary</h6>
                  <ul className="summary-product-list">
                    {Object.keys(selectedProducts)
                      .filter((pid) => selectedProducts[pid])
                      .map((pid) => {
                        const p = products.find(
                          (pr) => String(pr.id) === String(pid)
                        );
                        const qty = returnQty[pid] || 1;
                        const reason = returnReasons[pid] || '';
                        if (!p) return null;
                        return (
                          <li
                            key={pid}
                            className="summary-product-item with-reason"
                          >
                            <div className="summary-product-thumb">
                              <Image
                                src={p.image || FALLBACK_PRODUCT_IMAGE}
                                alt={p.name}
                                width={40}
                                height={40}
                                draggable={false}
                                unoptimized
                              />
                            </div>
                            <div className="summary-product-info">
                              <span className="name">{p.name}</span>
                              <span className="qty">Qty: {qty}</span>
                              {p.variant && (
                                <span className="variant">{p.variant}</span>
                              )}
                              {reason && (
                                <span className="reason-tag">{reason}</span>
                              )}
                            </div>
                            <span className="summary-product-price">
                              ₹{(p.price * qty).toFixed(2)}
                            </span>
                          </li>
                        );
                      })}
                  </ul>

                  {/* Return Summary Bill */}
                  <div className="return-bill-details">
                    <div className="bill-row">
                      <span>Return items total</span>
                      <span>₹{estimatedRefund.toFixed(2)}</span>
                    </div>
                    <div className="bill-row total">
                      <span>Estimated Refund</span>
                      <span className="total-amount">
                        ₹{estimatedRefund.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* SDL Coins Return Notice */}
                  <div className="return-policy-note sdl-coins-disclaimer compact">
                    <RiInformationLine size={14} />
                    <span>
                      SDL coins used for this order will be returned upon refund
                      completion and won&apos;t be usable until then.
                    </span>
                  </div>

                  {submitSuccess && (
                    <div className="submit-success-msg">
                      <RiCheckboxCircleFill size={18} />
                      <span>Return request submitted successfully!</span>
                    </div>
                  )}
                  <button
                    className="btn-submit-return btn-primary"
                    disabled={!canSubmit}
                    onClick={handleSubmitReturn}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Return Request'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* === OVERVIEW VIEW === */}
          {currentView === VIEW.OVERVIEW && (
            <div className="return-overview">
              {returnRequests.length > 0 ? (
                <div className="return-requests-list">
                  {returnRequests.map((req) => {
                    const statusCfg = getStatusConfig(req.status);
                    return (
                      <div
                        key={req.id}
                        className="order-card return-request-card"
                        onClick={() => handleViewRequestDetails(req)}
                      >
                        <div className="order-header">
                          <div className="order-info">
                            <div className="status">
                              <span>{req.id}</span>
                              <span className={statusCfg.className}>
                                {statusCfg.icon}
                              </span>
                              <div className="refund-badge-wrapper">
                                <span
                                  className={`refund-badge ${req.status === 'REFUNDED' ? 'completed' : req.status === 'REJECTED' ? 'cancelled' : 'pending'}`}
                                >
                                  {statusCfg.label.toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <p className="meta">
                              Submitted: {req.submittedDate}
                            </p>
                          </div>
                          <div className="order-actions">
                            <span className="price">
                              ₹{req.refundAmount?.toFixed(2)}
                            </span>
                            <span className="menu-btn">
                              <FaChevronRight size={10} />
                            </span>
                          </div>
                        </div>
                        <div className="product-list">
                          {req.products.map((rp) => (
                            <div key={rp.id} className="product">
                              <Image
                                src={rp.image || FALLBACK_PRODUCT_IMAGE}
                                alt={rp.name}
                                width={48}
                                height={48}
                                draggable={false}
                                className="image"
                                unoptimized
                              />
                            </div>
                          ))}
                        </div>
                        <div className="return-request-meta">
                          <span className="meta-label">Reason:</span>
                          <span className="meta-value">{req.reason}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="no-returns">
                  <p>No return requests yet.</p>
                </div>
              )}

              {/* Product Return Status */}
              <div className="return-section product-split-section">
                <h6 className="section-title">Product Available for Return</h6>
                {returnableProducts.length > 0 && (
                  <div className="product-split-group">
                    {/* <span className="split-label available">Available for Return</span> */}
                    <ul className="return-product-list compact">
                      {returnableProducts.map((p) => {
                        const returned = cumulativeReturned[p.id] || 0;
                        const remaining = p.orderedQty - returned;
                        return (
                          <li
                            key={p.id}
                            className="return-product-item compact"
                          >
                            <div className="product-thumb">
                              <Image
                                src={p.image || FALLBACK_PRODUCT_IMAGE}
                                alt={p.name}
                                width={40}
                                height={40}
                                draggable={false}
                                unoptimized
                              />
                            </div>
                            <div className="product-info">
                              <span className="product-name">{p.name}</span>
                              <span className="product-variant">
                                {remaining} of {p.orderedQty} remaining
                              </span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                {fullyReturnedProducts.length > 0 && (
                  <div className="product-split-group">
                    <span className="split-label returned">
                      Returned / In-Return
                    </span>
                    <ul className="return-product-list compact disabled">
                      {fullyReturnedProducts.map((p) => (
                        <li
                          key={p.id}
                          className="return-product-item compact disabled"
                        >
                          <div className="product-thumb">
                            <Image
                              src={p.image || FALLBACK_PRODUCT_IMAGE}
                              alt={p.name}
                              width={40}
                              height={40}
                              draggable={false}
                              unoptimized
                            />
                          </div>
                          <div className="product-info">
                            <span className="product-name">{p.name}</span>
                            <span className="badge-returned">
                              All items returned
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {returnableProducts.length > 0 && (
                <button
                  className="btn-submit-return btn-primary"
                  onClick={() => {
                    resetCreateForm();
                    setCurrentView(VIEW.CREATE);
                  }}
                >
                  Create New Return Request
                </button>
              )}
            </div>
          )}

          {/* === OFFCANVAS: Return Request Details === */}
          <Offcanvas
            direction="end"
            isOpen={openDetails}
            className="order-details-offcanvas return-detail-offcanvas"
          >
            <OffcanvasHeader toggle={null}>
              <div className="d-flex align-items-center gap-2 flex-grow-1">
                <button
                  type="button"
                  className="close-btn"
                  onClick={() => setOpenDetails(false)}
                  aria-label="Close"
                >
                  <RiCloseFill />
                </button>
                <span className="header-text">
                  <span className="id">Return {selectedRequest?.id}</span>
                  <span className="item-count">
                    {selectedRequest?.products?.length} item
                    {selectedRequest?.products?.length > 1 ? 's' : ''}
                  </span>
                </span>
              </div>
            </OffcanvasHeader>
            <OffcanvasBody className="order-details-body" data-lenis-prevent>
              {selectedRequest && (
                <>
                  {/* Status */}
                  <div
                    className={`d-flex justify-content-between align-items-center gap-1 order-status-container ${getStatusConfig(selectedRequest.status).className}`}
                  >
                    <div className="order-status">
                      <span className="status-icon">
                        {getStatusConfig(selectedRequest.status).icon}
                      </span>
                      <span className="status-text">
                        {getStatusConfig(selectedRequest.status).label}
                      </span>
                    </div>
                  </div>

                  <h6 className="order-count">
                    {selectedRequest.products.length} item
                    {selectedRequest.products.length > 1 ? 's' : ''} in return
                  </h6>
                  <ul className="order-items">
                    {selectedRequest.products.map((rp) => (
                      <li key={rp.id} className="order-item">
                        <div className="thumb">
                          <img
                            src={rp.image || FALLBACK_PRODUCT_IMAGE}
                            alt={rp.name}
                            draggable={false}
                          />
                        </div>
                        <div className="info">
                          <span className="name">{rp.name}</span>
                          <span className="meta">
                            Return Qty: {rp.returnQty}
                          </span>
                        </div>
                        <div className="price">
                          <span className="current">
                            ₹{(rp.price * rp.returnQty).toFixed(2)}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="return-section">
                    <h6 className="section-title">Return Reason</h6>
                    <p className="return-reason-text">
                      {selectedRequest.reason}
                    </p>
                  </div>

                  <OrderSummary
                    summary={{
                      mrp: selectedRequest.refundAmount,
                      itemTotal: selectedRequest.refundAmount,
                      discountedPrice: 0,
                      couponDiscount: 0,
                      deliveryCharge: 0,
                      grandTotal: selectedRequest.refundAmount,
                    }}
                  />

                  <OrderDetails
                    order={{
                      orderId: order.orderId,
                      receiverName: order.receiverName,
                      receiverPhone: order.receiverPhone,
                      deliveryAddress: order.deliveryAddress,
                      placedAt: order.orderDate,
                      arrivedAt: order.deliveryDate,
                    }}
                  />

                  {/* SDL Coins Disclaimer */}
                  <div className="return-section">
                    <div className="return-policy-note sdl-coins-disclaimer">
                      <RiInformationLine size={16} />
                      <span>
                        <strong>SDL Coins Notice:</strong> Any SDL coins used
                        for this order will also be returned when the refund is
                        completed. Please note that the returned SDL coins will
                        not be available for use until the refund process is
                        finalized.
                      </span>
                    </div>
                  </div>

                  <div
                    className="tracking-section-wrapper"
                    id="return-tracking"
                  >
                    <h6 className="section-title">Return Tracking</h6>
                    <OrderTracking
                      returnOrder={{ returnStatus: selectedRequest.status }}
                      steps={selectedRequest.steps}
                    />
                  </div>

                  {(selectedRequest.status === 'REFUNDED' ||
                    selectedRequest.status === 'PICKED_UP') && (
                    <div className="refund-section-wrapper">
                      <h6 className="section-title">Refund Status</h6>
                      <RefundStatus
                        refund={{
                          amount: selectedRequest.refundAmount,
                          destination: 'SDLINDIA Cash',
                          initiatedDate: selectedRequest.submittedDate,
                          status:
                            selectedRequest.status === 'REFUNDED'
                              ? 'COMPLETED'
                              : 'PROCESSING',
                        }}
                      />
                    </div>
                  )}
                </>
              )}
            </OffcanvasBody>
          </Offcanvas>
        </div>
      </div>
    </>
  );
};

export default ReturnOrders;
