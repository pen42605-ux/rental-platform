'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  HeartIcon,
  ShareIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { listingsApi, Listing } from '@/lib/api';
import { formatPrice, formatArea, PROPERTY_TYPE_MAP, AMENITIES_LIST, formatDate } from '@/lib/utils';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';

const ListingMap = dynamic(() => import('@/components/map/ListingMap'), {
  ssr: false,
  loading: () => <div className="h-64 bg-secondary-100 rounded-xl animate-pulse" />,
});

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await listingsApi.getById(params.id as string);
        setListing(response.data.data);
      } catch (error) {
        console.error('Failed to fetch listing:', error);
        toast.error('無法載入房源資訊');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchListing();
    }
  }, [params.id]);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: listing?.title,
        text: `${listing?.title} - ${formatPrice(listing?.price || 0)}/月`,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('連結已複製到剪貼簿');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-96 bg-secondary-200 rounded-2xl mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-8 bg-secondary-200 rounded w-3/4" />
                <div className="h-6 bg-secondary-200 rounded w-1/2" />
                <div className="h-32 bg-secondary-200 rounded" />
              </div>
              <div className="h-64 bg-secondary-200 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-semibold text-secondary-900 mb-2">找不到此房源</h2>
          <p className="text-secondary-500 mb-4">房源可能已被刪除或下架</p>
          <button onClick={() => router.push('/')} className="btn-primary">
            回首頁
          </button>
        </div>
      </div>
    );
  }

  const images = listing.images || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 返回按鈕 */}
      <div className="container mx-auto px-4 py-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-secondary-600 hover:text-primary-500 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          返回列表
        </button>
      </div>

      {/* 圖片輪播 */}
      <section className="container mx-auto px-4 mb-8">
        <div className="relative aspect-video md:aspect-[21/9] bg-secondary-100 rounded-2xl overflow-hidden">
          {images.length > 0 ? (
            <>
              <Image
                src={images[currentImageIndex].url}
                alt={listing.title}
                fill
                className="object-cover"
              />

              {/* 輪播控制 */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setCurrentImageIndex((prev) =>
                        prev === 0 ? images.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                  >
                    <ChevronLeftIcon className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentImageIndex((prev) =>
                        prev === images.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                  >
                    <ChevronRightIcon className="w-6 h-6" />
                  </button>

                  {/* 圖片指示器 */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === currentImageIndex
                            ? 'bg-white w-6'
                            : 'bg-white/50 hover:bg-white/75'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* 圖片計數 */}
              <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {images.length}
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-secondary-400">暫無圖片</span>
            </div>
          )}

          {/* 操作按鈕 */}
          <div className="absolute top-4 left-4 flex gap-2">
            <button
              onClick={() => setIsFavorited(!isFavorited)}
              className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
            >
              {isFavorited ? (
                <HeartSolidIcon className="w-5 h-5 text-red-500" />
              ) : (
                <HeartIcon className="w-5 h-5 text-secondary-600" />
              )}
            </button>
            <button
              onClick={handleShare}
              className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
            >
              <ShareIcon className="w-5 h-5 text-secondary-600" />
            </button>
          </div>
        </div>

        {/* 縮略圖 */}
        {images.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {images.map((image, idx) => (
              <button
                key={image.id}
                onClick={() => setCurrentImageIndex(idx)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  idx === currentImageIndex
                    ? 'border-primary-500'
                    : 'border-transparent hover:border-secondary-300'
                }`}
              >
                <Image
                  src={image.url}
                  alt=""
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* 主要內容 */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左側內容 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 標題區塊 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="badge-primary mb-2">
                    {PROPERTY_TYPE_MAP[listing.propertyType]}
                  </span>
                  <h1 className="text-3xl font-bold text-secondary-900">
                    {listing.title}
                  </h1>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary-600">
                    {formatPrice(listing.price)}
                  </div>
                  <div className="text-secondary-500">/月</div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-secondary-600">
                <MapPinIcon className="w-5 h-5" />
                <span>
                  {listing.city}
                  {listing.district && ` ${listing.district}`}
                  {listing.address && ` ${listing.address}`}
                </span>
              </div>
            </motion.div>

            {/* 規格 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-6"
            >
              <h2 className="text-lg font-semibold text-secondary-900 mb-4">房屋規格</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-secondary-50 rounded-xl">
                  <div className="text-3xl mb-2">🛏️</div>
                  <div className="text-2xl font-bold text-secondary-900">{listing.beds}</div>
                  <div className="text-secondary-500 text-sm">房間</div>
                </div>
                <div className="text-center p-4 bg-secondary-50 rounded-xl">
                  <div className="text-3xl mb-2">🚿</div>
                  <div className="text-2xl font-bold text-secondary-900">{listing.baths}</div>
                  <div className="text-secondary-500 text-sm">衛浴</div>
                </div>
                <div className="text-center p-4 bg-secondary-50 rounded-xl">
                  <div className="text-3xl mb-2">📐</div>
                  <div className="text-2xl font-bold text-secondary-900">
                    {listing.area || '-'}
                  </div>
                  <div className="text-secondary-500 text-sm">坪</div>
                </div>
                <div className="text-center p-4 bg-secondary-50 rounded-xl">
                  <div className="text-3xl mb-2">👁️</div>
                  <div className="text-2xl font-bold text-secondary-900">
                    {listing.viewCount}
                  </div>
                  <div className="text-secondary-500 text-sm">瀏覽</div>
                </div>
              </div>
            </motion.div>

            {/* 描述 */}
            {listing.description && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card p-6"
              >
                <h2 className="text-lg font-semibold text-secondary-900 mb-4">房源介紹</h2>
                <p className="text-secondary-700 whitespace-pre-line leading-relaxed">
                  {listing.description}
                </p>
              </motion.div>
            )}

            {/* 設施 */}
            {listing.amenities && (() => {
              const amenitiesArr = typeof listing.amenities === 'string' 
                ? JSON.parse(listing.amenities) 
                : listing.amenities;
              return amenitiesArr.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="card p-6"
                >
                  <h2 className="text-lg font-semibold text-secondary-900 mb-4">設施設備</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {amenitiesArr.map((amenityId: string) => {
                      const amenity = AMENITIES_LIST.find((a) => a.id === amenityId);
                      if (!amenity) return null;
                      return (
                        <div
                          key={amenityId}
                          className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl"
                        >
                          <CheckCircleIcon className="w-5 h-5 text-emerald-500" />
                          <span className="text-secondary-700">{amenity.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              ) : null;
            })()}

            {/* 地圖 */}
            {listing.latitude && listing.longitude && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card p-6"
              >
                <h2 className="text-lg font-semibold text-secondary-900 mb-4">位置</h2>
                <ListingMap
                  listings={[listing]}
                  center={{ lat: listing.latitude, lng: listing.longitude }}
                  zoom={15}
                  height="300px"
                />
              </motion.div>
            )}
          </div>

          {/* 右側聯絡卡片 */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-6 sticky top-24"
            >
              {/* 房東資訊 */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-600">
                    {listing.user?.name?.charAt(0) || '房'}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-900">
                    {listing.user?.name || '房東'}
                  </h3>
                  <p className="text-secondary-500 text-sm">
                    發布於 {formatDate(listing.createdAt)}
                  </p>
                </div>
              </div>

              {/* 聯絡按鈕 */}
              <div className="space-y-3">
                <button
                  onClick={() => setShowContact(!showContact)}
                  className="w-full btn-primary"
                >
                  <PhoneIcon className="w-5 h-5 mr-2" />
                  聯絡房東
                </button>
                <button className="w-full btn-secondary">
                  <EnvelopeIcon className="w-5 h-5 mr-2" />
                  發送訊息
                </button>
              </div>

              {/* 聯絡資訊（展開後顯示） */}
              {showContact && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 p-4 bg-secondary-50 rounded-xl"
                >
                  <p className="text-secondary-700 text-sm mb-2">
                    聯絡時請說明是在「好房網」看到的
                  </p>
                  <p className="font-semibold text-secondary-900">
                    📞 0912-345-678
                  </p>
                </motion.div>
              )}

              {/* 安全提醒 */}
              <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
                <p className="text-amber-800 text-sm">
                  ⚠️ 租屋提醒：看屋時請注意安全，簽約前請確認房東身份及合約內容。
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}


