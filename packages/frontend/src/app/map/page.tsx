'use client';

import { useState } from 'react';
import { Search, Filter, List, Map as MapIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

/**
 * 地圖搜尋頁面
 * 提供全螢幕地圖搜尋體驗，類似 591 地圖找房
 */
export default function MapSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showList, setShowList] = useState(false);

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      {/* Top search bar */}
      <div className="bg-white border-b shadow-sm px-4 py-3 flex items-center gap-3 z-10">
        <div className="flex-1 flex items-center gap-2 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜尋地區、捷運站..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1 border rounded-lg p-0.5">
          <Button
            variant={!showList ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setShowList(false)}
          >
            <MapIcon className="h-4 w-4 mr-1" />
            地圖
          </Button>
          <Button
            variant={showList ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setShowList(true)}
          >
            <List className="h-4 w-4 mr-1" />
            列表
          </Button>
        </div>
      </div>

      {/* Map area */}
      <div className="flex-1 relative bg-gray-100">
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <MapIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">地圖搜尋功能開發中</p>
            <p className="text-sm mt-1">此頁面將整合 react-leaflet 提供互動式地圖搜尋</p>
          </div>
        </div>
      </div>
    </div>
  );
}
