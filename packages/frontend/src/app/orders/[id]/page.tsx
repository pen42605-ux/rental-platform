'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  BanknotesIcon,
  ArrowLeftIcon,
  CreditCardIcon,
  BuildingLibraryIcon,
  DevicePhoneMobileIcon,
} from '@heroicons/react/24/outline';
import { paymentApi, Order, Payment } from '@/lib/api';
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

const PAYMENT_METHOD_CONFIG: Record<string, { label: string; icon: any }> = {
  CREDIT_CARD: { label: '信用卡', icon: CreditCardIcon },
  ATM: { label: 'ATM 轉帳', icon: BuildingLibraryIcon },
  CVS: { label: '超商代碼', icon: BanknotesIcon },
  WEBATM: { label: '網路 ATM', icon: BuildingLibraryIcon },
  LINE_PAY: { label: 'LINE Pay', icon: DevicePhoneMobileIcon },
  APPLE_PAY: { label: 'Apple Pay', icon: DevicePhoneMobileIcon },
  GOOGLE_PAY: { label: 'Google Pay', icon: DevicePhoneMobileIcon },
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/orders');
      return;
    }
    loadOrder();
  }, [params.id, isAuthenticated]);

  const loadOrder = async () => {
    try {
      const response = await paymentApi.getOrder(params.id as string);
      setOrder(response.data.data);
    } catch (error: any) {
      toast.error(error.response?.data?.error || '載入訂單失敗');
      router.push('/orders');
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

  if (!order) {
    return null;
  }

  const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
  const StatusIcon = statusConfig.icon;
  const latestPayment = order.payments?.[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>返回訂單列表</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">
            訂單詳情
          </h1>
          <p className="text-blue-600">訂單編號：{order.orderNumber}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左側：訂單資訊 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 訂單狀態 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-200"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-blue-900">訂單狀態</h2>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold border flex items-center gap-2 ${statusConfig.color}`}
                >
                  <StatusIcon className="w-5 h-5" />
                  {statusConfig.label}
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">建立時間</span>
                  <span className="font-semibold text-gray-900">{formatDate(order.createdAt)}</span>
                </div>
                {order.expiresAt && order.status === 'PENDING' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">到期時間</span>
                    <span className="font-semibold text-amber-600">{formatDate(order.expiresAt)}</span>
                  </div>
                )}
                {order.paidAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">付款時間</span>
                    <span className="font-semibold text-gray-900">{formatDate(order.paidAt)}</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* 訂單項目 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-200"
            >
              <h2 className="text-xl font-bold text-blue-900 mb-4">訂單項目</h2>
              <div className="space-y-4">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-start py-4 border-b border-gray-100 last:border-0">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 mb-1">{item.productName}</p>
                      <div className="text-sm text-gray-500 space-y-1">
                        <p>數量：{item.quantity}</p>
                        <p>單價：{formatPrice(item.unitPrice)}</p>
                        {item.duration && <p>刊登時間：{item.duration} 天</p>}
                      </div>
                    </div>
                    <p className="font-bold text-blue-600 text-lg">
                      {formatPrice(item.totalPrice)}
                    </p>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-4 border-t-2 border-blue-200">
                  <p className="text-lg font-bold text-gray-900">總計</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatPrice(order.totalAmount)}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* 付款記錄 */}
            {order.payments && order.payments.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-200"
              >
                <h2 className="text-xl font-bold text-blue-900 mb-4">付款記錄</h2>
                <div className="space-y-4">
                  {order.payments.map((payment: Payment) => {
                    const methodConfig = PAYMENT_METHOD_CONFIG[payment.paymentMethod || ''] || {
                      label: payment.paymentMethod,
                      icon: BanknotesIcon,
                    };
                    const MethodIcon = methodConfig.icon;

                    return (
                      <div
                        key={payment.id}
                        className="p-4 bg-gray-50 rounded-xl border border-gray-200"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <MethodIcon className="w-5 h-5 text-blue-600" />
                            <span className="font-semibold text-gray-900">
                              {methodConfig.label}
                            </span>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              payment.status === 'SUCCESS'
                                ? 'bg-green-100 text-green-700'
                                : payment.status === 'FAILED'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {payment.status === 'SUCCESS'
                              ? '成功'
                              : payment.status === 'FAILED'
                              ? '失敗'
                              : '處理中'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>付款編號：{payment.paymentNumber}</p>
                          {payment.transactionId && (
                            <p>交易編號：{payment.transactionId}</p>
                          )}
                          {payment.accountNumber && (
                            <div className="mt-2 p-2 bg-white rounded border border-gray-300">
                              <p className="text-xs text-gray-500 mb-1">
                                {payment.paymentMethod === 'ATM' ? '虛擬帳號' : '超商代碼'}
                              </p>
                              <p className="font-mono font-bold text-blue-600">
                                {payment.accountNumber}
                              </p>
                            </div>
                          )}
                          {payment.expireDate && (
                            <p className="text-amber-600">
                              付款截止：{formatDate(payment.expireDate)}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* 操作按鈕 */}
            {order.status === 'PENDING' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex gap-4"
              >
                <Link
                  href={`/checkout?orderId=${order.id}`}
                  className="flex-1 btn-primary text-center"
                >
                  前往付款
                </Link>
              </motion.div>
            )}
          </div>

          {/* 右側：訂單摘要 */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-200 sticky top-4"
            >
              <h3 className="text-lg font-bold text-blue-900 mb-4">訂單摘要</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">訂單編號</span>
                  <span className="font-semibold text-gray-900">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">訂單狀態</span>
                  <span className={`font-semibold ${statusConfig.color.split(' ')[0]}`}>
                    {statusConfig.label}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">項目數量</span>
                  <span className="font-semibold text-gray-900">{order.items.length}</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-gray-900">總金額</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}



