/**
 * WebView Detection Utility
 * 
 * Detects if the current page is being loaded in a React Native WebView
 */

/**
 * Check if page is loaded in React Native WebView
 * @returns {boolean} - True if in WebView, false otherwise
 */
export const isInWebView = () => {
  if (typeof window === 'undefined') return false;
  
  // Check for React Native WebView object
  if (window.ReactNativeWebView) {
    return true;
  }
  
  // Check user agent
  const userAgent = navigator.userAgent || '';
  if (userAgent.includes('ReactNative') || userAgent.includes('Mobile')) {
    // Additional check: if it's mobile but has specific React Native markers
    return userAgent.includes('ReactNative');
  }
  
  // Check URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('app') === 'true') {
    return true;
  }
  
  // Check if window.isReactNativeApp is set (from injected script)
  if (window.isReactNativeApp === true) {
    return true;
  }
  
  return false;
};

/**
 * Get app mode from URL or detection
 * @returns {boolean} - True if app mode is enabled
 */
export const isAppMode = () => {
  return isInWebView();
};

/**
 * Get authentication token from URL (fallback method)
 * Note: This is less secure than postMessage, use only as fallback
 * @returns {string|null} - Token if found, null otherwise
 */
export const getTokenFromUrl = () => {
  if (typeof window === 'undefined') return null;
  
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('token') || null;
};
