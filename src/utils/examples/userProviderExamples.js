// Example: Protected Page Component
// Location: src/app/(mainLayout)/account/page.js

'use client';
import { redirect } from 'next/navigation';
import { useUser } from '@/utils/hooks/useUser';

export default function AccountPage() {
  const { userData, isUserLoading } = useUser();

  // Show nothing while loading
  if (isUserLoading) return null;
  
  // Redirect to login if not authenticated
  if (!userData) redirect('/login');

  return (
    <div>
      <h1>Welcome, {userData.firstName}!</h1>
      {/* Your protected content here */}
    </div>
  );
}

// ===================================
// Example: Using withAuth HOC
// ===================================

import { withAuth } from '@/utils/hoc/withAuth';

function AccountPage() {
  return (
    <div>
      <h1>Protected Account Page</h1>
      {/* Your protected content here */}
    </div>
  );
}

export default withAuth(AccountPage);

// ===================================
// Example: Using ProtectedRoute Component
// ===================================

import { ProtectedRoute } from '@/utils/hoc/withAuth';

export default function ProfilePage() {
  return (
    <>
      <ProtectedRoute />
      <div>
        <h1>Protected Profile Page</h1>
        {/* Your protected content here */}
      </div>
    </>
  );
}

// ===================================
// Example: Using useUser hook in components
// ===================================

import { useUser } from '@/utils/hooks/useUser';

export default function UserGreeting() {
  const { userData, isUserLoading, isAuthenticated } = useUser();

  if (isUserLoading) return <div>Loading...</div>;
  
  if (!isAuthenticated) return <div>Please login</div>;

  return (
    <div>
      <p>Hello, {userData.firstName} {userData.lastName}!</p>
      <p>Email: {userData.email}</p>
      <p>Phone: {userData.phone}</p>
      <p>Role: {userData.role}</p>
      {userData.isDoctor && <p>Doctor - {userData.kycStatus}</p>}
    </div>
  );
}

// ===================================
// Example: Login Component
// ===================================

import { useLogin, useVerifyOtp } from '@/utils/hooks/useAuth';
import { useUser } from '@/utils/hooks/useUser';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  const { refetchUser } = useUser();
  
  const loginMutation = useLogin({
    onSuccess: (data) => {
      console.log('Login successful:', data);
      // Token is automatically stored in sessionStorage
      // User data is automatically refetched
      
      if (data.data.needsProfile) {
        router.push('/create-profile');
      } else {
        router.push('/account');
      }
    },
    onError: (error) => {
      console.error('Login failed:', error);
    }
  });

  const verifyOtpMutation = useVerifyOtp({
    onSuccess: (data) => {
      if (data.success) {
        console.log('OTP verified');
        // Token is automatically stored
        // User data is automatically refetched
        router.push('/account');
      }
    }
  });

  // Your login form implementation...
}

// ===================================
// Example: Logout Component
// ===================================

import { useLogout } from '@/utils/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();
  const logoutMutation = useLogout({
    onSuccess: () => {
      // Session is automatically cleared
      // User data is automatically reset
      router.push('/login');
    }
  });

  const handleLogout = () => {
    logoutMutation.mutate({ phone: '1234567890' });
  };

  return <button onClick={handleLogout}>Logout</button>;
}
