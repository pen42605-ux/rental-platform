'use client';

import { X, ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { formatPrice, formatArea } from '@/lib/utils';
import type { Listing } from '@/types';

interface CompareDrawerProps {
  listings: Listing[];
  isOpen: boolean;
  onClose: () => void;
  onRemove: (id: string) => void;
}

/**
 * 房源比較抽屜 - 最多比較 4 筆房源
 */
export default function CompareDrawer({
  listings,
  isOpen,
  onClose,
  onRemove,
}: CompareDrawerProps) {
  if (!isOpen || listings.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t shadow-2xl animate-slide-up">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-primary-500" />
            <h3 className="font-semibold text-lg">比較房源 ({listings.length}/4)</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <ScrollArea className="w-full">
          <div className="flex gap-4 pb-2">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="flex-shrink-0 w-64 bg-gray-50 rounded-xl p-3 relative group"
              >
                <button
                  onClick={() => onRemove(listing.id)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
                <h4 className="font-medium text-sm line-clamp-1 mb-1">
                  {listing.title}
                </h4>
                <p className="text-primary-600 font-bold text-sm">
                  {formatPrice(listing.price)}/月
                </p>
                <p className="text-xs text-muted-foreground">
                  {listing.beds}房 {listing.baths}衛 {listing.area ? formatArea(listing.area) : '-'}
                </p>
              </div>
            ))}

            {/* 空位提示 */}
            {Array.from({ length: 4 - listings.length }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="flex-shrink-0 w-64 border-2 border-dashed border-gray-200 rounded-xl p-3 flex items-center justify-center text-muted-foreground text-sm"
              >
                + 加入比較
              </div>
            ))}
          </div>
        </ScrollArea>

        <Separator className="my-3" />

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button disabled={listings.length < 2}>
            開始比較
          </Button>
        </div>
      </div>
    </div>
  );
}
