'use client';

import { useState, useCallback } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

/**
 * 地理位置 hook - 取得使用者目前位置
 */
export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: false,
  });

  const getCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: '您的瀏覽器不支援地理位置功能',
        loading: false,
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
        });
      },
      (error) => {
        let errorMessage = '無法取得位置';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '使用者拒絕了位置存取權限';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = '位置資訊不可用';
            break;
          case error.TIMEOUT:
            errorMessage = '取得位置逾時';
            break;
        }
        setState((prev) => ({
          ...prev,
          error: errorMessage,
          loading: false,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes cache
      }
    );
  }, []);

  return {
    ...state,
    getCurrentPosition,
  };
}
