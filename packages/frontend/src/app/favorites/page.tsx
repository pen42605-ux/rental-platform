'use client';

import { Heart } from 'lucide-react';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import EmptyState from '@/components/shared/EmptyState';

/**
 * 收藏頁面
 */
export default function FavoritesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <Breadcrumbs items={[{ label: '我的收藏' }]} />
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 mb-6">
          <Heart className="h-6 w-6 text-red-500" />
          我的收藏
        </h1>

        <EmptyState
          icon={<Heart className="h-12 w-12" />}
          title="還沒有收藏任何房源"
          description="瀏覽房源時點擊愛心圖示即可加入收藏"
          actionLabel="開始瀏覽"
          onAction={() => (window.location.href = '/')}
        />
      </div>
    </div>
  );
}
