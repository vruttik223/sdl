import {
  login,
  resendOtp,
  verifyOtp,
  logout,
  createProfile,
  doctorSpecializations,
  updateProfile,
  checkProfilePhone,
  verifyProfilePhone,
} from '@/api/auth.api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useUser } from './useUser';
import Cookies from 'js-cookie';

// Helper function to set theme cookie based on user role
const setThemeCookie = (userData) => {
  if (!userData) return;
  
  const isDoctor = userData.isDoctor || userData.role === 'Doctor' || userData.role === 'doctor';
  const theme = isDoctor ? 'doctor' : 'customer';
  
  // Set theme cookie with 1 year expiry
  Cookies.set('theme', theme, { expires: 365 });
};

export const useLogin = (options = {}) => {
  const { refetchUser } = useUser();
  
  return useMutation({
    mutationKey: 'login',
    mutationFn: ({ phone }) => login({ phone }),
    onSuccess: (data) => {
      console.log(data);
      // Store token in sessionStorage
      if (data?.data?.token && typeof window !== 'undefined') {
        sessionStorage.setItem('userToken', data.data.token);
      }
      // Set theme cookie based on user role
      if (data?.data?.user) {
        setThemeCookie(data.data.user);
      }
      // Refetch user data
      refetchUser();
      // Call user's onSuccess if provided
      options.onSuccess?.(data);
    },
    ...options,
  });
};

export const useResendOtp = (options = {}) => {
  return useMutation({
    mutationKey: 'resend-otp',
    mutationFn: ({ phone }) => resendOtp({ phone }),
    ...options,
  });
};

export const useVerifyOtp = (options = {}) => {
  const { refetchUser } = useUser();
  
  return useMutation({
    mutationKey: 'verify-otp',
    mutationFn: ({ phone, otp }) => verifyOtp({ phone, otp }),
    onSuccess: (data) => {
      // Store token in sessionStorage if present in response
      if (data?.data?.token && typeof window !== 'undefined') {
        sessionStorage.setItem('userToken', data.data.token);
      }
      // Set theme cookie based on user role
      if (data?.data?.user) {
        setThemeCookie(data.data.user);
      }
      // Refetch user data
      if (data?.success) {
        refetchUser();
      }
      // Call user's onSuccess if provided
      options.onSuccess?.(data);
    },
    ...options,
  });
};

export const useLogout = (options = {}) => {
  const { logout: logoutUser } = useUser();
  
  return useMutation({
    mutationKey: 'logout',
    mutationFn: ({ phone }) => logout({ phone }),
    onSuccess: (data) => {
      // Clear session and user data
      logoutUser();
      // Call user's onSuccess if provided
      options.onSuccess?.(data);
    },
    ...options,
  });
};

export const useCreateProfile = (options = {}) => {
  const { refetchUser } = useUser();
  
  return useMutation({
    mutationKey: 'create-profile',
    mutationFn: (profileData) => {
      console.log("Creating profile with data: ", profileData);
      return createProfile(profileData);
    },
    onSuccess: (data) => {
      // Store token in sessionStorage if present in response
      if (data?.data?.token && typeof window !== 'undefined') {
        sessionStorage.setItem('userToken', data.data.token);
      }
      // Set theme cookie based on user role
      if (data?.data?.user) {
        setThemeCookie(data.data.user);
      }
      // Refetch user data
      refetchUser();
      // Call user's onSuccess if provided
      options.onSuccess?.(data);
    },
    ...options,
  });
};

export const useDoctorSpecializations = (options = {}) => {
  return useQuery({
    queryKey: ['doctor-specializations'],
    queryFn: async () => {
      return doctorSpecializations();
    },
    ...options,
  });
};

export const useCheckProfilePhone = (options = {}) => {
  return useMutation({
    mutationKey: 'profile-check-phone',
    mutationFn: ({ phone }) => checkProfilePhone({ phone }),
    ...options,
  });
};

export const useVerifyProfilePhone = (options = {}) => {
  return useMutation({
    mutationKey: 'profile-verify-phone',
    mutationFn: ({ phone, otp }) => verifyProfilePhone({ phone, otp }),
    ...options,
  });
};

export const useUpdateProfile = (options = {}) => {
  const { refetchUser } = useUser();
  
  return useMutation({
    mutationKey: 'update-profile',
    mutationFn: (profileData) => updateProfile(profileData),
    onSuccess: (data) => {
      // Refetch user data to get updated profile
      refetchUser();
      // Call user's onSuccess if provided
      options.onSuccess?.(data);
    },
    ...options,
  });
};
