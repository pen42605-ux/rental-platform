'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  MagnifyingGlassIcon,
  NoSymbolIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import { api } from '@/lib/api';
import clsx from 'clsx';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: string;
  isBlocked: boolean;
  blockedAt: string | null;
  blockedReason: string | null;
  createdAt: string;
  _count: { listings: number };
}

const roleLabels: Record<string, string> = {
  USER: '房客/買家',
  LANDLORD: '屋主/代理人',
  AGENT: '營業員/經紀人',
  AGENCY: '仲介公司',
  DEVELOPER: '建商/代銷',
  ADMIN: '管理員',
};

const roleStyles: Record<string, string> = {
  USER: 'bg-slate-500/20 text-slate-400',
  LANDLORD: 'bg-blue-500/20 text-blue-400',
  AGENT: 'bg-green-500/20 text-green-400',
  AGENCY: 'bg-cyan-500/20 text-cyan-400',
  DEVELOPER: 'bg-orange-500/20 text-orange-400',
  ADMIN: 'bg-purple-500/20 text-purple-400',
};

function AdminUsersPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 0 });
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [filterBlocked, setFilterBlocked] = useState<boolean | undefined>(
    searchParams.get('isBlocked') === 'true' ? true : undefined
  );
  const [actionModal, setActionModal] = useState<{
    type: 'block' | 'unblock' | null;
    user: User | null;
  }>({ type: null, user: null });
  const [reason, setReason] = useState('');
  const [processing, setProcessing] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page: pagination.page, limit: 20 };
      if (search) params.search = search;
      if (filterBlocked !== undefined) params.isBlocked = filterBlocked;

      const res = await api.get('/api/admin/users', { params });
      setUsers(res.data.data.users);
      setPagination(res.data.data.pagination);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('載入使用者失敗');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, search, filterBlocked]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (filterBlocked !== undefined) params.set('isBlocked', String(filterBlocked));
    router.push(`/admin/users${params.toString() ? '?' + params.toString() : ''}`);
  };

  const handleAction = async () => {
    if (!actionModal.user || !actionModal.type) return;

    setProcessing(true);
    try {
      const endpoint = `/api/admin/users/${actionModal.user.id}/${actionModal.type}`;
      await api.post(endpoint, { reason: reason.trim() || undefined });

      toast.success(
        actionModal.type === 'block' ? '使用者已封鎖' : '使用者已解除封鎖'
      );

      setActionModal({ type: null, user: null });
      setReason('');
      fetchUsers();
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
          <h1 className="text-2xl font-bold text-white">使用者管理</h1>
          <p className="mt-1 text-sm text-slate-400">
            管理平台使用者與封鎖狀態
          </p>
        </div>
        <button
          onClick={() => fetchUsers()}
          className="flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
        >
          <ArrowPathIcon className="h-5 w-5 mr-2" />
          重新整理
        </button>
      </div>

      {/* Search & Filters */}
      <div className="mb-6 space-y-4">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜尋使用者名稱或 Email..."
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors"
          >
            搜尋
          </button>
        </form>

        <div className="flex items-center gap-4">
          <FunnelIcon className="h-5 w-5 text-slate-400" />
          <div className="flex gap-2">
            <button
              onClick={() => {
                setFilterBlocked(undefined);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                filterBlocked === undefined
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              )}
            >
              全部
            </button>
            <button
              onClick={() => {
                setFilterBlocked(false);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                filterBlocked === false
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              )}
            >
              正常
            </button>
            <button
              onClick={() => {
                setFilterBlocked(true);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                filterBlocked === true
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              )}
            >
              已封鎖
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p>沒有找到使用者</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    使用者
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    電話
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    角色
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    房源數
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    狀態
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    註冊時間
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-amber-500 flex items-center justify-center">
                            <span className="text-white font-medium">
                              {user.name.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{user.name}</div>
                          <div className="text-xs text-slate-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      {user.phone || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={clsx(
                          'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                          roleStyles[user.role]
                        )}
                      >
                        {roleLabels[user.role] || user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {user._count.listings}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.isBlocked ? (
                        <div>
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-500/20 text-red-400">
                            已封鎖
                          </span>
                          {user.blockedReason && (
                            <p className="text-xs text-slate-400 mt-1 max-w-xs truncate">
                              {user.blockedReason}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-400">
                          正常
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                      {new Date(user.createdAt).toLocaleDateString('zh-TW')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {user.role !== 'ADMIN' && (
                        <>
                          {user.isBlocked ? (
                            <button
                              onClick={() => setActionModal({ type: 'unblock', user })}
                              className="inline-flex items-center px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors"
                            >
                              <CheckCircleIcon className="h-4 w-4 mr-1" />
                              解除封鎖
                            </button>
                          ) : (
                            <button
                              onClick={() => setActionModal({ type: 'block', user })}
                              className="inline-flex items-center px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                            >
                              <NoSymbolIcon className="h-4 w-4 mr-1" />
                              封鎖
                            </button>
                          )}
                        </>
                      )}
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
              共 {pagination.total} 位使用者
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
      {actionModal.type && actionModal.user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-white mb-4">
              {actionModal.type === 'block' ? '封鎖使用者' : '解除封鎖使用者'}
            </h3>
            <p className="text-slate-400 mb-4">
              使用者：{actionModal.user.name} ({actionModal.user.email})
            </p>

            {actionModal.type === 'block' && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
                <p className="text-sm text-red-400">
                  ⚠️ 封鎖使用者將會同時下架其所有已發布的房源
                </p>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                原因（選填）
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="輸入原因..."
                rows={3}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setActionModal({ type: null, user: null });
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
                  actionModal.type === 'block'
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
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

export default function AdminUsersPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="text-slate-300">載入中...</div>
        </div>
      }
    >
      <AdminUsersPageInner />
    </Suspense>
  );
}

