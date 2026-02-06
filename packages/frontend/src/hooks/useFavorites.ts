'use client';

import { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

/**
 * 收藏功能 hook
 */
export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<string[]>(
    'favorites',
    []
  );

  const isFavorited = useCallback(
    (listingId: string) => favorites.includes(listingId),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (listingId: string) => {
      setFavorites((prev) =>
        prev.includes(listingId)
          ? prev.filter((id) => id !== listingId)
          : [...prev, listingId]
      );
    },
    [setFavorites]
  );

  const addFavorite = useCallback(
    (listingId: string) => {
      setFavorites((prev) =>
        prev.includes(listingId) ? prev : [...prev, listingId]
      );
    },
    [setFavorites]
  );

  const removeFavorite = useCallback(
    (listingId: string) => {
      setFavorites((prev) => prev.filter((id) => id !== listingId));
    },
    [setFavorites]
  );

  return {
    favorites,
    isFavorited,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    count: favorites.length,
  };
}
