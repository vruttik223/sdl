'use client';
import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import UserContext from '.';
import { getUserProfile } from '@/api/auth.api';
import { useRouter } from 'next/navigation';

const UserProvider = (props) => {
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  // Check if token exists in sessionStorage on mount and when window is available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('userToken');
      // console.log('UserProvider - Token check:', token ? 'Token exists' : 'No token');
      setHasToken(!!token);
    }
  }, []);

  const { data, refetch, isLoading, error } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      // console.log('UserProvider - Calling getUserProfile...');
      const result = await getUserProfile();
      // console.log('UserProvider - getUserProfile result:', result);
      return result;
    },
    enabled: hasToken,
    retry: false,
  });

  useEffect(() => {
    // console.log('UserProvider - Effect triggered');
    // console.log('UserProvider - data:', data);
    // console.log('UserProvider - hasToken:', hasToken);
    // console.log('UserProvider - isLoading:', isLoading);
    // console.log('UserProvider - error:', error);
    
    if (data) {
      // console.log('UserProvider - Processing data...');
      // The API returns { success, data: { authCustomer: {...} } }
      const user = data?.data?.authCustomer || data?.authCustomer || data;
      // console.log('UserProvider - Extracted user:', user);
      setUserData(user);
      setIsAuthenticated(true);
    } else if (!hasToken) {
      // console.log('UserProvider - No token, clearing userData');
      setUserData(null);
      setIsAuthenticated(false);
    } else if (error) {
      console.error('UserProvider - Error fetching user:', error);
      setUserData(null);
      setIsAuthenticated(false);
    }
  }, [data, hasToken, error, isLoading]);

  const logout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('userToken');
      Cookies.remove('theme');
    }
    queryClient.removeQueries(['user']);
    setUserData(null);
    setIsAuthenticated(false);
    router.refresh();
  };

  return (
    <UserContext.Provider
      value={{
        ...props,
        userData,
        setUserData,
        isUserLoading: isLoading,
        isAuthenticated,
        refetchUser: refetch,
        logout,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserProvider;
