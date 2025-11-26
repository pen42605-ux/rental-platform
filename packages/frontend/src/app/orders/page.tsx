'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';
import { paymentApi, Order } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';
import Link from 'next/link';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  PENDING: {
    label: '待付款',
    color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    icon: ClockIcon,
  },
  PAID: {
    label: '已付款',
    color: 'text-green-600 bg-green-50 border-green-200',
    icon: CheckCircleIcon,
  },
  CANCELLED: {
    label: '已取消',
    color: 'text-gray-600 bg-gray-50 border-gray-200',
    icon: XCircleIcon,
  },
  REFUNDED: {
    label: '已退款',
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    icon: BanknotesIcon,
  },
  EXPIRED: {
    label: '已過期',
    color: 'text-red-600 bg-red-50 border-red-200',
    icon: XCircleIcon,
  },
};

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/orders');
      return;
    }
    loadOrders();
  }, [isAuthenticated, pagination.page, selectedStatus]);

  const loadOrders = async () => {
    try {
      const response = await paymentApi.getOrders({
        page: pagination.page,
        limit: pagination.limit,
        status: selectedStatus || undefined,
      });
      setOrders(response.data.data.items);
      setPagination(response.data.pagination);
    } catch (error: any) {
      toast.error(error.response?.data?.error || '載入訂單失敗');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (amount: number) => {
    return `$${(amount / 100).toLocaleString()}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('zh-TW');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">我的訂單</h1>
          <p className="text-blue-600">查看您的所有訂單和付款記錄</p>
        </div>

        {/* 狀態篩選 */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedStatus('')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedStatus === ''
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            全部
          </button>
          {Object.entries(STATUS_CONFIG).map(([status, config]) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {config.label}
            </button>
          ))}
        </div>

        {/* 訂單列表 */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border-2 border-blue-200">
            <BanknotesIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">尚無訂單</h3>
            <p className="text-gray-600 mb-6">您還沒有任何訂單記錄</p>
            <Link href="/pricing" className="btn-primary">
              前往購買方案
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => {
              const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
              const StatusIcon = statusConfig.icon;

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-200 hover:border-blue-400 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-bold text-gray-900">
                          訂單編號：{order.orderNumber}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.color} flex items-center gap-1`}
                        >
                          <StatusIcon className="w-4 h-4" />
                          {statusConfig.label}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between text-sm">
                            <span className="text-gray-700">
                              {item.productName} × {item.quantity}
                            </span>
                            <span className="font-semibold text-gray-900">
                              {formatPrice(item.totalPrice)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>建立時間：{formatDate(order.createdAt)}</span>
                        {order.expiresAt && order.status === 'PENDING' && (
                          <span className="text-amber-600">
                            到期時間：{formatDate(order.expiresAt)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <div className="text-right">
                        <p className="text-sm text-gray-500 mb-1">總金額</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {formatPrice(order.totalAmount)}
                        </p>
                      </div>

                      {order.status === 'PENDING' && (
                        <Link
                          href={`/checkout?orderId=${order.id}`}
                          className="btn-primary text-sm px-6 py-2"
                        >
                          前往付款
                        </Link>
                      )}

                      <Link
                        href={`/orders/${order.id}`}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        <EyeIcon className="w-4 h-4" />
                        查看詳情
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* 分頁 */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <button
              onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              disabled={pagination.page === 1}
              className="px-4 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一頁
            </button>
            <span className="px-4 py-2 text-gray-700">
              第 {pagination.page} / {pagination.totalPages} 頁
            </span>
            <button
              onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              disabled={pagination.page >= pagination.totalPages}
              className="px-4 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一頁
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

