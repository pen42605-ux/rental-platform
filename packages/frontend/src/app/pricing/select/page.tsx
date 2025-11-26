'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  StarIcon,
  FireIcon,
  GiftIcon,
  CheckCircleIcon,
  SparklesIcon,
} from '@heroicons/react/24/solid';
import { paymentApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';
import {
  RESIDENTIAL_LISTING_PLANS,
  RESIDENTIAL_PACKAGES,
  COMMERCIAL_PACKAGES,
  SALE_PLANS,
  SALE_PACKAGES,
  ADDON_COMPUTER,
  ADDON_MOBILE,
} from '@/lib/payment-products';

export default function SelectPlanPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [selectedItems, setSelectedItems] = useState<Array<{ productId: string; quantity: number }>>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'rental' | 'sale' | 'addon'>('rental');

  // 切換選項
  const toggleItem = (productId: string, quantity: number = 1) => {
    setSelectedItems((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.filter((item) => item.productId !== productId);
      }
      return [...prev, { productId, quantity }];
    });
  };

  // 創建訂單
  const handleCreateOrder = async () => {
    if (!isAuthenticated) {
      toast.error('請先登入');
      router.push('/login?redirect=/pricing/select');
      return;
    }

    if (selectedItems.length === 0) {
      toast.error('請至少選擇一個方案');
      return;
    }

    setLoading(true);
    try {
      const response = await paymentApi.createOrder({
        items: selectedItems,
      });

      toast.success('訂單創建成功');
      router.push(`/checkout?orderId=${response.data.data.id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || '創建訂單失敗');
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = selectedItems.reduce((sum, item) => {
    return sum + getProductPrice(item.productId) * item.quantity;
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">
            選擇方案
          </h1>
          <p className="text-blue-600">選擇適合您的刊登方案</p>
        </div>

        {/* 標籤切換 */}
        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('rental')}
            className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
              activeTab === 'rental'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            出租方案
          </button>
          <button
            onClick={() => setActiveTab('sale')}
            className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
              activeTab === 'sale'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            出售方案
          </button>
          <button
            onClick={() => setActiveTab('addon')}
            className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
              activeTab === 'addon'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            加值服務
          </button>
        </div>

        {/* 方案內容 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {activeTab === 'rental' && (
            <>
              <div className="md:col-span-2 lg:col-span-3">
                <h3 className="text-xl font-bold text-blue-900 mb-4">單筆刊登方案</h3>
              </div>
              {Object.values(RESIDENTIAL_LISTING_PLANS).map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  selected={selectedItems.some((item) => item.productId === plan.id)}
                  onToggle={() => toggleItem(plan.id)}
                />
              ))}
              <div className="md:col-span-2 lg:col-span-3 mt-6">
                <h3 className="text-xl font-bold text-blue-900 mb-4">多筆優惠套餐</h3>
              </div>
              {Object.values(RESIDENTIAL_PACKAGES).map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  selected={selectedItems.some((item) => item.productId === pkg.id)}
                  onToggle={() => toggleItem(pkg.id)}
                />
              ))}
            </>
          )}

          {activeTab === 'sale' && (
            <>
              <div className="md:col-span-2 lg:col-span-3">
                <h3 className="text-xl font-bold text-blue-900 mb-4">單筆刊登方案</h3>
              </div>
              {Object.values(SALE_PLANS).map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  selected={selectedItems.some((item) => item.productId === plan.id)}
                  onToggle={() => toggleItem(plan.id)}
                />
              ))}
              <div className="md:col-span-2 lg:col-span-3 mt-6">
                <h3 className="text-xl font-bold text-blue-900 mb-4">多筆優惠套餐</h3>
              </div>
              {Object.values(SALE_PACKAGES).map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  selected={selectedItems.some((item) => item.productId === pkg.id)}
                  onToggle={() => toggleItem(pkg.id)}
                />
              ))}
            </>
          )}

          {activeTab === 'addon' && (
            <>
              <div className="md:col-span-2 lg:col-span-3">
                <h3 className="text-xl font-bold text-blue-900 mb-4">電腦版加值服務</h3>
              </div>
              {Object.values(ADDON_COMPUTER).map((addon) => (
                <AddonCard
                  key={addon.id}
                  addon={addon}
                  selected={selectedItems.some((item) => item.productId === addon.id)}
                  onToggle={() => toggleItem(addon.id)}
                />
              ))}
              <div className="md:col-span-2 lg:col-span-3 mt-6">
                <h3 className="text-xl font-bold text-blue-900 mb-4">行動版加值服務</h3>
              </div>
              {Object.values(ADDON_MOBILE).map((addon) => (
                <AddonCard
                  key={addon.id}
                  addon={addon}
                  selected={selectedItems.some((item) => item.productId === addon.id)}
                  onToggle={() => toggleItem(addon.id)}
                />
              ))}
            </>
          )}
        </div>

        {/* 購物車摘要 */}
        {selectedItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-blue-200 shadow-2xl p-4 z-50"
          >
            <div className="container mx-auto max-w-6xl flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">已選擇 {selectedItems.length} 項</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${(totalAmount / 100).toLocaleString()}
                </p>
              </div>
              <button
                onClick={handleCreateOrder}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold px-8 py-4 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg disabled:opacity-50"
              >
                {loading ? '處理中...' : '前往結帳'}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// 方案卡片組件
function PlanCard({ plan, selected, onToggle }: any) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-white rounded-2xl shadow-xl p-6 border-2 cursor-pointer transition-all relative ${
        selected ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-blue-200 hover:border-blue-300'
      }`}
      onClick={onToggle}
    >
      {selected && (
        <div className="absolute top-4 right-4">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <CheckCircleIcon className="w-5 h-5 text-white" />
          </div>
        </div>
      )}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-blue-900 mb-2">{plan.name}</h3>
        {plan.id.includes('VIP') || plan.id.includes('GOLD') ? (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full">
            <StarIcon className="w-3 h-3" />
            推薦
          </span>
        ) : null}
      </div>
      <div className="mb-4">
        <span className="text-3xl font-bold text-blue-600">${(plan.price / 100).toLocaleString()}</span>
        {plan.originalPrice && (
          <>
            <span className="text-lg text-gray-500 line-through ml-2">
              ${(plan.originalPrice / 100).toLocaleString()}
            </span>
            <span className="ml-2 text-sm text-green-600 font-semibold">
              省 ${((plan.originalPrice - plan.price) / 100).toLocaleString()}
            </span>
          </>
        )}
      </div>
      {plan.clickIncrease && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-700 font-semibold">
            ✨ 提升 {plan.clickIncrease}% 點閱量
          </p>
        </div>
      )}
      {plan.duration && (
        <p className="text-sm text-gray-600 mb-4">刊登時間：{plan.duration} 天</p>
      )}
      {plan.features && plan.features.length > 0 && (
        <ul className="space-y-2 text-sm text-gray-600">
          {plan.features.slice(0, 3).map((feature: string, idx: number) => (
            <li key={idx} className="flex items-start gap-2">
              <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}

// 套餐卡片組件
function PackageCard({ pkg, selected, onToggle }: any) {
  const discount = pkg.originalPrice
    ? Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-white rounded-2xl shadow-xl p-6 border-2 cursor-pointer transition-all relative ${
        selected ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-blue-200 hover:border-blue-300'
      }`}
      onClick={onToggle}
    >
      {selected && (
        <div className="absolute top-4 right-4">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <CheckCircleIcon className="w-5 h-5 text-white" />
          </div>
        </div>
      )}
      {pkg.id.includes('GOLD') && (
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full">
            <FireIcon className="w-3 h-3" />
            最優惠
          </span>
        </div>
      )}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-blue-900 mb-2">{pkg.name}</h3>
        {discount > 0 && (
          <span className="text-sm text-green-600 font-semibold">低至 {discount} 折</span>
        )}
      </div>
      <div className="mb-4">
        <span className="text-3xl font-bold text-blue-600">${(pkg.price / 100).toLocaleString()}</span>
        {pkg.originalPrice && (
          <>
            <span className="text-lg text-gray-500 line-through ml-2">
              ${(pkg.originalPrice / 100).toLocaleString()}
            </span>
            <span className="ml-2 text-sm text-green-600 font-semibold">
              省 ${((pkg.originalPrice - pkg.price) / 100).toLocaleString()}
            </span>
          </>
        )}
      </div>
      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div className="flex justify-between">
          <span>廣告數量</span>
          <span className="font-semibold text-blue-600">{pkg.quantity} 筆</span>
        </div>
        <div className="flex justify-between">
          <span>廣告時間</span>
          <span className="font-semibold">{pkg.duration} 天/筆</span>
        </div>
        <div className="flex justify-between">
          <span>單價</span>
          <span className="font-semibold text-green-600">
            ${(pkg.unitPrice / 100).toLocaleString()}/筆
          </span>
        </div>
      </div>
      {pkg.canReplace && (
        <div className="mt-4 p-2 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-700 font-semibold">
            ✓ 可無限次更換物件
          </p>
        </div>
      )}
    </motion.div>
  );
}

// 加值服務卡片組件
function AddonCard({ addon, selected, onToggle }: any) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-white rounded-2xl shadow-xl p-6 border-2 cursor-pointer transition-all relative ${
        selected ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-blue-200 hover:border-blue-300'
      }`}
      onClick={onToggle}
    >
      {selected && (
        <div className="absolute top-4 right-4">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <CheckCircleIcon className="w-5 h-5 text-white" />
          </div>
        </div>
      )}
      {addon.id.includes('FEATURED') && (
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full">
            <StarIcon className="w-3 h-3" />
            熱門
          </span>
        </div>
      )}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-blue-900 mb-2">{addon.name}</h3>
      </div>
      <div className="mb-4">
        <span className="text-3xl font-bold text-blue-600">${(addon.price / 100).toLocaleString()}</span>
        <span className="text-sm text-gray-500 ml-2">/{addon.duration} 天</span>
      </div>
      <p className="text-sm text-gray-600 mb-3">{addon.description}</p>
      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
        <p className="text-sm text-green-700 font-semibold">
          ✨ 提升 {addon.clickIncrease}% 點閱量
        </p>
      </div>
      {addon.purchaseCount && (
        <p className="text-xs text-gray-500 mt-3">
          已有 {addon.purchaseCount.toLocaleString()} 人購買
        </p>
      )}
    </motion.div>
  );
}

