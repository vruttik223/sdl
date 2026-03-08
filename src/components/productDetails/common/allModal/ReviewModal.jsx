import { useEffect } from 'react';
import Image from 'next/image';
import ResponsiveModal from '@/components/common/ResponsiveModal';
import { RiStarFill, RiStarLine, RiCloseLine } from 'react-icons/ri';
import { placeHolderImage } from '../../../../data/CommonPath';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productReviewSchema } from '@/utils/validation/ZodValidationSchema';

// Rating text based on star value
const getRatingText = (rating) => {
  switch (rating) {
    case 1: return 'Poor';
    case 2: return 'Fair';
    case 3: return 'Good';
    case 4: return 'Very good';
    case 5: return 'Excellent';
    default: return '';
  }
};

// Star Rating Component
const StarRating = ({ rating, onReview, size = 24 }) => {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="star-btn"
          onClick={() => onReview(star)}
          aria-label={`Review ${star} stars`}
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

const ReviewModal = ({ modal, setModal, productState, refetch }) => {
  const defaultValues = {
    rating: productState?.product?.user_review?.rating || 0,
    description: productState?.product?.user_review?.description || '',
    product_id: productState?.product?.id || '',
    review_image_id: '',
  };

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productReviewSchema),
    defaultValues,
  });

  const currentRating = watch('rating');

  useEffect(() => {
    reset(defaultValues);
  }, [modal, productState, reset]);

  const handleRatingChange = (value) => {
    // Toggle off if clicking same star
    const newValue = value === currentRating ? 0 : value;
    setValue('rating', newValue, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleClose = () => {
    reset(defaultValues);
    setModal(false);
  };

  const onSubmit = async (values) => {
    // Add your submission logic here
    console.log('Review submitted:', values);
    setModal(false);
    if (refetch) refetch();
  };

  return (
    <ResponsiveModal
      modal={!!modal}
      setModal={setModal}
      closeButton={<RiCloseLine className="btn-close position-static" />}
      extraFunction={handleClose}
      classes={{
        modalClass: 'theme-modal review-modal modal-md',
        offcanvasClass: 'review-offcanvas',
        modalHeaderClass: 'review-header justify-content-between',
        modalBodyClass: 'review-body',
        title: 'Write a Review',
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="review-content">
        <input type="hidden" {...register('product_id')} />
        <input type="hidden" {...register('review_image_id')} />

        {/* Product Info Card */}
        <div className="review-product-card">
          <div className="review-product-image">
            {placeHolderImage && (
              <Image
                src={placeHolderImage}
                alt={productState?.product?.name || 'Product'}
                width={60}
                height={60}
                unoptimized
              />
            )}
          </div>
          <div className="review-product-info">
            <h6 className="product-name">{productState?.product?.name}</h6>
            <span className="product-type">Physical Product</span>
          </div>
          {/* <div className="review-product-price">
            ${productState?.product?.sale_price || productState?.product?.price || '0'}
          </div> */}
        </div>

        {/* Rating Section */}
        <div className={`review-rating-section ${errors.rating ? 'has-error' : ''}`}>
          <label className="rating-label">
            Rating <span className="required">*</span>
          </label>
          <div className="rating-row">
            <Controller
              name="rating"
              control={control}
              render={({ field }) => (
                <StarRating
                  rating={field.value}
                  onReview={handleRatingChange}
                  size={28}
                />
              )}
            />
            {/* {currentRating > 0 && (
              <span className="rating-text">{getRatingText(currentRating)}</span>
            )} */}
          </div>
          {errors.rating && <p className="field-error">{errors.rating.message}</p>}
        </div>

        {/* Review Textarea */}
        <div className="review-feedback-section">
          <label className="feedback-label">Your review</label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                className="review-feedback-textarea"
                placeholder="Enter your review..."
                rows={4}
              />
            )}
          />
        </div>

        {/* Submit Button */}
        <div className="submit-section">
          <button type="submit" className="btn-submit btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </ResponsiveModal>
  );
};

export default ReviewModal;
