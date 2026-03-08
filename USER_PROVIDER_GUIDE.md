# User Provider - Authentication & Session Management

This documentation describes the UserProvider system that manages user authentication, session storage, and route protection in the application.

## Overview

The UserProvider follows the same pattern as AccountProvider and integrates seamlessly with React Query for data fetching and state management.

## Features

✅ **Automatic Session Management** - Stores JWT token in sessionStorage  
✅ **Automatic User Data Fetching** - Fetches user profile after login  
✅ **Route Protection** - Utilities to protect pages and components  
✅ **Logout Cleanup** - Automatic cleanup of session and user data  
✅ **React Query Integration** - Leverages React Query for caching and refetching  

---

## Architecture

### 1. **UserContext & UserProvider**
Location: `src/helper/userContext/`

**Files:**
- `index.jsx` - Creates the React Context
- `UserProvider.jsx` - Provider component that wraps the app

**What it does:**
- Manages user authentication state
- Fetches user profile from `/api/getauthcustomer`
- Provides user data to all child components
- Handles session token detection
- Provides logout functionality

### 2. **useUser Hook**
Location: `src/utils/hooks/useUser.js`

**Usage:**
```javascript
const { userData, isUserLoading, isAuthenticated, refetchUser, logout } = useUser();
```

**Returns:**
- `userData` - Current user object (or null)
- `setUserData` - Function to manually update user data
- `isUserLoading` - Boolean indicating if user data is loading
- `isAuthenticated` - Boolean indicating if user is logged in
- `refetchUser` - Function to manually refetch user data
- `logout` - Function to logout and clear session

### 3. **Updated Auth Hooks**
Location: `src/utils/hooks/useAuth.js`

All authentication hooks now automatically:
1. Store the JWT token in `sessionStorage` with key `userToken`
2. Refetch user profile data after successful authentication
3. Clear session on logout

**Available Hooks:**
- `useLogin()` - Login with phone number
- `useResendOtp()` - Resend OTP
- `useVerifyOtp()` - Verify OTP
- `useLogout()` - Logout user
- `useCreateProfile()` - Create user profile
- `useDoctorSpecializations()` - Fetch doctor specializations

---

## Usage Examples

### 1. Login Flow

```javascript
'use client';
import { useState } from 'react';
import { useLogin, useVerifyOtp } from '@/utils/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const router = useRouter();

  const loginMutation = useLogin({
    onSuccess: (data) => {
      console.log('OTP sent successfully');
      setShowOtp(true);
    },
    onError: (error) => {
      console.error('Login failed:', error);
    }
  });

  const verifyMutation = useVerifyOtp({
    onSuccess: (data) => {
      if (data.success) {
        // Token is automatically stored in sessionStorage
        // User data is automatically fetched
        
        if (data.data?.needsProfile) {
          router.push('/create-profile');
        } else {
          router.push('/account');
        }
      }
    }
  });

  const handleLogin = () => {
    loginMutation.mutate({ phone });
  };

  const handleVerifyOtp = () => {
    verifyMutation.mutate({ phone, otp });
  };

  return (
    <div>
      {!showOtp ? (
        <>
          <input 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            placeholder="Phone Number"
          />
          <button onClick={handleLogin}>Send OTP</button>
        </>
      ) : (
        <>
          <input 
            value={otp} 
            onChange={(e) => setOtp(e.target.value)} 
            placeholder="Enter OTP"
          />
          <button onClick={handleVerifyOtp}>Verify OTP</button>
        </>
      )}
    </div>
  );
}
```

### 2. Protected Route (Method 1: Direct Check)

```javascript
'use client';
import { redirect } from 'next/navigation';
import { useUser } from '@/utils/hooks/useUser';

export default function AccountPage() {
  const { userData, isUserLoading } = useUser();

  if (isUserLoading) return null;
  if (!userData) redirect('/login');

  return (
    <div>
      <h1>Welcome, {userData.firstName}!</h1>
      <p>Email: {userData.email}</p>
    </div>
  );
}
```

### 3. Protected Route (Method 2: Using HOC)

```javascript
'use client';
import { withAuth } from '@/utils/hoc/withAuth';

function DashboardPage() {
  return (
    <div>
      <h1>Protected Dashboard</h1>
      {/* Your content here */}
    </div>
  );
}

export default withAuth(DashboardPage);
```

### 4. Protected Route (Method 3: Using Component)

```javascript
'use client';
import { ProtectedRoute } from '@/utils/hoc/withAuth';
import { useUser } from '@/utils/hooks/useUser';

export default function ProfilePage() {
  const { userData } = useUser();
  
  return (
    <>
      <ProtectedRoute />
      <div>
        <h1>Profile: {userData?.firstName}</h1>
        {/* Your content here */}
      </div>
    </>
  );
}
```

