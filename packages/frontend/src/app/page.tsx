'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  MapIcon,
  Squares2X2Icon,
  FunnelIcon,
  FireIcon,
  StarIcon,
  HomeIcon,
  BuildingOfficeIcon,
  BuildingStorefrontIcon,
  MapPinIcon,
  SparklesIcon,
  BuildingLibraryIcon,
  WrenchScrewdriverIcon,
  TruckIcon,
  HomeModernIcon,
  BuildingOffice2Icon,
  BanknotesIcon,
  ChartBarIcon,
  UserGroupIcon,
  BellIcon,
  HeartIcon,
  BookmarkIcon,
  CameraIcon,
  PaintBrushIcon,
} from '@heroicons/react/24/outline';
import { listingsApi, Listing } from '@/lib/api';
import { useFilterStore, useMapStore, useAuthStore } from '@/lib/store';
import ListingCard from '@/components/listings/ListingCard';
import FilterSidebar from '@/components/listings/FilterSidebar';
import Pagination from '@/components/listings/Pagination';
import Link from 'next/link';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';

type ViewMode = 'grid' | 'map';

// 熱門搜尋關鍵字
const HOT_SEARCHES = [
  '台北市', '新北市', '桃園市', '台中市', '高雄市',
  '信義區', '大安區', '板橋區', '中壢區', '西屯區',
  '捷運站', '近學校', '近商圈', '電梯大樓', '透天厝'
];

// 房源分類 - 多樣化圖示
const PROPERTY_CATEGORIES = [
  { name: '新建案', icon: SparklesIcon, href: '/?type=新建案', color: 'from-blue-500 to-blue-600', emoji: '✨' },
  { name: '中古屋', icon: HomeModernIcon, href: '/?type=中古屋', color: 'from-emerald-500 to-emerald-600', emoji: '🏘️' },
  { name: '租屋', icon: HomeIcon, href: '/?type=租屋', color: 'from-cyan-500 to-cyan-600', emoji: '🏠' },
  { name: '土地', icon: MapPinIcon, href: '/?type=土地', color: 'from-amber-500 to-amber-600', emoji: '🗺️' },
  { name: '店面', icon: BuildingStorefrontIcon, href: '/?type=店面', color: 'from-purple-500 to-purple-600', emoji: '🏪' },
  { name: '辦公', icon: BuildingOffice2Icon, href: '/?type=辦公', color: 'from-indigo-500 to-indigo-600', emoji: '🏢' },
  { name: '廠房', icon: WrenchScrewdriverIcon, href: '/?type=廠房', color: 'from-slate-500 to-slate-600', emoji: '🏭' },
  { name: '社區', icon: UserGroupIcon, href: '/?type=社區', color: 'from-rose-500 to-rose-600', emoji: '👥' },
];

