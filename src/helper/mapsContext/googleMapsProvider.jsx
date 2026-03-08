'use client';

import { loadGoogleMaps, MapsStatus } from '@/utils/helpers';
import { createContext, useContext, useEffect, useState } from 'react';

export const GoogleMapsContext = createContext(null);

export const GoogleMapsProvider = ({ children }) => {
  const [mapsStatus, setMapsStatus] = useState(MapsStatus.LOADING);

  useEffect(() => {
    // console.log('[GoogleMapsProvider] Initializing...');
    const apiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY;
    
    if (!apiKey) {
      console.error('[GoogleMapsProvider] ❌ API key is missing');
      setMapsStatus(MapsStatus.FAILED);
      return;
    }

    // console.log('[GoogleMapsProvider] Loading Google Maps with API key:', apiKey.substring(0, 10) + '...');
    loadGoogleMaps(apiKey, ['places'])
      .then(() => {
        // console.log('[GoogleMapsProvider] ✅ Google Maps loaded successfully');
        setMapsStatus(MapsStatus.READY);
      })
      .catch((err) => {
        // console.error('[GoogleMapsProvider] ❌ Failed to load Google Maps:', err);
        setMapsStatus(MapsStatus.FAILED);
      });
  }, []);

  return (
    <GoogleMapsContext.Provider value={mapsStatus}>
      {children}
    </GoogleMapsContext.Provider>
  );
};
