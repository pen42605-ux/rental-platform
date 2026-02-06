'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  CreditCardIcon,
  BuildingLibraryIcon,
  DevicePhoneMobileIcon,
  BanknotesIcon,
  CheckCircleIcon,
  XMarkIcon,
  LockClosedIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { paymentApi, Order, Payment } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';

export const dynamic = 'force-dynamic';

// 支付方式配置
const PAYMENT_METHODS = [
  {
    id: 'CREDIT_CARD',
    name: '信用卡',
    icon: CreditCardIcon,
    description: 'Visa、Mastercard、JCB',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'LINE_PAY',
    name: 'LINE Pay',
    icon: DevicePhoneMobileIcon,
    description: '使用 LINE Pay 快速付款',
    color: 'from-green-500 to-green-600',
  },
  {
    id: 'ATM',
    name: 'ATM 轉帳',
    icon: BuildingLibraryIcon,
    description: '虛擬帳號轉帳',
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 'CVS',
    name: '超商代碼',
    icon: BanknotesIcon,
    description: '7-11、全家、萊爾富、OK',
    color: 'from-orange-500 to-orange-600',
  },
];

function CheckoutPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuthStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const orderId = searchParams.get('orderId');

  // 載入訂單
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
      return;
    }

    if (!orderId) {
      toast.error('缺少訂單編號');
      router.push('/pricing');
      return;
    }

    loadOrder();
  }, [orderId, isAuthenticated]);

  const loadOrder = async () => {
    try {
      const response = await paymentApi.getOrder(orderId!);
      setOrder(response.data.data);
      
      // 如果有未完成的付款，載入付款資訊
      if (response.data.data.payments && response.data.data.payments.length > 0) {
        const latestPayment = response.data.data.payments[0];
        if (latestPayment.status === 'PENDING') {
          setPayment(latestPayment);
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || '載入訂單失敗');
      router.push('/pricing');
    } finally {
      setLoading(false);
    }
  };

  // 創建付款
  const handleCreatePayment = async () => {
    if (!selectedMethod) {
      toast.error('請選擇支付方式');
      return;
    }

    if (!order) return;

    setProcessing(true);
    try {
      const response = await paymentApi.createPayment({
        orderId: order.id,
        paymentMethod: selectedMethod as any,
      });

      const paymentData = response.data.data;
      setPayment(paymentData);

      // 如果有付款連結，跳轉到支付頁面
      if (paymentData.paymentUrl) {
        if (selectedMethod === 'CREDIT_CARD' || selectedMethod === 'LINE_PAY') {
          // 信用卡和 LINE Pay 直接跳轉
          window.location.href = paymentData.paymentUrl;
        } else {
          // ATM 和 CVS 顯示付款資訊
          toast.success('付款資訊已生成，請查看下方付款說明');
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || '創建付款失敗');
    } finally {
      setProcessing(false);
    }
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

  const totalAmount = order.totalAmount / 100; // 轉換為元

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">
            安全付款
          </h1>
          <p className="text-blue-600">訂單編號：{order.orderNumber}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左側：訂單詳情 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 訂單摘要 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-200"
            >
              <h2 className="text-xl font-bold text-blue-900 mb-4">訂單摘要</h2>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-3 border-b border-gray-100">
                    <div>
                      <p className="font-semibold text-gray-900">{item.productName}</p>
                      <p className="text-sm text-gray-500">數量：{item.quantity}</p>
                    </div>
                    <p className="font-bold text-blue-600">
                      ${(item.totalPrice / 100).toLocaleString()}
                    </p>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-4 border-t-2 border-blue-200">
                  <p className="text-lg font-bold text-gray-900">總計</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ${totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* 支付方式選擇 */}
            {!payment && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-200"
              >
                <h2 className="text-xl font-bold text-blue-900 mb-4">選擇支付方式</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {PAYMENT_METHODS.map((method) => {
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.id}
                        onClick={() => setSelectedMethod(method.id)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          selectedMethod === method.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${method.color} flex items-center justify-center`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-left flex-1">
                            <p className="font-semibold text-gray-900">{method.name}</p>
                            <p className="text-xs text-gray-500">{method.description}</p>
                          </div>
                          {selectedMethod === method.id && (
                            <CheckCircleIcon className="w-6 h-6 text-blue-600" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={handleCreatePayment}
                  disabled={processing || !selectedMethod}
                  className="w-full mt-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-4 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>處理中...</span>
                    </>
                  ) : (
                    <>
                      <LockClosedIcon className="w-5 h-5" />
                      <span>確認付款</span>
                    </>
                  )}
                </button>
              </motion.div>
            )}

            {/* 付款資訊（ATM/CVS） */}
            {payment && (payment.paymentMethod === 'ATM' || payment.paymentMethod === 'CVS') && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl shadow-xl p-6 border-2 border-blue-300"
              >
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-blue-900">付款資訊</h2>
                </div>

                {payment.paymentMethod === 'ATM' && payment.accountNumber && (
                  <div className="space-y-4">
                    <div className="bg-white rounded-xl p-4 border-2 border-blue-200">
                      <p className="text-sm text-gray-600 mb-1">銀行代碼</p>
                      <p className="text-2xl font-bold text-blue-600">{payment.bankCode}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border-2 border-blue-200">
                      <p className="text-sm text-gray-600 mb-1">虛擬帳號</p>
                      <p className="text-2xl font-bold text-blue-600 font-mono">
                        {payment.accountNumber}
                      </p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(payment.accountNumber!);
                          toast.success('已複製到剪貼簿');
                        }}
                        className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                      >
                        複製帳號
                      </button>
                    </div>
                    {payment.expireDate && (
                      <div className="bg-amber-50 rounded-xl p-4 border-2 border-amber-200">
                        <p className="text-sm text-amber-800">
                          <span className="font-semibold">付款截止：</span>
                          {new Date(payment.expireDate).toLocaleString('zh-TW')}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {payment.paymentMethod === 'CVS' && payment.accountNumber && (
                  <div className="space-y-4">
                    <div className="bg-white rounded-xl p-4 border-2 border-blue-200">
                      <p className="text-sm text-gray-600 mb-1">超商代碼</p>
                      <p className="text-2xl font-bold text-blue-600 font-mono">
                        {payment.accountNumber}
                      </p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(payment.accountNumber!);
                          toast.success('已複製到剪貼簿');
                        }}
                        className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                      >
                        複製代碼
                      </button>
                    </div>
                    {payment.expireDate && (
                      <div className="bg-amber-50 rounded-xl p-4 border-2 border-amber-200">
                        <p className="text-sm text-amber-800">
                          <span className="font-semibold">付款截止：</span>
                          {new Date(payment.expireDate).toLocaleString('zh-TW')}
                        </p>
                      </div>
                    )}
                    <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                      <p className="text-sm text-blue-800">
                        請至 7-11、全家、萊爾富、OK 超商，使用多媒體機台輸入代碼完成付款
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* 右側：安全提示 */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-200"
            >
              <h3 className="text-lg font-bold text-blue-900 mb-4">安全保證</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <ShieldCheckIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">SSL 加密保護</p>
                    <p className="text-sm text-gray-600">所有交易均經過加密處理</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <LockClosedIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">安全付款</p>
                    <p className="text-sm text-gray-600">我們不會儲存您的卡片資訊</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">24小時客服</p>
                    <p className="text-sm text-gray-600">如有問題隨時聯繫我們</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-xl p-6 text-white"
            >
              <h3 className="text-lg font-bold mb-2">需要幫助？</h3>
              <p className="text-blue-100 text-sm mb-4">
                如果您在付款過程中遇到任何問題，請聯繫我們的客服團隊
              </p>
              <a
                href="/contact"
                className="inline-block bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors text-sm"
              >
                聯絡客服
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-gray-600">
          載入中...
        </div>
      }
    >
      <CheckoutPageInner />
    </Suspense>
  );
}



