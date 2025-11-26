'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  MapPinIcon,
  HomeIcon,
  CurrencyDollarIcon,
  UserIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import clsx from 'clsx';
import toast from 'react-hot-toast';

interface ListingDetail {
  listing: {
    id: string;
    title: string;
    description: string;
    price: number;
    currency: string;
    propertyType: string;
    beds: number;
    baths: number;
    area: number | null;
    address: string | null;
    city: string | null;
    district: string | null;
    amenities: string[];
    status: string;
    viewCount: number;
    createdAt: string;
    updatedAt: string;
    user: {
      id: string;
      name: string;
      email: string;
      phone: string | null;
      isBlocked: boolean;
      createdAt: string;
    };
    images: {
      id: string;
      url: string;
      isCover: boolean;
    }[];
    _count: { favorites: number };
  };
  auditLogs: {
    id: string;
    action: string;
    reason: string | null;
    createdAt: string;
    admin: { id: string; name: string; email: string };
  }[];
}

const statusStyles: Record<string, string> = {
  PENDING_REVIEW: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  PUBLISHED: 'bg-green-500/20 text-green-400 border-green-500/30',
  DRAFT: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  REMOVED: 'bg-red-500/20 text-red-400 border-red-500/30',
  REJECTED: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
};

const statusLabels: Record<string, string> = {
  PENDING_REVIEW: '待審核',
  PUBLISHED: '已發布',
  DRAFT: '草稿',
  REMOVED: '已下架',
  REJECTED: '已拒絕',
};

const propertyTypeLabels: Record<string, string> = {
  WHOLE_FLOOR: '整層',
  STUDIO: '套房',
  SUITE: '雅房',
  ROOM: '房間',
  PARKING: '車位',
};

const actionLabels: Record<string, string> = {
  LISTING_PUBLISH: '發布房源',
  LISTING_UNPUBLISH: '下架房源',
  LISTING_REJECT: '拒絕房源',
  LISTING_REMOVE: '移除房源',
};

