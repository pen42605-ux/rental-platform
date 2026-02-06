'use client';

import { useState, useEffect, useCallback } from 'react';
import { listingsApi, Listing } from '@/lib/api';
import type { ListingSearchParams } from '@/types/listing';

/**
 * 房源列表 hook
 * 提供房源查詢、分頁、篩選功能
 */
export function useListings(initialParams?: ListingSearchParams) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    totalItems: 0,
    totalPages: 0,
  });
  const [params, setParams] = useState<ListingSearchParams>(
    initialParams || { page: 1, limit: 12 }
  );

  const fetchListings = useCallback(async (searchParams: ListingSearchParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await listingsApi.getList({
        ...searchParams,
        status: 'PUBLISHED',
      } as any);
      const data = response.data.data;

      setListings(data.items);
      setPagination({
        page: data.pagination.page,
        limit: data.pagination.limit || 12,
        totalItems: data.pagination.totalItems,
        totalPages: data.pagination.totalPages,
      });
    } catch (err: any) {
      setError(err.message || '載入房源失敗');
      console.error('Failed to fetch listings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings(params);
  }, [params, fetchListings]);

  const setPage = useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);

  const setFilters = useCallback((filters: Partial<ListingSearchParams>) => {
    setParams((prev) => ({ ...prev, ...filters, page: 1 }));
  }, []);

  const resetFilters = useCallback(() => {
    setParams({ page: 1, limit: 12 });
  }, []);

  const refresh = useCallback(() => {
    fetchListings(params);
  }, [params, fetchListings]);

  return {
    listings,
    loading,
    error,
    pagination,
    params,
    setPage,
    setFilters,
    resetFilters,
    refresh,
  };
}

/**
 * 單一房源 hook
 */
export function useListing(id: string) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchListing = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await listingsApi.getById(id);
        setListing(response.data.data);
      } catch (err: any) {
        setError(err.message || '載入房源詳情失敗');
        console.error('Failed to fetch listing:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  return { listing, loading, error };
}
