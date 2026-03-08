'use client';
import { useState } from 'react';
import { Col } from 'reactstrap';
import Link from 'next/link';
import { RiHeartLine } from 'react-icons/ri';
import Breadcrumb from '../common/Breadcrumb';
import WrapperComponent from '../common/WrapperComponent';
import ProductBox1 from '../common/productBox/productBox1/ProductBox1';
import ConfirmationModal from '../common/ConfirmationModal';
import OtpLoginModal from '../auth/login/OtpLoginModal';
import { useWishlist, useRemoveFromWishlist } from '@/utils/hooks/useWishlist';
import { useUser } from '@/utils/hooks/useUser';

const WishlistContent = () => {
  const { data, isLoading, isError } = useWishlist({ page: 1, limit: 20 });
  const removeFromWishlistMutation = useRemoveFromWishlist();
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [productToRemove, setProductToRemove] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const { userData, isUserLoading, isAuthenticated } = useUser();

  const handleRemoveClick = (product) => {
    setProductToRemove(product);
    setConfirmationModal(true);
  };

  const confirmRemove = () => {
    if (!productToRemove) return;
    removeFromWishlistMutation.mutate(
      { productUid: productToRemove.uid },
      {
        onSuccess: () => {
          setConfirmationModal(false);
          setProductToRemove(null);
        },
      }
    );
  };

  // Normalize product data from API to match ProductBox1 expectations
  const normalizeProduct = (wishlistItem) => {
    const product = wishlistItem.product;

    // Get the first variant for pricing
    const firstVariant = product.productVariants?.[0];

    // Calculate average rating from reviews
    const reviews = product.productReviews || [];
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.ratings, 0) /
          reviews.length
        : 4.7;

    return {
      id: product.uid,
      uid: product.uid,
      name: product.name,
      slug: product.slug,
      product_thumbnail: product.coverImage,
      short_description: product.category?.description || '',
      sale_price: firstVariant?.disPrice || 0,
      price: firstVariant?.mrp || 0,
      discount:
        firstVariant?.mrp && firstVariant?.disPrice
          ? Math.round(
              ((firstVariant.mrp - firstVariant.disPrice) / firstVariant.mrp) *
                100
            )
          : 0,
      stock_status: firstVariant?.inStockFlag ? 'in_stock' : 'out_of_stock',
      unit: 'mg',
      weight: firstVariant?.name?.match(/\d+/)?.[0] || '',
      rating_count: reviews.length,
      rating: avgRating,
      variations: product.productVariants?.map((variant) => ({
        id: variant.uid,
        name: variant.name,
        price: variant.mrp,
        sale_price: variant.disPrice,
        stock_status: variant.inStockFlag ? 'in_stock' : 'out_of_stock',
      })),
      type: 'simple',
    };
  };

  const wishlistProducts =
    data?.success && data?.data?.wishlist
      ? data.data.wishlist.map(normalizeProduct)
      : [];

  let content;

  if (isAuthenticated && isLoading) {
    content = (
      <WrapperComponent>
        <div className="empty-cart-box my-5">
          <h5>Loading your wishlist...</h5>
        </div>
      </WrapperComponent>
    );
  } else if (!isAuthenticated) {
    content = (
      <WrapperComponent>
        <div className="empty-cart-box my-5">
          <div className="empty-icon">
            <RiHeartLine />
          </div>
          <h5>Please login to view your wishlist.</h5>
          <button
            onClick={() => setLoginModalOpen(true)}
            className="btn btn-md theme-bg-color text-white mt-3 d-inline-block"
          >
            Login
          </button>
        </div>
      </WrapperComponent>
    );
  } else if (!wishlistProducts?.length) {
    content = (
      <WrapperComponent>
        <div className="empty-cart-box my-5">
          <h5>Your wishlist is currently empty.</h5>
          <Link
            href="/collections"
            className="btn btn-md btn-primary mt-3 d-inline-block"
          >
            {' '}
            Go to Shop{' '}
          </Link>
        </div>
      </WrapperComponent>
    );
  } else {
    content = (
      <WrapperComponent
        classes={{ row: 'row', col: 'col-6 col-md-4 col-lg-3' }}
      >
        {wishlistProducts.map((product) => (
          // <Col key={product.id}>
          <ProductBox1
            key={product.id}
            imgUrl={product.product_thumbnail}
            productDetail={product}
            isClose
            onRemoveClick={handleRemoveClick}
          />
          // </Col>
        ))}
      </WrapperComponent>
    );
  }

  return (
    <>
      {content}

      {/* ALWAYS RENDER MODALS */}
      <ConfirmationModal
        modal={confirmationModal}
        setModal={setConfirmationModal}
        confirmFunction={confirmRemove}
        isLoading={removeFromWishlistMutation.isPending}
      />

      <OtpLoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        setOpen={setLoginModalOpen}
      />
    </>
  );
};

export default WishlistContent;
