/**
 * 房源相關的自訂 Hook
 */
import { useState, useEffect } from 'react';
import { Property, SearchFilters, PaginatedResponse } from '@/types';
import { api } from '@/lib/api';

export function useProperties(filters?: SearchFilters, page = 1, limit = 12) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
  });

  useEffect(() => {
    fetchProperties();
  }, [filters, page, limit]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters?.city && { city: filters.city }),
        ...(filters?.district && { district: filters.district }),
        ...(filters?.type && { type: filters.type }),
        ...(filters?.minPrice && { minPrice: filters.minPrice.toString() }),
        ...(filters?.maxPrice && { maxPrice: filters.maxPrice.toString() }),
      });

      const response = await api.get<PaginatedResponse<Property>>(
        `/api/listings?${params.toString()}`
      );

      setProperties(response.data.data);
      setPagination({
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit,
        totalPages: response.data.totalPages,
      });
    } catch (err: any) {
      setError(err.message || '載入房源失敗');
    } finally {
      setLoading(false);
    }
  };

  return {
    properties,
    loading,
    error,
    pagination,
    refetch: fetchProperties,
  };
}

export function useProperty(id: string) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<Property>(`/api/listings/${id}`);
      setProperty(response.data);
    } catch (err: any) {
      setError(err.message || '載入房源詳情失敗');
    } finally {
      setLoading(false);
    }
  };

  return {
    property,
    loading,
    error,
    refetch: fetchProperty,
  };
}