export default function HomePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    totalItems: 0,
    totalPages: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showFeatured, setShowFeatured] = useState(true);

  const filters = useFilterStore();
  const { selectedListingId, setSelectedListing } = useMapStore();
  const { user, isAuthenticated } = useAuthStore();

  // 載入推薦房源
  const fetchFeaturedListings = async () => {
    setFeaturedLoading(true);
    try {
      const response = await listingsApi.getList({
        page: 1,
        limit: 6,
        status: 'PUBLISHED',
        sortBy: 'createdAt',
      });
      setFeaturedListings(response.data.data.items);
    } catch (error) {
      console.error('Failed to fetch featured listings:', error);
    } finally {
      setFeaturedLoading(false);
    }
  };

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
    fetchFeaturedListings();
    fetchListings(1);
  }, []);

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
    setShowFeatured(false);
    fetchListings(1);
  };

  // 頁碼變更
  const handlePageChange = (page: number) => {
    fetchListings(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50">
      {/* Hero 區域 - 藍色背景 */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-600 py-12 md:py-16 overflow-hidden">
        {/* 背景裝飾 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* 管理員入口 */}
          {isAuthenticated && user?.role === 'ADMIN' && (
            <div className="flex justify-end mb-4">
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg border border-white/30 transition-colors backdrop-blur-sm"
              >
                <Cog6ToothIcon className="w-5 h-5" />
                <span className="font-medium">管理後台</span>
              </Link>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
              好房網 - 找房更簡單
            </h1>
            <p className="text-white/90 text-base md:text-lg max-w-2xl mx-auto">
              全台最大租屋、買房平台，數萬筆精選房源，快速找到理想的家
            </p>
          </motion.div>

          {/* 搜尋框 - 591風格 */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSearch}
            className="max-w-4xl mx-auto mb-6"
          >
            <div className="flex bg-white rounded-xl shadow-2xl overflow-hidden">
              <div className="flex-1 flex items-center px-4 md:px-6">
                <MagnifyingGlassIcon className="w-5 h-5 md:w-6 md:h-6 text-gray-400 mr-2 md:mr-3 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="搜尋地區、捷運站、關鍵字..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-3 md:py-4 text-base md:text-lg text-gray-900 placeholder-gray-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 md:px-10 py-3 md:py-4 font-semibold transition-colors whitespace-nowrap"
              >
                搜尋
              </button>
            </div>
          </motion.form>

          {/* 熱門搜尋 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-2 mb-3">
              <FireIcon className="w-5 h-5 text-yellow-300" />
              <SparklesIcon className="w-5 h-5 text-yellow-300" />
              <span className="text-white/90 text-sm font-medium">熱門搜尋：</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {HOT_SEARCHES.map((keyword) => (
                <button
                  key={keyword}
                  onClick={() => {
                    setSearchQuery(keyword);
                    setShowFeatured(false);
                    fetchListings(1);
                  }}
                  className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-sm rounded-full transition-colors backdrop-blur-sm border border-white/30"
                >
                  {keyword}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 房源分類快速入口 - 多樣化圖示 */}
      <section className="bg-gradient-to-b from-blue-50 to-cyan-50 border-b border-blue-200 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-6 justify-center">
            <ChartBarIcon className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-blue-900">房源分類</h2>
            <SparklesIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-4">
            {PROPERTY_CATEGORIES.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.name}
                  href={category.href}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/80 hover:bg-white border-2 border-blue-200 hover:border-blue-400 transition-all group shadow-md hover:shadow-xl"
                >
                  <div className={`relative w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 md:w-8 md:h-8 text-white z-10" />
                    <span className="absolute -top-1 -right-1 text-lg">{category.emoji}</span>
                  </div>
                  <span className="text-xs md:text-sm font-semibold text-blue-900 group-hover:text-blue-600 transition-colors text-center">
                    {category.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 推薦房源區塊 */}
      {showFeatured && featuredListings.length > 0 && (
        <section className="bg-gradient-to-b from-white to-blue-50 py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <StarIcon className="w-7 h-7 text-yellow-500 fill-yellow-500" />
                <SparklesIcon className="w-6 h-6 text-blue-500" />
                <h2 className="text-2xl md:text-3xl font-bold text-blue-900">精選推薦</h2>
                <BookmarkIcon className="w-6 h-6 text-blue-500" />
              </div>
              <Link
                href="/"
                onClick={() => setShowFeatured(false)}
                className="text-primary-600 hover:text-primary-700 font-medium text-sm md:text-base"
              >
                查看更多 →
              </Link>
            </div>
            {featuredLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card">
                    <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
                    <div className="p-4 space-y-3">
                      <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2" />
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredListings.map((listing, index) => (
                  <ListingCard key={listing.id} listing={listing} index={index} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 主要內容區 */}
      <section className="container mx-auto px-4 py-8">
        {/* 工具列 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <HomeIcon className="w-5 h-5 text-blue-600" />
              <p className="text-blue-800">
                找到 <span className="font-bold text-blue-900">{pagination.totalItems}</span> 筆房源
              </p>
            </div>

            {/* 手機版篩選按鈕 */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden btn-secondary border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              <FunnelIcon className="w-5 h-5 mr-1" />
              篩選
            </button>
          </div>

          {/* 檢視模式切換 */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white rounded-xl p-1 shadow-sm border-2 border-blue-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Squares2X2Icon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'map'
                    ? 'bg-blue-600 text-white'
                    : 'text-blue-600 hover:bg-blue-50'
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
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card">
                    <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
                    <div className="p-4 space-y-3">
                      <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2" />
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
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
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      沒有找到符合條件的房源
                    </h3>
                    <p className="text-gray-500 mb-4">
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
              <div className="text-center py-16">
                <MapIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">地圖模式開發中...</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
