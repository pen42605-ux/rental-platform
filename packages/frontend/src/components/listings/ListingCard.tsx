'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { HeartIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { Listing } from '@/lib/api';
import { formatPrice, formatArea, PROPERTY_TYPE_MAP, formatRelativeTime } from '@/lib/utils';
import { useState } from 'react';

interface ListingCardProps {
  listing: Listing;
  index?: number;
  onFavorite?: (id: string) => void;
  isFavorited?: boolean;
}

export default function ListingCard({
  listing,
  index = 0,
  onFavorite,
  isFavorited = false,
}: ListingCardProps) {
  const [imageError, setImageError] = useState(false);
  const coverImage = listing.images?.find((img) => img.isCover) || listing.images?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/listing/${listing.id}`} className="block group">
        <article className="card overflow-hidden">
          {/* 圖片區域 */}
          <div className="relative aspect-[4/3] overflow-hidden bg-secondary-100">
            {coverImage && !imageError ? (
              <Image
                src={coverImage.url}
                alt={listing.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-secondary-100 to-secondary-200">
                <svg
                  className="w-16 h-16 text-secondary-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                </svg>
              </div>
            )}

            {/* 收藏按鈕 */}
            <button
              onClick={(e) => {
                e.preventDefault();
                onFavorite?.(listing.id);
              }}
              className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all hover:scale-110"
            >
              {isFavorited ? (
                <HeartSolidIcon className="w-5 h-5 text-red-500" />
              ) : (
                <HeartIcon className="w-5 h-5 text-secondary-600" />
              )}
            </button>

            {/* 房型標籤 */}
            <div className="absolute top-3 left-3">
              <span className="badge-primary">
                {PROPERTY_TYPE_MAP[listing.propertyType]}
              </span>
            </div>

            {/* 圖片數量 */}
            {listing.images && listing.images.length > 1 && (
              <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                📷 {listing.images.length}
              </div>
            )}
          </div>

          {/* 內容區域 */}
          <div className="p-4">
            {/* 價格 */}
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-2xl font-bold text-primary-600">
                {formatPrice(listing.price)}
              </span>
              <span className="text-secondary-500 text-sm">/月</span>
            </div>

            {/* 標題 */}
            <h3 className="font-semibold text-secondary-900 mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
              {listing.title}
            </h3>

            {/* 位置 */}
            <div className="flex items-center gap-1 text-secondary-500 text-sm mb-3">
              <MapPinIcon className="w-4 h-4 flex-shrink-0" />
              <span className="line-clamp-1">
                {listing.city}
                {listing.district && ` ${listing.district}`}
              </span>
            </div>

            {/* 規格 */}
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1 text-secondary-600">
                <span className="text-lg">🛏️</span>
                <span>{listing.beds} 房</span>
              </div>
              <div className="flex items-center gap-1 text-secondary-600">
                <span className="text-lg">🚿</span>
                <span>{listing.baths} 衛</span>
              </div>
              {listing.area && (
                <div className="flex items-center gap-1 text-secondary-600">
                  <span className="text-lg">📐</span>
                  <span>{formatArea(listing.area)}</span>
                </div>
              )}
            </div>

            {/* 發布時間 */}
            <div className="mt-3 pt-3 border-t border-secondary-100 flex items-center justify-between">
              <span className="text-xs text-secondary-400">
                {formatRelativeTime(listing.createdAt)}
              </span>
              <span className="text-xs text-secondary-400">
                👁️ {listing.viewCount}
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}






