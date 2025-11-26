'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  ArrowPathIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import clsx from 'clsx';
import toast from 'react-hot-toast';

interface Listing {
  id: string;
  title: string;
  price: number;
  currency: string;
  propertyType: string;
  status: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    isBlocked: boolean;
  };
  images: { url: string }[];
  _count: { favorites: number };
}

const statusOptions = [
  { value: '', label: '全部狀態' },
  { value: 'PENDING_REVIEW', label: '待審核' },
  { value: 'PUBLISHED', label: '已發布' },
  { value: 'DRAFT', label: '草稿' },
  { value: 'REMOVED', label: '已下架' },
  { value: 'REJECTED', label: '已拒絕' },
];

const statusStyles: Record<string, string> = {
  PENDING_REVIEW: 'bg-yellow-500/20 text-yellow-400',
  PUBLISHED: 'bg-green-500/20 text-green-400',
  DRAFT: 'bg-slate-500/20 text-slate-400',
  REMOVED: 'bg-red-500/20 text-red-400',
  REJECTED: 'bg-orange-500/20 text-orange-400',
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

export default function AdminListingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 0 });
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || '');
  const [actionModal, setActionModal] = useState<{
    type: 'publish' | 'unpublish' | 'reject' | null;
    listing: Listing | null;
  }>({ type: null, listing: null });
  const [reason, setReason] = useState('');
  const [processing, setProcessing] = useState(false);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page: pagination.page, limit: 20 };
      if (selectedStatus) params.status = selectedStatus;

      const res = await api.get('/api/admin/listings', { params });
      setListings(res.data.data.listings);
      setPagination(res.data.data.pagination);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
      toast.error('載入房源失敗');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, selectedStatus]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    setPagination((prev) => ({ ...prev, page: 1 }));
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    router.push(`/admin/listings${params.toString() ? '?' + params.toString() : ''}`);
  };

  const handleAction = async () => {
    if (!actionModal.listing || !actionModal.type) return;

    if (actionModal.type === 'reject' && !reason.trim()) {
      toast.error('請填寫拒絕原因');
      return;
    }

    setProcessing(true);
    try {
      const endpoint = `/api/admin/listings/${actionModal.listing.id}/${actionModal.type}`;
      await api.post(endpoint, { reason: reason.trim() || undefined });

      toast.success(
        actionModal.type === 'publish'
          ? '房源已發布'
          : actionModal.type === 'unpublish'
          ? '房源已下架'
          : '房源已拒絕'
      );

      setActionModal({ type: null, listing: null });
      setReason('');
      fetchListings();
    } catch (error: any) {
      toast.error(error.response?.data?.message || '操作失敗');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">房源管理</h1>
          <p className="mt-1 text-sm text-slate-400">
            管理所有房源的審核狀態
          </p>
        </div>
        <button
          onClick={() => fetchListings()}
          className="flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
        >
          <ArrowPathIcon className="h-5 w-5 mr-2" />
          重新整理
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex items-center gap-4">
        <FunnelIcon className="h-5 w-5 text-slate-400" />
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleStatusFilter(option.value)}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                selectedStatus === option.value
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p>沒有找到房源</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    房源
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    房東
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    價格
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    類型
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    狀態
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    建立時間
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {listings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-12 flex-shrink-0">
                          {listing.images[0]?.url ? (
                            <Image
                              src={listing.images[0].url}
                              alt={listing.title}
                              width={48}
                              height={48}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-slate-600 flex items-center justify-center">
                              <span className="text-slate-400 text-xs">無圖</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white max-w-xs truncate">
                            {listing.title}
                          </div>
                          <div className="text-xs text-slate-400">
                            {listing._count.favorites} 收藏
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{listing.user.name}</div>
                      <div className="text-xs text-slate-400">{listing.user.email}</div>
                      {listing.user.isBlocked && (
                        <span className="inline-flex text-xs text-red-400">已封鎖</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {formatPrice(listing.price, listing.currency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      {propertyTypeLabels[listing.propertyType] || listing.propertyType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={clsx(
                          'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                          statusStyles[listing.status] || 'bg-slate-500/20 text-slate-400'
                        )}
                      >
                        {statusLabels[listing.status] || listing.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                      {new Date(listing.createdAt).toLocaleDateString('zh-TW')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => router.push(`/admin/listings/${listing.id}`)}
                          className="p-2 text-slate-400 hover:text-white transition-colors"
                          title="查看詳情"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        {listing.status !== 'PUBLISHED' && (
                          <button
                            onClick={() => setActionModal({ type: 'publish', listing })}
                            className="p-2 text-green-400 hover:text-green-300 transition-colors"
                            title="發布"
                          >
                            <CheckCircleIcon className="h-5 w-5" />
                          </button>
                        )}
                        {listing.status === 'PUBLISHED' && (
                          <button
                            onClick={() => setActionModal({ type: 'unpublish', listing })}
                            className="p-2 text-red-400 hover:text-red-300 transition-colors"
                            title="下架"
                          >
                            <XCircleIcon className="h-5 w-5" />
                          </button>
                        )}
                        {listing.status === 'PENDING_REVIEW' && (
                          <button
                            onClick={() => setActionModal({ type: 'reject', listing })}
                            className="p-2 text-orange-400 hover:text-orange-300 transition-colors"
                            title="拒絕"
                          >
                            <XCircleIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-700">
            <p className="text-sm text-slate-400">
              共 {pagination.total} 筆資料
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-4 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
              >
                上一頁
              </button>
              <span className="px-4 py-2 text-slate-400">
                {pagination.page} / {pagination.totalPages}
              </span>
              <button
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.totalPages}
                className="px-4 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
              >
                下一頁
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action Modal */}
      {actionModal.type && actionModal.listing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-white mb-4">
              {actionModal.type === 'publish' && '確認發布房源'}
              {actionModal.type === 'unpublish' && '確認下架房源'}
              {actionModal.type === 'reject' && '拒絕房源'}
            </h3>
            <p className="text-slate-400 mb-4">
              房源：{actionModal.listing.title}
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {actionModal.type === 'reject' ? '拒絕原因（必填）' : '備註（選填）'}
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={
                  actionModal.type === 'reject'
                    ? '請說明拒絕原因...'
                    : '輸入備註...'
                }
                rows={3}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setActionModal({ type: null, listing: null });
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
                  actionModal.type === 'publish'
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : actionModal.type === 'unpublish'
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

