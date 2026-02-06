/**
 * 房屋物件相關 Hooks
 */

import { useState, useEffect } from 'react';
import { Property, PropertySearchParams, PropertySearchResult } from '@/types';

export const useProperty = (propertyId: string) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setIsLoading(true);
        // TODO: 實作 API 呼叫
        // const response = await api.getProperty(propertyId);
        // setProperty(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '載入失敗');
      } finally {
        setIsLoading(false);
      }
    };

    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  return { property, isLoading, error };
};

export const usePropertySearch = (params: PropertySearchParams) => {
  const [result, setResult] = useState<PropertySearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (newParams?: PropertySearchParams) => {
    try {
      setIsLoading(true);
      const searchParams = { ...params, ...newParams };
      // TODO: 實作 API 呼叫
      // const response = await api.searchProperties(searchParams);
      // setResult(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '搜尋失敗');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    search();
  }, []);

  return { result, isLoading, error, search };
};

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleFavorite = async (propertyId: string) => {
    try {
      setIsLoading(true);
      const isFavorite = favorites.includes(propertyId);
      
      if (isFavorite) {
        setFavorites(favorites.filter(id => id !== propertyId));
        // TODO: API call to remove favorite
      } else {
        setFavorites([...favorites, propertyId]);
        // TODO: API call to add favorite
      }
    } catch (err) {
      console.error('Failed to toggle favorite', err);
    } finally {
      setIsLoading(false);
    }
  };

  const isFavorite = (propertyId: string) => favorites.includes(propertyId);

  return { favorites, toggleFavorite, isFavorite, isLoading };
};
