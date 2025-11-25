'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { listingsApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { PROPERTY_TYPE_MAP, AMENITIES_LIST, CITIES } from '@/lib/utils';
import ImageUploader, { UploadedImage } from '@/components/upload/ImageUploader';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';

const ListingMap = dynamic(() => import('@/components/map/ListingMap'), {
  ssr: false,
});

interface FormData {
  title: string;
  description: string;
  price: number | '';
  currency: string;
  propertyType: string;
  beds: number;
  baths: number;
  area: number | '';
  city: string;
  district: string;
  address: string;
  latitude: number | '';
  longitude: number | '';
  amenities: string[];
  status: 'DRAFT' | 'PUBLISHED';
}

const initialFormData: FormData = {
  title: '',
  description: '',
  price: '',
  currency: 'TWD',
  propertyType: 'STUDIO',
  beds: 1,
  baths: 1,
  area: '',
  city: '',
  district: '',
  address: '',
  latitude: '',
  longitude: '',
  amenities: [],
  status: 'DRAFT',
};

export default function CreateListingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const updateField = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleAmenity = (amenityId: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((a) => a !== amenityId)
        : [...prev.amenities, amenityId],
    }));
  };

  const handleSubmit = async (publish = false) => {
    // 驗證必填欄位
    if (!formData.title.trim()) {
      toast.error('請輸入房源標題');
      return;
    }
    if (!formData.price) {
      toast.error('請輸入租金');
      return;
    }

    // 檢查圖片上傳狀態
    const pendingImages = images.filter((img) => img.status !== 'done');
    if (pendingImages.length > 0) {
      toast.error('請等待圖片上傳完成');
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        price: Number(formData.price),
        area: formData.area ? Number(formData.area) : undefined,
        latitude: formData.latitude ? Number(formData.latitude) : undefined,
        longitude: formData.longitude ? Number(formData.longitude) : undefined,
        status: publish ? 'PUBLISHED' : 'DRAFT',
        images: images
          .filter((img) => img.status === 'done')
          .map((img) => ({
            key: img.key!,
            url: img.url!,
            bucket: img.bucket!,
            filename: img.filename,
            mimeType: img.mimeType,
            size: img.size,
            isCover: img.isCover,
            sortOrder: img.sortOrder,
          })),
      };

      const response = await listingsApi.create(submitData as any);
      toast.success(publish ? '房源已發布！' : '房源已儲存為草稿');
      router.push(`/listing/${response.data.data.id}`);
    } catch (error: any) {
      console.error('Create listing error:', error);
      toast.error(error.response?.data?.error?.message || '發布失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  // 檢查登入狀態
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-semibold text-secondary-900 mb-2">請先登入</h2>
          <p className="text-secondary-500 mb-4">您需要登入才能發布房源</p>
          <button onClick={() => router.push('/login')} className="btn-primary">
            前往登入
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* 返回按鈕 */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-secondary-600 hover:text-primary-500 transition-colors mb-6"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          返回
        </button>

        {/* 標題 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-secondary-900">發布房源</h1>
          <p className="text-secondary-500 mt-2">填寫房源資訊，讓租客更容易找到您的房子</p>
        </motion.div>

        {/* 步驟指示器 */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <button
                onClick={() => setStep(s)}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  step >= s
                    ? 'bg-primary-500 text-white'
                    : 'bg-secondary-200 text-secondary-500'
                }`}
              >
                {step > s ? <CheckCircleIcon className="w-6 h-6" /> : s}
              </button>
              {s < 3 && (
                <div
                  className={`w-16 h-1 mx-2 rounded ${
                    step > s ? 'bg-primary-500' : 'bg-secondary-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* 表單內容 */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card p-8"
        >
          {/* 步驟 1: 基本資訊 */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-secondary-900 mb-6">基本資訊</h2>

              {/* 標題 */}
              <div>
                <label className="block text-secondary-700 font-medium mb-2">
                  房源標題 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="例：捷運站旁精美套房"
                  className="input"
                  maxLength={100}
                />
                <p className="text-secondary-400 text-sm mt-1">
                  {formData.title.length}/100
                </p>
              </div>

              {/* 房型 */}
              <div>
                <label className="block text-secondary-700 font-medium mb-2">
                  房源類型 <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {Object.entries(PROPERTY_TYPE_MAP).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => updateField('propertyType', key)}
                      className={`p-3 rounded-xl border-2 font-medium transition-all ${
                        formData.propertyType === key
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-secondary-200 hover:border-primary-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 租金 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-secondary-700 font-medium mb-2">
                    月租金 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-500">
                      NT$
                    </span>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => updateField('price', e.target.value ? Number(e.target.value) : '')}
                      placeholder="10000"
                      className="input pl-14"
                      min={0}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-secondary-700 font-medium mb-2">坪數</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.area}
                      onChange={(e) => updateField('area', e.target.value ? Number(e.target.value) : '')}
                      placeholder="10"
                      className="input pr-12"
                      min={0}
                      step={0.1}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-500">
                      坪
                    </span>
                  </div>
                </div>
              </div>

              {/* 房間數 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-secondary-700 font-medium mb-2">房間數</label>
                  <select
                    value={formData.beds}
                    onChange={(e) => updateField('beds', Number(e.target.value))}
                    className="input"
                  >
                    {[0, 1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n} 間
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-secondary-700 font-medium mb-2">衛浴數</label>
                  <select
                    value={formData.baths}
                    onChange={(e) => updateField('baths', Number(e.target.value))}
                    className="input"
                  >
                    {[0, 1, 2, 3, 4].map((n) => (
                      <option key={n} value={n}>
                        {n} 間
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 描述 */}
              <div>
                <label className="block text-secondary-700 font-medium mb-2">房源描述</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="詳細描述您的房源特色、周邊環境、交通便利性等..."
                  className="input min-h-[150px] resize-y"
                  maxLength={5000}
                />
                <p className="text-secondary-400 text-sm mt-1">
                  {formData.description.length}/5000
                </p>
              </div>
            </div>
          )}

          {/* 步驟 2: 位置與設施 */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-secondary-900 mb-6">位置與設施</h2>

              {/* 地址 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-secondary-700 font-medium mb-2">縣市</label>
                  <select
                    value={formData.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    className="input"
                  >
                    <option value="">請選擇</option>
                    {CITIES.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-secondary-700 font-medium mb-2">區域</label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => updateField('district', e.target.value)}
                    placeholder="例：大安區"
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-secondary-700 font-medium mb-2">詳細地址</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  placeholder="例：復興南路一段100號"
                  className="input"
                />
              </div>

              {/* 座標 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-secondary-700 font-medium mb-2">緯度</label>
                  <input
                    type="number"
                    value={formData.latitude}
                    onChange={(e) => updateField('latitude', e.target.value ? Number(e.target.value) : '')}
                    placeholder="25.033"
                    className="input"
                    step="any"
                  />
                </div>
                <div>
                  <label className="block text-secondary-700 font-medium mb-2">經度</label>
                  <input
                    type="number"
                    value={formData.longitude}
                    onChange={(e) => updateField('longitude', e.target.value ? Number(e.target.value) : '')}
                    placeholder="121.565"
                    className="input"
                    step="any"
                  />
                </div>
              </div>

              {/* 設施 */}
              <div>
                <label className="block text-secondary-700 font-medium mb-4">設施設備</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {AMENITIES_LIST.map((amenity) => {
                    const isSelected = formData.amenities.includes(amenity.id);
                    return (
                      <button
                        key={amenity.id}
                        type="button"
                        onClick={() => toggleAmenity(amenity.id)}
                        className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                          isSelected
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-secondary-200 hover:border-primary-300'
                        }`}
                      >
                        <span className="text-xl">{amenity.icon}</span>
                        <span
                          className={
                            isSelected ? 'text-primary-700' : 'text-secondary-700'
                          }
                        >
                          {amenity.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 步驟 3: 圖片上傳 */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-secondary-900 mb-6">上傳圖片</h2>
              <ImageUploader images={images} onChange={setImages} maxFiles={10} />
            </div>
          )}

          {/* 導航按鈕 */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-secondary-100">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="btn-secondary"
              >
                上一步
              </button>
            ) : (
              <div />
            )}

            <div className="flex gap-3">
              {step < 3 ? (
                <button onClick={() => setStep(step + 1)} className="btn-primary">
                  下一步
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleSubmit(false)}
                    disabled={loading}
                    className="btn-secondary"
                  >
                    {loading ? '儲存中...' : '儲存草稿'}
                  </button>
                  <button
                    onClick={() => handleSubmit(true)}
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? '發布中...' : '立即發布'}
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


