/**
 * App Bridge Utility
 * 
 * Handles bidirectional communication between Next.js website and React Native app
 * This file should be imported and initialized in pages that need to communicate with the app
 */

let bridgeInstance = null;
let messageHandlers = {};
let isInitialized = false;
let cleanupFns = [];

/**
 * Initialize the app bridge
 * @param {object} handlers - Object containing message handler functions
 * @returns {object|null} - Bridge instance with sendToApp method, or null if not in app
 */
export const initAppBridge = (handlers = {}) => {
  if (typeof window === 'undefined') return null;
  
  // Check if we're in WebView
  const isInApp = 
    window.ReactNativeWebView || 
    navigator.userAgent.includes('ReactNative') ||
    new URLSearchParams(window.location.search).get('app') === 'true' ||
    window.isReactNativeApp === true;
  
  if (!isInApp) {
    return null;
  }

  // Idempotent init (prevents multiple event listeners on re-mounts)
  if (isInitialized && bridgeInstance) {
    messageHandlers = handlers;
    return bridgeInstance;
  }
  
  // Store handlers
  messageHandlers = handlers;
  
  // Set up message listener
  const handleMessage = (event) => {
    try {
      let data;
      
      // Handle different message formats
      if (typeof event.data === 'string') {
        data = JSON.parse(event.data);
      } else if (event.data && typeof event.data === 'object') {
        data = event.data;
      } else {
        return;
      }
      
      handleAppMessage(data);
    } catch (e) {
      console.error('Failed to parse app message:', e);
    }
  };
  
  // Listen for messages from app
  // - window message: browser / some WebView implementations
  // - document message: react-native-webview on Android often uses this
  window.addEventListener('message', handleMessage);
  document.addEventListener('message', handleMessage);
  cleanupFns.push(() => window.removeEventListener('message', handleMessage));
  cleanupFns.push(() => document.removeEventListener('message', handleMessage));
  
  // Also listen for React Native WebView messages
  if (window.ReactNativeWebView) {
    // React Native WebView uses a different mechanism
    // Messages are already handled by the injected script
  }
  
  // Create bridge instance
  bridgeInstance = {
    sendToApp: (type, payload) => {
      const message = { type, payload };
      const messageStr = JSON.stringify(message);
      
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(messageStr);
      } else {
        window.postMessage(message, '*');
      }
    },
    isInApp: true,
  };

  isInitialized = true;
  
  return bridgeInstance;
};

export const destroyAppBridge = () => {
  cleanupFns.forEach((fn) => {
    try {
      fn();
    } catch {
      // ignore
    }
  });
  cleanupFns = [];
  isInitialized = false;
  bridgeInstance = null;
  messageHandlers = {};
};

/**
 * Handle incoming messages from app
 * @param {object} data - Message data from app
 */
const handleAppMessage = (data) => {
  const { type, payload } = data;
  
  switch (type) {
    case 'AUTH_INIT':
      // Store token and user data
      if (payload.token) {
        // Store token in memory or cookie
        if (typeof document !== 'undefined') {
          // Option 1: Store in sessionStorage (cleared on tab close)
          sessionStorage.setItem('appAuthToken', payload.token);
          
          // Option 2: Store in cookie (if you want it to persist)
          // document.cookie = `appAuthToken=${payload.token}; path=/; SameSite=None; Secure`;
        }
        
        // Call handler if provided
        if (messageHandlers.onAuthInit) {
          messageHandlers.onAuthInit(payload);
        }
      }
      break;
      
    case 'USER_UPDATE':
      if (messageHandlers.onUserUpdate) {
        messageHandlers.onUserUpdate(payload.user);
      }
      break;
      
    case 'CART_SYNC':
      if (messageHandlers.onCartSync) {
        messageHandlers.onCartSync(payload.cartItems);
      }
      break;
      
    default:
      console.log('Unknown message type from app:', type);
  }
};

/**
 * Send message to React Native app
 * @param {string} type - Message type
 * @param {object} payload - Message payload
 */
export const sendToApp = (type, payload) => {
  if (!bridgeInstance) {
    console.warn('App bridge not initialized. Call initAppBridge() first.');
    return;
  }
  
  bridgeInstance.sendToApp(type, payload);
};

/**
 * Notify app that product was added to cart
 * @param {object} product - Product object
 * @param {object} variant - Selected variant
 * @param {number} quantity - Quantity added
 */
export const notifyProductAddedToCart = (product, variant, quantity = 1) => {
  sendToApp('PRODUCT_ADDED_TO_CART', {
    productId: product.id,
    productName: product.name,
    variant: variant,
    quantity: quantity,
    price: variant.disPrice || variant.mrp,
  });
};

/**
 * Notify app that product was removed from cart
 * @param {number} productId - Product ID
 */
export const notifyProductRemovedFromCart = (productId) => {
  sendToApp('PRODUCT_REMOVED_FROM_CART', {
    productId: productId,
  });
};

/**
 * Notify app that cart was updated
 * @param {array} cartItems - Array of cart items
 * @param {number} totalItems - Total number of items
 */
export const notifyCartUpdated = (cartItems, totalItems) => {
  sendToApp('CART_UPDATED', {
    cartItems: cartItems,
    totalItems: totalItems,
  });
};

/**
 * Notify app that wishlist was updated
 * @param {number} productId - Product ID
 * @param {boolean} isWishlisted - Whether product is wishlisted
 */
export const notifyWishlistUpdated = (productId, isWishlisted) => {
  sendToApp('WISHLIST_UPDATED', {
    productId: productId,
    isWishlisted: isWishlisted,
  });
};

/**
 * Request authentication from app
 */
export const requestAuth = () => {
  sendToApp('AUTH_REQUIRED', {});
};

/**
 * Request navigation in app
 * @param {string} route - Route to navigate to
 */
export const requestNavigation = (route) => {
  sendToApp('NAVIGATION_REQUEST', {
    route: route,
  });
};

/**
 * Get stored authentication token
 * @returns {string|null} - Token if found, null otherwise
 */
export const getAppAuthToken = () => {
  if (typeof window === 'undefined') return null;
  
  // Check sessionStorage first
  const sessionToken = sessionStorage.getItem('appAuthToken');
  if (sessionToken) return sessionToken;
  
  // Check URL params (fallback)
  const urlParams = new URLSearchParams(window.location.search);
  const urlToken = urlParams.get('token');
  if (urlToken) return urlToken;
  
  return null;
};
