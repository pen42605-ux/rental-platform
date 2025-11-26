'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  FunnelIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { api } from '@/lib/api';
import clsx from 'clsx';
import toast from 'react-hot-toast';

interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  reason: string | null;
  previousValue: any;
  newValue: any;
  ipAddress: string | null;
  createdAt: string;
  admin: {
    id: string;
    name: string;
    email: string;
  };
  targetUser: {
    id: string;
    name: string;
    email: string;
  } | null;
}

const actionLabels: Record<string, { label: string; color: string }> = {
  LISTING_PUBLISH: { label: '發布房源', color: 'bg-green-500/20 text-green-400' },
  LISTING_UNPUBLISH: { label: '下架房源', color: 'bg-red-500/20 text-red-400' },
  LISTING_REJECT: { label: '拒絕房源', color: 'bg-orange-500/20 text-orange-400' },
  LISTING_REMOVE: { label: '移除房源', color: 'bg-red-500/20 text-red-400' },
  USER_BLOCK: { label: '封鎖使用者', color: 'bg-red-500/20 text-red-400' },
  USER_UNBLOCK: { label: '解除封鎖', color: 'bg-green-500/20 text-green-400' },
  USER_ROLE_CHANGE: { label: '變更角色', color: 'bg-blue-500/20 text-blue-400' },
};

const entityTypeLabels: Record<string, string> = {
  LISTING: '房源',
  USER: '使用者',
};

const filterOptions = [
  { value: '', label: '全部類型' },
  { value: 'LISTING', label: '房源操作' },
  { value: 'USER', label: '使用者操作' },
];

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 0 });
  const [entityType, setEntityType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page: pagination.page, limit: 30 };
      if (entityType) params.entityType = entityType;
      if (startDate) params.startDate = new Date(startDate).toISOString();
      if (endDate) params.endDate = new Date(endDate + 'T23:59:59').toISOString();

      const res = await api.get('/api/admin/audit-logs', { params });
      setLogs(res.data.data.logs);
      setPagination(res.data.data.pagination);
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
      toast.error('載入審核日誌失敗');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, entityType, startDate, endDate]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">審核日誌</h1>
          <p className="mt-1 text-sm text-slate-400">
            查看所有管理員操作記錄
          </p>
        </div>
        <button
          onClick={() => fetchLogs()}
          className="flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
        >
          <ArrowPathIcon className="h-5 w-5 mr-2" />
          重新整理
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-slate-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <FunnelIcon className="h-5 w-5 text-slate-400" />
          <span className="text-sm font-medium text-slate-300">篩選條件</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">操作類型</label>
            <select
              value={entityType}
              onChange={(e) => {
                setEntityType(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">開始日期</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">結束日期</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setEntityType('');
                setStartDate('');
                setEndDate('');
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="w-full px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
            >
              清除篩選
            </button>
          </div>
        </div>
      </div>

      {/* Logs */}
      <div className="bg-slate-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <DocumentTextIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>沒有找到審核記錄</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-4 hover:bg-slate-700/30 transition-colors cursor-pointer"
                onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className={clsx(
                        'p-2 rounded-lg',
                        log.entityType === 'LISTING'
                          ? 'bg-blue-500/20'
                          : 'bg-purple-500/20'
                      )}
                    >
                      {log.entityType === 'LISTING' ? (
                        <BuildingOfficeIcon className="h-5 w-5 text-blue-400" />
                      ) : (
                        <UserIcon className="h-5 w-5 text-purple-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={clsx(
                            'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                            actionLabels[log.action]?.color || 'bg-slate-500/20 text-slate-400'
                          )}
                        >
                          {actionLabels[log.action]?.label || log.action}
                        </span>
                        <span className="text-xs text-slate-500">
                          {entityTypeLabels[log.entityType]} ID: {log.entityId.slice(0, 8)}...
                        </span>
                      </div>
                      <p className="text-sm text-white mt-1">
                        <span className="text-amber-400">{log.admin.name}</span>
                        {log.targetUser && (
                          <>
                            {' '}對{' '}
                            <span className="text-cyan-400">{log.targetUser.name}</span>
                          </>
                        )}
                        {' '}執行了此操作
                      </p>
                      {log.reason && (
                        <p className="text-xs text-slate-400 mt-1">
                          原因：{log.reason}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-400">
                      {new Date(log.createdAt).toLocaleString('zh-TW')}
                    </p>
                    {log.ipAddress && (
                      <p className="text-xs text-slate-500 mt-1">IP: {log.ipAddress}</p>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedLog === log.id && (
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-400 mb-2">變更前</p>
                        <pre className="bg-slate-900 p-3 rounded-lg text-xs text-slate-300 overflow-auto">
                          {JSON.stringify(log.previousValue, null, 2) || '無'}
                        </pre>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 mb-2">變更後</p>
                        <pre className="bg-slate-900 p-3 rounded-lg text-xs text-slate-300 overflow-auto">
                          {JSON.stringify(log.newValue, null, 2) || '無'}
                        </pre>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-4 text-xs text-slate-400">
                      <span>管理員: {log.admin.email}</span>
                      {log.targetUser && <span>目標使用者: {log.targetUser.email}</span>}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-700">
            <p className="text-sm text-slate-400">
              共 {pagination.total} 筆記錄
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
    </div>
  );
}

