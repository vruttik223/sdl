'use client';
import { useEffect } from 'react';
import CollectionContain from '@/components/collection';
import { initAppBridge } from '@/utils/app-bridge';
import { isAppMode } from '@/utils/webview-detector';

/**
 * App-Specific Collections Page
 * 
 * This page is designed to be loaded in React Native WebView.
 * It automatically detects app mode and initializes the communication bridge.
 * 
 * URL: /app/collections?app=true
 */
const AppCollectionsPage = () => {
  useEffect(() => {
    // Initialize app bridge when component mounts
    const bridge = initAppBridge({
      onAuthInit: (payload) => {
        console.log('Auth initialized from app:', payload);
        // You can update your auth context here
        // Example: updateAuthContext(payload.token, payload.user);
      },
      onUserUpdate: (user) => {
        console.log('User updated from app:', user);
        // Update user context
      },
      onCartSync: (cartItems) => {
        console.log('Cart synced from app:', cartItems);
        // Sync cart from app
      },
    });
    
    if (bridge) {
      console.log('App bridge initialized successfully');
    } else {
      console.log('Not running in app mode');
    }
  }, []);
  
  return <CollectionContain />;
};

export default AppCollectionsPage;
