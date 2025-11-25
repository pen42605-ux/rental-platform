'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  MapIcon,
  Squares2X2Icon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import { listingsApi, Listing, searchApi } from '@/lib/api';
import { useFilterStore, useMapStore } from '@/lib/store';
import ListingCard from '@/components/listings/ListingCard';
import FilterSidebar from '@/components/listings/FilterSidebar';
import Pagination from '@/components/listings/Pagination';
import dynamic from 'next/dynamic';

// 動態載入地圖（避免 SSR 問題）
const ListingMap = dynamic(() => import('@/components/map/ListingMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] bg-secondary-100 rounded-xl animate-pulse flex items-center justify-center">
      <span className="text-secondary-400">載入地圖中...</span>
    </div>
  ),
});

type ViewMode = 'grid' | 'map';

export default function HomePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    totalItems: 0,
    totalPages: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');

  const filters = useFilterStore();
  const { selectedListingId, setSelectedListing } = useMapStore();

  // 載入房源
  const fetchListings = async (page = 1) => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit: pagination.limit,
        status: 'PUBLISHED',
      };

      // 套用篩選條件
      if (searchQuery) params.q = searchQuery;
      if (filters.propertyType) params.propertyType = filters.propertyType;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.city) params.city = filters.city;
      if (filters.beds) params.beds = filters.beds;
      if (filters.sort) params.sortBy = filters.sort === 'newest' ? 'createdAt' : 'price';

      const response = await listingsApi.getList(params);
      const data = response.data.data;

      setListings(data.items);
      setPagination({
        ...pagination,
        page: data.pagination.page,
        totalItems: data.pagination.totalItems,
        totalPages: data.pagination.totalPages,
      });
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初始載入
  useEffect(() => {
    fetchListings(1);
  }, [
    filters.propertyType,
    filters.minPrice,
    filters.maxPrice,
    filters.city,
    filters.beds,
    filters.sort,
  ]);

  // 搜尋處理
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchListings(1);
  };

  // 頁碼變更
  const handlePageChange = (page: number) => {
    fetchListings(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero 區域 */}
      <section className="relative bg-gradient-to-br from-secondary-900 via-secondary-800 to-primary-900 py-16 overflow-hidden">
        {/* 背景裝飾 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-500 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              找到理想的家
            </h1>
            <p className="text-secondary-300 text-lg max-w-2xl mx-auto">
              瀏覽數千筆精選房源，從套房到整層住家，輕鬆找到符合您需求的完美住所
            </p>
          </motion.div>

          {/* 搜尋框 */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSearch}
            className="max-w-3xl mx-auto"
          >
            <div className="flex bg-white rounded-2xl shadow-2xl shadow-black/20 overflow-hidden">
              <div className="flex-1 flex items-center px-6">
                <MagnifyingGlassIcon className="w-6 h-6 text-secondary-400 mr-3" />
                <input
                  type="text"
                  placeholder="搜尋地區、捷運站、關鍵字..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-4 text-lg text-secondary-900 placeholder-secondary-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 font-semibold transition-colors"
              >
                搜尋
              </button>
            </div>
          </motion.form>

          {/* 快速篩選標籤 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 mt-6"
          >
            {['台北市', '新北市', '桃園市', '台中市', '高雄市'].map((city) => (
              <button
                key={city}
                onClick={() => {
                  filters.setFilter('city', city);
                  fetchListings(1);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filters.city === city
                    ? 'bg-primary-500 text-white'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {city}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 主要內容區 */}
      <section className="container mx-auto px-4 py-8">
        {/* 工具列 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <p className="text-secondary-600">
              找到 <span className="font-semibold text-secondary-900">{pagination.totalItems}</span> 筆房源
            </p>

            {/* 手機版篩選按鈕 */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden btn-secondary"
            >
              <FunnelIcon className="w-5 h-5 mr-1" />
              篩選
            </button>
          </div>

          {/* 檢視模式切換 */}
          <div className="flex items-center gap-2 bg-white rounded-xl p-1 shadow-sm border border-secondary-100">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-primary-500 text-white'
                  : 'text-secondary-500 hover:bg-secondary-50'
              }`}
            >
              <Squares2X2Icon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'map'
                  ? 'bg-primary-500 text-white'
                  : 'text-secondary-500 hover:bg-secondary-50'
              }`}
            >
              <MapIcon className="w-5 h-5" />
            </button>
          </div>

          {/* 排序 */}
          <select
            value={filters.sort}
            onChange={(e) => filters.setFilter('sort', e.target.value)}
            className="hidden md:block input w-auto"
          >
            <option value="newest">最新發布</option>
            <option value="price_asc">價格低到高</option>
            <option value="price_desc">價格高到低</option>
          </select>
        </div>

        {/* 內容區域 */}
        <div className="flex gap-8">
          {/* 桌面版篩選側邊欄 */}
          <div className="hidden lg:block">
            <FilterSidebar />
          </div>

          {/* 手機版篩選側邊欄 */}
          <FilterSidebar
            isMobile
            isOpen={mobileFilterOpen}
            onClose={() => setMobileFilterOpen(false)}
          />

          {/* 房源列表/地圖 */}
          <div className="flex-1">
            {loading ? (
              // 載入中骨架
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card">
                    <div className="aspect-[4/3] bg-secondary-200 animate-shimmer" />
                    <div className="p-4 space-y-3">
                      <div className="h-6 bg-secondary-200 rounded animate-shimmer w-1/2" />
                      <div className="h-4 bg-secondary-200 rounded animate-shimmer w-3/4" />
                      <div className="h-4 bg-secondary-200 rounded animate-shimmer w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : viewMode === 'grid' ? (
              <>
                {listings.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {listings.map((listing, index) => (
                      <ListingCard key={listing.id} listing={listing} index={index} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">🏠</div>
                    <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                      沒有找到符合條件的房源
                    </h3>
                    <p className="text-secondary-500 mb-4">
                      試試調整篩選條件或搜尋其他關鍵字
                    </p>
                    <button onClick={filters.resetFilters} className="btn-primary">
                      清除篩選條件
                    </button>
                  </div>
                )}

                {/* 分頁 */}
                {pagination.totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={pagination.page}
                      totalPages={pagination.totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            ) : (
              // 地圖模式
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:h-[600px] lg:overflow-y-auto lg:pr-4 space-y-4">
                  {listings.map((listing, index) => (
                    <div
                      key={listing.id}
                      onClick={() => setSelectedListing(listing.id)}
                      className={`cursor-pointer transition-all ${
                        selectedListingId === listing.id
                          ? 'ring-2 ring-primary-500 rounded-2xl'
                          : ''
                      }`}
                    >
                      <ListingCard listing={listing} index={index} />
                    </div>
                  ))}
                </div>
                <div className="h-[400px] lg:h-[600px] lg:sticky lg:top-20">
                  <ListingMap
                    listings={listings}
                    selectedId={selectedListingId}
                    onMarkerClick={(listing) => setSelectedListing(listing.id)}
                    height="100%"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}


