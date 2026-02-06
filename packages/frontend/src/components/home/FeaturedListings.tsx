'use client';

import Link from 'next/link';
import { Star, Sparkles, Bookmark } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import ListingCard from '@/components/listings/ListingCard';
import type { Listing } from '@/lib/api';

interface FeaturedListingsProps {
  listings: Listing[];
  loading: boolean;
  onViewMore?: () => void;
}

export default function FeaturedListings({
  listings,
  loading,
  onViewMore,
}: FeaturedListingsProps) {
  if (!loading && listings.length === 0) return null;

  return (
    <section className="bg-gradient-to-b from-white to-blue-50 py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Star className="w-7 h-7 text-yellow-500 fill-yellow-500" />
            <Sparkles className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl md:text-3xl font-bold text-blue-900">
              精選推薦
            </h2>
            <Bookmark className="w-6 h-6 text-blue-500" />
          </div>
          {onViewMore && (
            <button
              onClick={onViewMore}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm md:text-base"
            >
              查看更多 &rarr;
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl border bg-white overflow-hidden">
                <Skeleton className="aspect-[4/3] w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing, index) => (
              <ListingCard key={listing.id} listing={listing} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
