import { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import ResponsiveModal from '@/components/common/ResponsiveModal';
import SuccessModal from '@/components/common/SuccessModal';
import { RiStarFill, RiStarLine, RiImageAddLine } from 'react-icons/ri';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ratingSchema } from '@/utils/validation/ZodValidationSchema';

// Sample feedback questions - these would come from API in real usage
const DEFAULT_FEEDBACK_QUESTIONS = [
  {
    id: 'quality',
    question: 'What went wrong?',
    options: ['Damaged', 'Dirty packing', 'Less quantity', 'Stale product', 'Wrong item'],
  },
  {
    id: 'freshness',
    question: 'How was the freshness?',
    options: ['Very fresh', 'Okay', 'Not fresh', 'Expired'],
  },
];

const StarRating = ({ rating, onRate, size = 20 }) => {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="star-btn"
          onClick={() => onRate(star)}
          aria-label={`Rate ${star} stars`}
        >
          {star <= rating ? (
            <RiStarFill className="star filled" style={{ fontSize: size }} />
          ) : (
            <RiStarLine className="star" style={{ fontSize: size }} />
          )}
        </button>
      ))}
    </div>
  );
};

const ProductRatingItem = ({ 
  product, 
  rating, 
  onRatingChange, 
  feedbackQuestions = DEFAULT_FEEDBACK_QUESTIONS,
  selectedOptions,
  onOptionToggle,
  comment,
  onCommentChange 
}) => {
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);
  const isExpanded = rating > 0;

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isExpanded ? contentRef.current.scrollHeight : 0);
    }
  }, [isExpanded, selectedOptions, comment]);

  const handleStarClick = (star) => {
    // If clicking on the same star that's currently the max rating, reset
    if (star === rating) {
      onRatingChange(0);
    } else {
      onRatingChange(star);
    }
  };

  return (
    <div className="product-rating-item">
      <div className="product-rating-row">
        <div className="product-info">
          <div className="product-thumb">
            <Image
              src={
                product.image ||
                'https://react.pixelstrap.net/fastkart/assets/product.png'
              }
              alt={product.name}
              width={40}
              height={40}
              draggable={false}
              unoptimized
            />
          </div>
          <span className="product-name">{product.name}</span>
        </div>
        <StarRating rating={rating} onRate={handleStarClick} size={18} />
      </div>

      {/* Animated feedback section */}
      <div
        className="feedback-section"
        style={{
          height: contentHeight,
          overflow: 'hidden',
          transition: 'height 0.3s ease-in-out',
        }}
      >
        <div ref={contentRef} className="feedback-content">
          {feedbackQuestions.map((q) => (
            <div key={q.id} className="feedback-question">
              <p className="question-text">{q.question}</p>
              <div className="options-list">
                {q.options.map((option) => {
                  const isSelected = selectedOptions[q.id]?.includes(option);
                  return (
                    <button
                      key={option}
                      type="button"
                      className={`option-pill ${isSelected ? 'selected' : ''}`}
                      onClick={() => onOptionToggle(q.id, option)}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="comment-section">
            <textarea
              className="comment-textarea"
              placeholder="Write your reviews here..."
              value={comment}
              onChange={(e) => onCommentChange(e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const FALLBACK_IMAGE = 'https://react.pixelstrap.net/fastkart/assets/product.png';

const RateOrderModal = ({ 
  isOpen, 
  onClose, 
  order,
  onSubmit 
}) => {
  // Build products list from order items dynamically
  const products = useMemo(() => {
    if (order?.items && Array.isArray(order.items) && order.items.length > 0) {
      return order.items.map((item, index) => ({
        id: item.id || `prod-${index + 1}`,
        name: item.name || 'Product',
        image: item.image || FALLBACK_IMAGE,
        variant: item.variant || '',
        quantity: Number(item.quantity || 1),
      }));
    }
    // Fallback if order has no items
    return order?.products || [];
  }, [order]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // React Hook Form setup with Zod validation
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(ratingSchema),
    defaultValues: {
      deliveryRating: 0,
      productRatings: {},
      productOptions: {},
      productComments: {},
      otherFeedback: '',
    }
  });

  // Watch form values
  const deliveryRating = watch('deliveryRating');
  const productRatings = watch('productRatings');
  const productOptions = watch('productOptions');
  const productComments = watch('productComments');

  const handleProductRatingChange = (productId, rating) => {
    const currentRatings = productRatings || {};
    setValue('productRatings', {
      ...currentRatings,
      [productId]: rating
    }, { shouldValidate: true });
    
    // Clear feedback when rating is reset
    if (rating === 0) {
      const currentOptions = productOptions || {};
      const currentComments = productComments || {};
      const newOptions = { ...currentOptions };
      const newComments = { ...currentComments };
      delete newOptions[productId];
      delete newComments[productId];
      setValue('productOptions', newOptions);
      setValue('productComments', newComments);
    }
  };

  const handleOptionToggle = (productId, questionId, option) => {
    const currentOptions = productOptions || {};
    const productOpts = currentOptions[productId] || {};
    const questionOpts = productOpts[questionId] || [];
    
    const isSelected = questionOpts.includes(option);
    const newQuestionOpts = isSelected
      ? questionOpts.filter(o => o !== option)
      : [...questionOpts, option];
    
    setValue('productOptions', {
      ...currentOptions,
      [productId]: {
        ...productOpts,
        [questionId]: newQuestionOpts
      }
    });
  };

  const handleCommentChange = (productId, comment) => {
    const currentComments = productComments || {};
    setValue('productComments', {
      ...currentComments,
      [productId]: comment
    });
  };

  const onFormSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      const reviewData = {
        orderId: order?.id || order?.orderId || null,
        deliveryRating: data.deliveryRating,
        otherFeedback: data.otherFeedback,
        productReviews: products
          .filter(p => data.productRatings[p.id] > 0)
          .map(p => ({
            productId: p.id,
            productName: p.name,
            rating: data.productRatings[p.id],
            feedback: data.productOptions?.[p.id] || {},
            comment: data.productComments?.[p.id] || ''
          }))
      };
      
      if (onSubmit) {
        await onSubmit(reviewData);
      }
      
      // Reset form and show success modal
      resetForm();
      onClose();
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    reset({
      deliveryRating: 0,
      productRatings: {},
      productOptions: {},
      productComments: {},
      otherFeedback: '',
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Get combined error message
  const getErrorMessage = () => {
    if (errors.deliveryRating) return errors.deliveryRating.message;
    if (errors.productRatings) return errors.productRatings.message;
    return null;
  };

  const errorMessage = getErrorMessage();

  return (
    <>
    {/* Success Modal */}
    <SuccessModal
      modal={showSuccessModal}
      setModal={setShowSuccessModal}
      title="Thank You!"
      message="We appreciate your feedback—it helps us improve."
    />

    {/* Rating Modal */}
    <ResponsiveModal
      modal={isOpen}
      setModal={onClose}
      extraFunction={handleClose}
      classes={{
        modalClass: 'theme-modal rate-order-modal modal-md',
        offcanvasClass: 'rate-order-offcanvas',
        modalHeaderClass: 'rate-order-header justify-content-between',
        modalBodyClass: 'rate-order-body',
        title: 'How was your order?',
      }}
    >
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="rate-order-content"
      >
        {/* Delivery Rating Section */}
        <div className="delivery-rating-section">
          <div
            className={`delivery-rating-card ${errors.deliveryRating ? 'has-error' : ''}`}
          >
            <div className="delivery-icon">
              <Image
                src="https://react.pixelstrap.net/fastkart/assets/product.png"
                alt="Delivery"
                width={48}
                height={48}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
                unoptimized
              />
              <span className="delivery-icon-fallback">📦</span>
            </div>
            <div className="delivery-info">
              <h6>Rate delivery experience</h6>
              <Controller
                name="deliveryRating"
                control={control}
                render={({ field }) => (
                  <StarRating
                    rating={field.value}
                    onRate={(star) =>
                      field.onChange(star === field.value ? 0 : star)
                    }
                    size={24}
                  />
                )}
              />
            </div>
          </div>
          {errors.deliveryRating && (
            <p className="field-error">{errors.deliveryRating.message}</p>
          )}
        </div>

        {/* Products Rating Section */}
        <div className="products-rating-section">
          <h6 className="section-title">Tell us more about the products</h6>
          <div className="products-list">
            {products.map((product) => (
              <ProductRatingItem
                key={product.id}
                product={product}
                rating={productRatings?.[product.id] || 0}
                onRatingChange={(rating) =>
                  handleProductRatingChange(product.id, rating)
                }
                selectedOptions={productOptions?.[product.id] || {}}
                onOptionToggle={(questionId, option) =>
                  handleOptionToggle(product.id, questionId, option)
                }
                comment={productComments?.[product.id] || ''}
                onCommentChange={(comment) =>
                  handleCommentChange(product.id, comment)
                }
              />
            ))}
          </div>
          {errors.productRatings && (
            <p className="field-error">{errors.productRatings.message}</p>
          )}
        </div>

        {/* Any other feedback section */}
        <div className="other-feedback-section">
          <p className="feedback-label">Any other feedback?</p>
          <Controller
            name="otherFeedback"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                className="other-feedback-textarea input-common"
                placeholder="Share any additional feedback about your order..."
                rows={3}
              />
            )}
          />
        </div>

        {/* Error Message */}
        {errorMessage && <div className="message-error">{errorMessage}</div>}

        {/* Submit Button */}
        <div className="submit-section">
          <button type="submit" className="btn-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </ResponsiveModal>
    </>
  );
};

export default RateOrderModal;
