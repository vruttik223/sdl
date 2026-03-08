'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@/utils/hooks/useUser';
import OtpLoginModal from '../auth/login/OtpLoginModal';
import Loader from '@/layout/loader';

/**
 * ProtectedRoute - Wrapper component for routes that require authentication
 * @param {Object} props
 * @param {React.ReactNode} props.children - The protected content to render
 * @param {string} props.redirectTo - Optional custom redirect path after login
 */
const ProtectedRoute = ({ children, redirectTo }) => {
  const { isAuthenticated, isUserLoading } = useUser();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Wait for user data to load
    if (!isUserLoading) {
      setHasCheckedAuth(true);
      
      // If not authenticated, show login modal
      if (!isAuthenticated) {
        setShowLoginModal(true);
      }
    }
  }, [isAuthenticated, isUserLoading]);

  // Handle successful login
  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    // Optionally refresh the page or refetch data
    router.refresh();
  };

  // Handle modal close without login
  const handleModalClose = () => {
    setShowLoginModal(false);
    // Redirect to home if user closes modal without logging in
    router.push('/');
  };

  // Show loader while checking authentication
  if (!hasCheckedAuth || isUserLoading) {
    return <Loader />;
  }

  // Show login modal if not authenticated
  if (!isAuthenticated) {
    return (
      <OtpLoginModal
        isOpen={showLoginModal}
        onClose={handleModalClose}
        setOpen={setShowLoginModal}
        redirectUrl={redirectTo || pathname}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  // Render protected content if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
