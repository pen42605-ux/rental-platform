'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { SlidersHorizontal, List, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import ListingCard from '@/components/listings/ListingCard';
import type { Listing } from '@/lib/api';

// 動態載入地圖元件 (避免 SSR)
const ListingMap = dynamic(() => import('@/components/map/ListingMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-muted flex items-center justify-center">
      <p className="text-muted-foreground">載入地圖中...</p>
    </div>
  ),
});

/**
 * 地圖搜尋頁 - 左側地圖 + 右側列表
 * 類似 591 的地圖找房功能
 */
export default function MapSearchPage() {
  const [listings] = useState<Listing[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);

  const handleMarkerClick = useCallback((listing: Listing) => {
    setSelectedId(listing.id);
  }, []);

  return (
    <div className="h-[calc(100vh-64px)] flex relative">
      {/* 地圖區域 */}
      <div className="flex-1 relative">
        <ListingMap
          listings={listings}
          selectedId={selectedId}
          onMarkerClick={handleMarkerClick}
          height="100%"
        />

        {/* 地圖上方控制列 */}
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-white shadow-md"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            <List className="w-4 h-4 mr-2" />
            {showSidebar ? '隱藏列表' : '顯示列表'}
          </Button>
          <Button variant="outline" size="sm" className="bg-white shadow-md">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            篩選
          </Button>
        </div>
      </div>

      {/* 右側列表面板 */}
      {showSidebar && (
        <div className="w-96 border-l bg-white flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold">
              找到 {listings.length} 筆房源
            </h2>
            <Button variant="ghost" size="icon" onClick={() => setShowSidebar(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {listings.length > 0 ? (
                listings.map((listing, index) => (
                  <div
                    key={listing.id}
                    onClick={() => setSelectedId(listing.id)}
                    className={`cursor-pointer rounded-xl transition-all ${
                      selectedId === listing.id
                        ? 'ring-2 ring-primary-500'
                        : ''
                    }`}
                  >
                    <ListingCard listing={listing} index={index} />
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    移動地圖以搜尋此區域的房源
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
