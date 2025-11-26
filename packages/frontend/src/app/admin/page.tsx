'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BuildingOfficeIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  UsersIcon,
  NoSymbolIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { api } from '@/lib/api';

interface AdminStats {
  totalListings: number;
  pendingReview: number;
  published: number;
  removed: number;
  totalUsers: number;
  blockedUsers: number;
  todayAuditActions: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/api/admin/stats');
        setStats(res.data.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  const statCards = [
    {
      name: '待審核房源',
      value: stats?.pendingReview || 0,
      icon: ClockIcon,
      color: 'bg-yellow-500/20 text-yellow-400',
      href: '/admin/listings?status=PENDING_REVIEW',
    },
    {
      name: '已發布房源',
      value: stats?.published || 0,
      icon: CheckCircleIcon,
      color: 'bg-green-500/20 text-green-400',
      href: '/admin/listings?status=PUBLISHED',
    },
    {
      name: '已下架房源',
      value: stats?.removed || 0,
      icon: XCircleIcon,
      color: 'bg-red-500/20 text-red-400',
      href: '/admin/listings?status=REMOVED',
    },
    {
      name: '總房源數',
      value: stats?.totalListings || 0,
      icon: BuildingOfficeIcon,
      color: 'bg-blue-500/20 text-blue-400',
      href: '/admin/listings',
    },
    {
      name: '總使用者',
      value: stats?.totalUsers || 0,
      icon: UsersIcon,
      color: 'bg-purple-500/20 text-purple-400',
      href: '/admin/users',
    },
    {
      name: '已封鎖使用者',
      value: stats?.blockedUsers || 0,
      icon: NoSymbolIcon,
      color: 'bg-orange-500/20 text-orange-400',
      href: '/admin/users?isBlocked=true',
    },
    {
      name: '今日審核操作',
      value: stats?.todayAuditActions || 0,
      icon: DocumentTextIcon,
      color: 'bg-cyan-500/20 text-cyan-400',
      href: '/admin/audit',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">管理員儀表板</h1>
        <p className="mt-1 text-sm text-slate-400">
          歡迎回來！以下是平台的即時統計資訊。
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="relative overflow-hidden rounded-xl bg-slate-800 p-6 hover:bg-slate-700/80 transition-colors group"
          >
            <div className="flex items-center">
              <div className={`rounded-lg p-3 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-bold text-white">{stat.value}</p>
            <p className="mt-1 text-sm text-slate-400">{stat.name}</p>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-slate-400">→</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-white mb-4">快速操作</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            href="/admin/listings?status=PENDING_REVIEW"
            className="flex items-center justify-center px-6 py-4 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-xl transition-colors"
          >
            <ClockIcon className="h-5 w-5 mr-2" />
            審核待審房源
          </Link>
          <Link
            href="/admin/users?isBlocked=true"
            className="flex items-center justify-center px-6 py-4 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-colors"
          >
            <NoSymbolIcon className="h-5 w-5 mr-2" />
            管理封鎖使用者
          </Link>
          <Link
            href="/admin/audit"
            className="flex items-center justify-center px-6 py-4 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-xl transition-colors"
          >
            <DocumentTextIcon className="h-5 w-5 mr-2" />
            查看審核日誌
          </Link>
        </div>
      </div>
    </div>
  );
}

