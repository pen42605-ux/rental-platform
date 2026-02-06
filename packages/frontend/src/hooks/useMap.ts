'use client';

import { useState, useCallback, useMemo } from 'react';
import type { GeoLocation, MapBounds, MapViewState } from '@/types/common';

// 台灣中心位置 (大約在南投)
const DEFAULT_CENTER: GeoLocation = {
  latitude: 23.97,
  longitude: 120.98,
};

const DEFAULT_ZOOM = 8;

// 台北市中心
export const TAIPEI_CENTER: GeoLocation = {
  latitude: 25.033,
  longitude: 121.565,
};

/**
 * 地圖狀態管理 hook
 */
export function useMap(initialCenter?: GeoLocation, initialZoom?: number) {
  const [viewState, setViewState] = useState<MapViewState>({
    center: initialCenter || DEFAULT_CENTER,
    zoom: initialZoom || DEFAULT_ZOOM,
  });

  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);

  const setCenter = useCallback((center: GeoLocation) => {
    setViewState((prev) => ({ ...prev, center }));
  }, []);

  const setZoom = useCallback((zoom: number) => {
    setViewState((prev) => ({ ...prev, zoom }));
  }, []);

  const setBounds = useCallback((bounds: MapBounds) => {
    setViewState((prev) => ({ ...prev, bounds }));
  }, []);

  const flyTo = useCallback((center: GeoLocation, zoom?: number) => {
    setViewState((prev) => ({
      ...prev,
      center,
      zoom: zoom || prev.zoom,
    }));
  }, []);

  const selectMarker = useCallback((id: string | null) => {
    setSelectedMarkerId(id);
  }, []);

  return {
    viewState,
    selectedMarkerId,
    setCenter,
    setZoom,
    setBounds,
    flyTo,
    selectMarker,
  };
}

/**
 * 用戶地理位置 hook
 */
export function useGeolocation() {
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('瀏覽器不支援地理位置功能');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes cache
      }
    );
  }, []);

  return { location, error, loading, requestLocation };
}
