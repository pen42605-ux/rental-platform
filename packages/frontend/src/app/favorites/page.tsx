'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import ListingCard from '@/components/listings/ListingCard';
import EmptyState from '@/components/common/EmptyState';
import { ListingGridSkeleton } from '@/components/common/LoadingSkeleton';
import Pagination from '@/components/listings/Pagination';
import type { Listing } from '@/lib/api';

/**
 * 收藏清單頁面
 */
export default function FavoritesPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    // TODO: 呼叫 API 取得收藏列表
    // listingService.getFavorites({ page }).then(...)
    setLoading(false);
  }, [page]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="w-7 h-7 text-red-500 fill-red-500" />
        <h1 className="text-2xl font-bold">我的收藏</h1>
        <span className="text-muted-foreground">({listings.length} 筆)</span>
      </div>

      {loading ? (
        <ListingGridSkeleton count={6} />
      ) : listings.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing, index) => (
              <ListingCard key={listing.id} listing={listing} index={index} isFavorited />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      ) : (
        <EmptyState
          type="no-favorites"
          actionLabel="瀏覽房源"
          onAction={() => (window.location.href = '/')}
        />
      )}
    </div>
  );
}
