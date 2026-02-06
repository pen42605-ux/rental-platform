/**
 * 物件搜尋與管理 Hook
 */

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import type { Listing, ListingResponse, SearchFilters } from '@/types';

interface UseListingsOptions {
  filters?: SearchFilters;
  page?: number;
  pageSize?: number;
  autoFetch?: boolean;
}

export function useListings(options: UseListingsOptions = {}) {
  const { filters = {}, page = 1, pageSize = 20, autoFetch = true } = options;
  
  const [listings, setListings] = useState<Listing[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchListings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.get<ListingResponse>('/listings', {
        params: {
          ...filters,
          page,
          pageSize,
        },
      });
      
      setListings(response.data.listings);
      setTotal(response.data.total);
      setTotalPages(response.data.totalPages);
    } catch (err: any) {
      setError(err.message || '載入物件失敗');
      console.error('Failed to fetch listings:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters, page, pageSize]);

  useEffect(() => {
    if (autoFetch) {
      fetchListings();
    }
  }, [autoFetch, fetchListings]);

  return {
    listings,
    total,
    totalPages,
    isLoading,
    error,
    refetch: fetchListings,
  };
}

export function useListing(id: string) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchListing = useCallback(async () => {
    if (!id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.get<Listing>(`/listings/${id}`);
      setListing(response.data);
    } catch (err: any) {
      setError(err.message || '載入物件失敗');
      console.error('Failed to fetch listing:', err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchListing();
  }, [fetchListing]);

  return {
    listing,
    isLoading,
    error,
    refetch: fetchListing,
  };
}