### 5. Display User Info in Components

```javascript
'use client';
import { useUser } from '@/utils/hooks/useUser';

export default function UserGreeting() {
  const { userData, isUserLoading, isAuthenticated } = useUser();

  if (isUserLoading) return <div>Loading...</div>;
  
  if (!isAuthenticated) {
    return <a href="/login">Please login</a>;
  }

  return (
    <div>
      <p>Hello, {userData.firstName} {userData.lastName}!</p>
      <p>Phone: {userData.phone}</p>
      {userData.isDoctor && (
        <p>Doctor - Status: {userData.kycStatus}</p>
      )}
    </div>
  );
}
```

### 6. Logout Implementation

```javascript
'use client';
import { useLogout } from '@/utils/hooks/useAuth';
import { useUser } from '@/utils/hooks/useUser';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();
  const { userData } = useUser();
  
  const logoutMutation = useLogout({
    onSuccess: () => {
      // Session and user data are automatically cleared
      router.push('/login');
    }
  });

  const handleLogout = () => {
    logoutMutation.mutate({ phone: userData.phone });
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
}
```

### 7. Create Profile After Registration

```javascript
'use client';
import { useCreateProfile } from '@/utils/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function CreateProfilePage() {
  const router = useRouter();
  
  const createProfileMutation = useCreateProfile({
    onSuccess: (data) => {
      // Token is automatically stored
      // User data is automatically fetched
      router.push('/account');
    }
  });

  const handleSubmit = (formData) => {
    createProfileMutation.mutate({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      profileImageFile: formData.profileImage, // File object
      // ... other fields
    });
  };

  return (
    <div>{/* Your form here */}</div>
  );
}
```

---

## API Response Structure

### User Object
```typescript
{
  uid: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string;
  profileImage: string;
  role: string;
  isDoctor: boolean;
  kycStatus: string | null;
  doctorDetails: Object | null;
}
```

### Login Response
```typescript
{
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    needsProfile: boolean;
    isNewUser: boolean;
  }
}
```

---

## Session Storage

**Key:** `userToken`  
**Value:** JWT token string  
**Storage:** `sessionStorage` (cleared when browser tab closes)

The token is automatically:
- ✅ Set after successful login
- ✅ Set after OTP verification
- ✅ Set after profile creation
- ✅ Removed on logout
- ✅ Used in API calls to `/api/getauthcustomer`

---

## Integration with Layout

The UserProvider is already integrated in the main layout at:  
`src/layout/index.jsx`

```javascript
<UserProvider>
  <AccountProvider>
    {/* Other providers */}
  </AccountProvider>
</UserProvider>
```

---

## Best Practices

1. **Always check loading state** before redirecting:
   ```javascript
   if (isUserLoading) return null;
   if (!userData) redirect('/login');
   ```

2. **Use optional chaining** when accessing user data:
   ```javascript
   userData?.firstName
   ```

3. **Handle errors** in mutations:
   ```javascript
   useLogin({
     onError: (error) => {
       console.error('Login failed:', error);
     }
   });
   ```

4. **Redirect after state changes** to prevent flashing:
   ```javascript
   useEffect(() => {
     if (!isUserLoading && !userData) {
       router.push('/login');
     }
   }, [isUserLoading, userData]);
   ```

5. **Use the logout function from useUser** for immediate cleanup:
   ```javascript
   const { logout } = useUser();
   logout(); // Clears session immediately
   ```

---

## Troubleshooting

### Issue: User data not fetching after login
**Solution:** Make sure the token is being stored. Check browser DevTools > Application > Session Storage for `userToken`.

### Issue: Infinite redirect loop
**Solution:** Always check `isUserLoading` before redirecting.

### Issue: User data is null after refresh
**Solution:** Ensure the token exists in sessionStorage. UserProvider automatically checks for the token on mount.

### Issue: 401 Unauthorized on /getauthcustomer
**Solution:** Check that the token is valid and not expired. The API expects `Authorization: Bearer <token>` header.

---

## Files Created

1. ✅ `src/helper/userContext/index.jsx` - Context definition
2. ✅ `src/helper/userContext/UserProvider.jsx` - Provider component
3. ✅ `src/utils/hooks/useUser.js` - Custom hook
4. ✅ `src/utils/hooks/useAuth.js` - Updated with session management
5. ✅ `src/utils/hoc/withAuth.js` - Route protection utilities
6. ✅ `src/utils/examples/userProviderExamples.js` - Usage examples
7. ✅ `src/layout/index.jsx` - Updated with UserProvider

---

## Next Steps

1. Test the login flow
2. Implement protected routes
3. Add loading states and error handling
4. Customize the redirect logic as needed
5. Add refresh token logic if required

---

For more examples, see: `src/utils/examples/userProviderExamples.js`