export default function AdminListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [actionModal, setActionModal] = useState<'publish' | 'unpublish' | 'reject' | null>(null);
  const [reason, setReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await api.get(`/api/admin/listings/${params.id}`);
        setData(res.data.data);
      } catch (error) {
        console.error('Failed to fetch listing:', error);
        toast.error('載入房源失敗');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.id]);

  const handleAction = async () => {
    if (!actionModal || !data) return;

    if (actionModal === 'reject' && !reason.trim()) {
      toast.error('請填寫拒絕原因');
      return;
    }

    setProcessing(true);
    try {
      await api.post(`/api/admin/listings/${data.listing.id}/${actionModal}`, {
        reason: reason.trim() || undefined,
      });

      toast.success(
        actionModal === 'publish'
          ? '房源已發布'
          : actionModal === 'unpublish'
          ? '房源已下架'
          : '房源已拒絕'
      );

      // Refresh data
      const res = await api.get(`/admin/listings/${params.id}`);
      setData(res.data.data);
      setActionModal(null);
      setReason('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || '操作失敗');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-400">房源不存在</p>
        <Link href="/admin/listings" className="text-amber-400 hover:underline mt-4 inline-block">
          返回列表
        </Link>
      </div>
    );
  }

  const { listing, auditLogs } = data;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 text-white" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">{listing.title}</h1>
            <p className="text-sm text-slate-400">ID: {listing.id}</p>
          </div>
        </div>
        <span
          className={clsx(
            'px-4 py-2 rounded-lg border text-sm font-medium',
            statusStyles[listing.status]
          )}
        >
          {statusLabels[listing.status]}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          <div className="bg-slate-800 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-4">房源圖片</h3>
            {listing.images.length > 0 ? (
              <>
                <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                  <Image
                    src={listing.images[selectedImage]?.url || ''}
                    alt={listing.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {listing.images.map((image, idx) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImage(idx)}
                      className={clsx(
                        'flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors',
                        selectedImage === idx ? 'border-amber-500' : 'border-transparent'
                      )}
                    >
                      <Image
                        src={image.url}
                        alt={`圖片 ${idx + 1}`}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="aspect-video bg-slate-700 rounded-lg flex items-center justify-center">
                <p className="text-slate-400">無圖片</p>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">房源描述</h3>
            <p className="text-slate-300 whitespace-pre-wrap">
              {listing.description || '無描述'}
            </p>
          </div>

          {/* Details */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">房源資訊</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <CurrencyDollarIcon className="h-5 w-5 text-amber-400" />
                <div>
                  <p className="text-xs text-slate-400">價格</p>
                  <p className="text-white font-medium">
                    {formatPrice(listing.price, listing.currency)}/月
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <HomeIcon className="h-5 w-5 text-amber-400" />
                <div>
                  <p className="text-xs text-slate-400">類型</p>
                  <p className="text-white font-medium">
                    {propertyTypeLabels[listing.propertyType]}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="h-5 w-5 text-amber-400 text-center">🛏️</span>
                <div>
                  <p className="text-xs text-slate-400">臥室</p>
                  <p className="text-white font-medium">{listing.beds} 間</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="h-5 w-5 text-amber-400 text-center">🚿</span>
                <div>
                  <p className="text-xs text-slate-400">衛浴</p>
                  <p className="text-white font-medium">{listing.baths} 間</p>
                </div>
              </div>
              {listing.area && (
                <div className="flex items-center gap-3">
                  <span className="h-5 w-5 text-amber-400 text-center">📐</span>
                  <div>
                    <p className="text-xs text-slate-400">面積</p>
                    <p className="text-white font-medium">{listing.area} m²</p>
                  </div>
                </div>
              )}
              {listing.address && (
                <div className="flex items-center gap-3 col-span-2">
                  <MapPinIcon className="h-5 w-5 text-amber-400" />
                  <div>
                    <p className="text-xs text-slate-400">地址</p>
                    <p className="text-white font-medium">{listing.address}</p>
                  </div>
                </div>
              )}
            </div>

            {listing.amenities && (
              (() => {
                const amenitiesArr = typeof listing.amenities === 'string' 
                  ? JSON.parse(listing.amenities) 
                  : listing.amenities;
                return amenitiesArr.length > 0 ? (
                  <div className="mt-6">
                    <p className="text-xs text-slate-400 mb-2">設施</p>
                    <div className="flex flex-wrap gap-2">
                      {amenitiesArr.map((amenity: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()
            )}
          </div>

          {/* Audit Logs */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">審核記錄</h3>
            {auditLogs.length > 0 ? (
              <div className="space-y-3">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg"
                  >
                    <ClockIcon className="h-5 w-5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-white">
                        <span className="font-medium">{log.admin.name}</span>
                        {' '}執行了{' '}
                        <span className="text-amber-400">
                          {actionLabels[log.action] || log.action}
                        </span>
                      </p>
                      {log.reason && (
                        <p className="text-xs text-slate-400 mt-1">原因：{log.reason}</p>
                      )}
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(log.createdAt).toLocaleString('zh-TW')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-sm">尚無審核記錄</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">快速操作</h3>
            <div className="space-y-3">
              {listing.status !== 'PUBLISHED' && (
                <button
                  onClick={() => setActionModal('publish')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                >
                  <CheckCircleIcon className="h-5 w-5" />
                  發布房源
                </button>
              )}
              {listing.status === 'PUBLISHED' && (
                <button
                  onClick={() => setActionModal('unpublish')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                >
                  <XCircleIcon className="h-5 w-5" />
                  下架房源
                </button>
              )}
              {listing.status === 'PENDING_REVIEW' && (
                <button
                  onClick={() => setActionModal('reject')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
                >
                  <XCircleIcon className="h-5 w-5" />
                  拒絕房源
                </button>
              )}
            </div>
          </div>

          {/* Owner Info */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">房東資訊</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-full bg-amber-500 flex items-center justify-center">
                <UserIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">{listing.user.name}</p>
                {listing.user.isBlocked && (
                  <span className="text-xs text-red-400">已封鎖</span>
                )}
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Email</span>
                <span className="text-white">{listing.user.email}</span>
              </div>
              {listing.user.phone && (
                <div className="flex justify-between">
                  <span className="text-slate-400">電話</span>
                  <span className="text-white">{listing.user.phone}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400">註冊時間</span>
                <span className="text-white">
                  {new Date(listing.user.createdAt).toLocaleDateString('zh-TW')}
                </span>
              </div>
            </div>
            <Link
              href={`/admin/users?search=${encodeURIComponent(listing.user.email)}`}
              className="mt-4 block text-center text-sm text-amber-400 hover:underline"
            >
              查看完整資料 →
            </Link>
          </div>

          {/* Stats */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">統計</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                <p className="text-2xl font-bold text-white">{listing.viewCount}</p>
                <p className="text-xs text-slate-400">瀏覽次數</p>
              </div>
              <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                <p className="text-2xl font-bold text-white">{listing._count.favorites}</p>
                <p className="text-xs text-slate-400">收藏次數</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Modal */}
      {actionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-white mb-4">
              {actionModal === 'publish' && '確認發布房源'}
              {actionModal === 'unpublish' && '確認下架房源'}
              {actionModal === 'reject' && '拒絕房源'}
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {actionModal === 'reject' ? '拒絕原因（必填）' : '備註（選填）'}
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={
                  actionModal === 'reject' ? '請說明拒絕原因...' : '輸入備註...'
                }
                rows={3}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setActionModal(null);
                  setReason('');
                }}
                className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleAction}
                disabled={processing}
                className={clsx(
                  'flex-1 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50',
                  actionModal === 'publish'
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : actionModal === 'unpublish'
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                )}
              >
                {processing ? '處理中...' : '確認'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

