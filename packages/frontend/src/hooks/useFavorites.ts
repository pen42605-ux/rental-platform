/**
 * 收藏功能 Hook
 */

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

export function useFavorites() {
  const { user, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.favorites) {
      setFavorites(user.favorites);
    } else {
      setFavorites([]);
    }
  }, [isAuthenticated, user]);

  const isFavorite = useCallback(
    (listingId: string) => {
      return favorites.includes(listingId);
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    async (listingId: string) => {
      if (!isAuthenticated) {
        toast.error('請先登入');
        return;
      }

      const isCurrentlyFavorite = isFavorite(listingId);
      
      // Optimistic update
      setFavorites((prev) =>
        isCurrentlyFavorite
          ? prev.filter((id) => id !== listingId)
          : [...prev, listingId]
      );

      try {
        if (isCurrentlyFavorite) {
          await api.delete(`/favorites/${listingId}`);
          toast.success('已取消收藏');
        } else {
          await api.post(`/favorites/${listingId}`);
          toast.success('已加入收藏');
        }
      } catch (error: any) {
        // Revert on error
        setFavorites((prev) =>
          isCurrentlyFavorite
            ? [...prev, listingId]
            : prev.filter((id) => id !== listingId)
        );
        toast.error(error.message || '操作失敗');
      }
    },
    [isAuthenticated, isFavorite]
  );

  const fetchFavorites = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      const response = await api.get('/favorites');
      setFavorites(response.data);
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  return {
    favorites,
    isLoading,
    isFavorite,
    toggleFavorite,
    refetch: fetchFavorites,
  };
}
