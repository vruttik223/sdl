
import { GoogleMapsContext } from '@/helper/mapsContext/googleMapsProvider';
import { useContext, useEffect, useState } from 'react';

export const buildProductUrl = (slug) => {
  if (typeof window === 'undefined') return '';
  const baseUrl = window.location.origin;
  return slug ? `${baseUrl}/products/${slug}` : baseUrl;
};

export const getShareLinks = (productUrl, productName = '') => ({
  facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`,
  twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(productName)}`,
  whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${productName} ${productUrl}`)}`,
  linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(productUrl)}`,
});

export const openShareWindow = (url, onClose) => {
  if (!url) return;
  window.open(url, '_blank');
  if (typeof onClose === 'function') onClose();
};

export const copyLinkToClipboard = (text, onCopy) => {
  if (typeof navigator === 'undefined' || !text) return;
  navigator.clipboard.writeText(text);
  if (typeof onCopy === 'function') onCopy();
};

let googleMapsPromise = null;

export function loadGoogleMaps(apiKey, libraries = ["places"]) {
  // console.log('[loadGoogleMaps] Called with libraries:', libraries);

  if (typeof window === "undefined") {
    // console.log('[loadGoogleMaps] ⚠️ Running on server side, skipping');
    return Promise.resolve();
  }

  if (window.google?.maps) {
    // console.log('[loadGoogleMaps] ✅ Google Maps already loaded');
    return Promise.resolve();
  }

  if (!googleMapsPromise) {
    // console.log('[loadGoogleMaps] Creating new script promise');
    googleMapsPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector(
        'script[src^="https://maps.googleapis.com/maps/api/js"]'
      );

      if (existingScript) {
        // console.log('[loadGoogleMaps] Found existing script, waiting for load');
        existingScript.addEventListener("load", () => {
          // console.log('[loadGoogleMaps] ✅ Existing script loaded');
          resolve();
        });
        existingScript.addEventListener("error", (err) => {
          console.error('[loadGoogleMaps] ❌ Existing script error:', err);
          reject(err);
        });
        return;
      }

      const script = document.createElement("script");
      const scriptUrl = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${libraries.join(",")}`;
      script.src = scriptUrl;
      script.async = true;
      // script.defer = true;
      // console.log('[loadGoogleMaps] 📥 Appending script to head:', scriptUrl);
      script.onload = () => {
        // console.log('[loadGoogleMaps] ✅ Script loaded successfully');
        resolve();
      };
      script.onerror = (err) => {
        console.error('[loadGoogleMaps] ❌ Script loading error:', err);
        reject(err);
      };
      document.head.appendChild(script);
    });
  } else {
    // console.log('[loadGoogleMaps] Using existing promise');
  }

  return googleMapsPromise;
};

export const MapsStatus = {
  READY: 'ready',
  FAILED: 'failed',
  LOADING: 'loading',
};

export const useGoogleMapsStatus = () => {
  return useContext(GoogleMapsContext);
};


export function useGooglePlaces({ inputRef, country, onSelect }) {
  useEffect(() => {
    // console.log('[useGooglePlaces] Effect triggered for country:', country);

    if (!inputRef.current) {
      // console.log('[useGooglePlaces] ⚠️ inputRef not available yet');
      return;
    }

    if (!window.google?.maps?.places) {
      console.warn('[useGooglePlaces] ⚠️ Google Maps not loaded yet');
      return;
    }

    try {
      // console.log('[useGooglePlaces] 🎯 Initializing Autocomplete...');
      const autocomplete = new google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ['address'],
          componentRestrictions: { country },
        }
      );
      // console.log('[useGooglePlaces] ✅ Autocomplete initialized');

      autocomplete.addListener('place_changed', () => {
        // console.log('[useGooglePlaces] 📍 Place changed event fired');
        const place = autocomplete.getPlace();
        // console.log('[useGooglePlaces] Selected place:', place);

        if (place && place.geometry) {
          // console.log('[useGooglePlaces] ✅ Valid place with geometry, parsing...');
          const parsed = parseGooglePlace(place);
          // console.log('[useGooglePlaces] Parsed address:', parsed);
          onSelect(parsed);
        } else {
          console.warn('[useGooglePlaces] ⚠️ Place missing geometry:', place);
        }
      });
    } catch (error) {
      console.error('[useGooglePlaces] ❌ Error initializing autocomplete:', error);
    }
  }, [country, onSelect]);
};

export function parseGooglePlace(place) {
  // console.log('[parseGooglePlace] Parsing place:', place);

  const get = (type) =>
    place.address_components?.find(c => c.types.includes(type))?.long_name;

  const parsed = {
    address1: place.name,
    city: get('locality'),
    state: get('administrative_area_level_1'),
    country: get('country'),
    pincode: get('postal_code'),
    latitude: place.geometry?.location?.lat(),
    longitude: place.geometry?.location?.lng(),
    placeId: place.place_id,
    googleAddress: place.formatted_address,
  };

  // console.log('[parseGooglePlace] ✅ Parsed result:', parsed);
  return parsed;
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
};


/**
 * Upload a file to S3 using presigned URL
 * @param {File} file - The file to upload
 * @param {string} folder - The S3 folder path (e.g., "SDL/profile", "SDL/documents")
 * @returns {Promise<string>} The S3 key of the uploaded file
 */
export const uploadFileToS3 = async (file, folder = "SDL/uploads") => {
  if (!file || !(file instanceof File)) {
    throw new Error("Invalid file provided for upload");
  }

  const response = await fetch(
    "https://sdlserver.hyplap.com/api/get-presigned-url",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
        folder: folder,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to get presigned URL: ${response.statusText}`);
  }

  const responseData = await response.json();
  const { presignedUrl, key } = responseData;

  if (!presignedUrl || !key) {
    throw new Error("Invalid presigned URL response");
  }

  // 2) Upload file to S3 using presigned URL
  const uploadRes = await fetch(presignedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!uploadRes.ok) {
    throw new Error(`Failed to upload file to S3: ${uploadRes.statusText}`);
  }

  return key;
};

export const formatAddress = (address) => {
  if (!address) return '';

  return `${address.addressLine1}, ${address.addressLine2 ? `${address.addressLine2}, ` : ''}${address.landmark ? `${address.landmark}, ` : ''}${address.city}, ${address.state} - ${address.pincode}, ${address.country}`.replace(/\s+/g, ' ').trim();
};

export const convertToRupees = (value) => {
  const amount = Number(value);
  return `₹ ${amount.toFixed(2)}`;
};

export const formatReviewCount = (value) => {
  if (value < 1000) return String(value);

  if (value < 100000) {
    // 1,000 → 1k | 99,999 → 99.9k
    return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`;
  }

  if (value < 10000000) {
    // 1,00,000 → 1L | 9,99,999 → 9.9L
    return `${(value / 100000).toFixed(value % 100000 === 0 ? 0 : 1)}L`;
  }

  // 1,00,00,000+ → M
  return `${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1)}M`;
};