'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useUser } from '@/utils/hooks/useUser';

const ThemeContext = createContext({
  theme: 'customer',
  setTheme: () => {},
  isDoctor: false,
});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const { userData, isAuthenticated } = useUser();
  const [theme, setThemeState] = useState('customer');
  const [mounted, setMounted] = useState(false);

  // Initialize theme from cookie or user data
  useEffect(() => {
    setMounted(true);
    
    // Priority 1: Check cookie
    const savedTheme = Cookies.get('theme');
    if (savedTheme === 'customer' || savedTheme === 'doctor') {
      setThemeState(savedTheme);
      return;
    }
    
    // Priority 2: Check authenticated user role
    if (isAuthenticated && userData) {
      const userTheme = userData.isDoctor || userData.role === 'Doctor' || userData.role === 'doctor' 
        ? 'doctor' 
        : 'customer';
      setThemeState(userTheme);
      Cookies.set('theme', userTheme, { expires: 365 }); // 1 year
    }
  }, [isAuthenticated, userData]);

  // Update theme when user role changes
  useEffect(() => {
    if (!mounted) return;
    
    if (isAuthenticated && userData) {
      const userTheme = userData.isDoctor || userData.role === 'Doctor' || userData.role === 'doctor'
        ? 'doctor' 
        : 'customer';
      
      if (userTheme !== theme) {
        setThemeState(userTheme);
        Cookies.set('theme', userTheme, { expires: 365 });
      }
    }
  }, [userData, isAuthenticated, theme, mounted]);

  // Apply theme class to document
  useEffect(() => {
    if (!mounted) return;
    
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('theme-customer', 'theme-doctor');
    
    // Add current theme class
    root.classList.add(`theme-${theme}`);
    // root.classList.add(`theme-${'customer'}`);
    
    // Set data attribute for CSS targeting
    root.setAttribute('data-theme', theme);
    // root.setAttribute('data-theme', 'customer');
  }, [theme, mounted]);

  const setTheme = (newTheme) => {
    if (newTheme === 'customer' || newTheme === 'doctor') {
      setThemeState(newTheme);
      Cookies.set('theme', newTheme, { expires: 365 });
      
      // Dispatch custom event for other components to react if needed
      window.dispatchEvent(new CustomEvent('themeChange', { detail: { theme: newTheme } }));
    }
  };

  const value = {
    theme,
    setTheme,
    isDoctor: theme === 'doctor',
  };

  // Prevent flash of wrong theme
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
