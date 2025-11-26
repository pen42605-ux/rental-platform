'use client';

import { Fragment, useState } from 'react';
import { Dialog, Disclosure, Transition } from '@headlessui/react';
import {
  XMarkIcon,
  ChevronDownIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';
import { useFilterStore } from '@/lib/store';
import { PROPERTY_TYPE_MAP, AMENITIES_LIST, CITIES } from '@/lib/utils';

interface FilterSidebarProps {
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function FilterSidebar({ isMobile = false, isOpen = false, onClose }: FilterSidebarProps) {
  const filters = useFilterStore();

  const priceRanges = [
    { label: '不限', min: null, max: null },
    { label: '5,000 以下', min: null, max: 5000 },
    { label: '5,000 - 10,000', min: 5000, max: 10000 },
    { label: '10,000 - 15,000', min: 10000, max: 15000 },
    { label: '15,000 - 20,000', min: 15000, max: 20000 },
    { label: '20,000 - 30,000', min: 20000, max: 30000 },
    { label: '30,000 以上', min: 30000, max: null },
  ];

  const content = (
    <div className="space-y-6">
      {/* 房型 */}
      <Disclosure defaultOpen>
        {({ open }) => (
          <div className="bg-white rounded-xl border border-secondary-100 overflow-hidden">
            <Disclosure.Button className="flex items-center justify-between w-full px-4 py-3 hover:bg-secondary-50 transition-colors">
              <span className="font-semibold text-secondary-900">房源類型</span>
              <ChevronDownIcon
                className={`w-5 h-5 text-secondary-500 transition-transform ${
                  open ? 'rotate-180' : ''
                }`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pb-4">
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="propertyType"
                    checked={!filters.propertyType}
                    onChange={() => filters.setFilter('propertyType', null)}
                    className="w-4 h-4 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-secondary-700 group-hover:text-primary-600 transition-colors">
                    不限
                  </span>
                </label>
                {Object.entries(PROPERTY_TYPE_MAP).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="propertyType"
                      checked={filters.propertyType === key}
                      onChange={() => filters.setFilter('propertyType', key)}
                      className="w-4 h-4 text-primary-500 focus:ring-primary-500"
                    />
                    <span className="text-secondary-700 group-hover:text-primary-600 transition-colors">
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </Disclosure.Panel>
          </div>
        )}
      </Disclosure>

      {/* 價格範圍 */}
      <Disclosure defaultOpen>
        {({ open }) => (
          <div className="bg-white rounded-xl border border-secondary-100 overflow-hidden">
            <Disclosure.Button className="flex items-center justify-between w-full px-4 py-3 hover:bg-secondary-50 transition-colors">
              <span className="font-semibold text-secondary-900">租金範圍</span>
              <ChevronDownIcon
                className={`w-5 h-5 text-secondary-500 transition-transform ${
                  open ? 'rotate-180' : ''
                }`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pb-4">
              <div className="space-y-2">
                {priceRanges.map((range, idx) => (
                  <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={filters.minPrice === range.min && filters.maxPrice === range.max}
                      onChange={() => {
                        filters.setFilter('minPrice', range.min);
                        filters.setFilter('maxPrice', range.max);
                      }}
                      className="w-4 h-4 text-primary-500 focus:ring-primary-500"
                    />
                    <span className="text-secondary-700 group-hover:text-primary-600 transition-colors">
                      {range.label}
                    </span>
                  </label>
                ))}
              </div>
              {/* 自訂範圍 */}
              <div className="mt-4 pt-4 border-t border-secondary-100">
                <p className="text-sm text-secondary-500 mb-2">自訂範圍</p>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="最低"
                    value={filters.minPrice || ''}
                    onChange={(e) => filters.setFilter('minPrice', e.target.value ? Number(e.target.value) : null)}
                    className="input text-sm"
                  />
                  <span className="text-secondary-400">-</span>
                  <input
                    type="number"
                    placeholder="最高"
                    value={filters.maxPrice || ''}
                    onChange={(e) => filters.setFilter('maxPrice', e.target.value ? Number(e.target.value) : null)}
                    className="input text-sm"
                  />
                </div>
              </div>
            </Disclosure.Panel>
          </div>
        )}
      </Disclosure>

      {/* 縣市 */}
      <Disclosure defaultOpen>
        {({ open }) => (
          <div className="bg-white rounded-xl border border-secondary-100 overflow-hidden">
            <Disclosure.Button className="flex items-center justify-between w-full px-4 py-3 hover:bg-secondary-50 transition-colors">
              <span className="font-semibold text-secondary-900">地區</span>
              <ChevronDownIcon
                className={`w-5 h-5 text-secondary-500 transition-transform ${
                  open ? 'rotate-180' : ''
                }`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pb-4">
              <select
                value={filters.city || ''}
                onChange={(e) => filters.setFilter('city', e.target.value || null)}
                className="input text-sm"
              >
                <option value="">不限縣市</option>
                {CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </Disclosure.Panel>
          </div>
        )}
      </Disclosure>

      {/* 臥室數 */}
      <Disclosure>
        {({ open }) => (
          <div className="bg-white rounded-xl border border-secondary-100 overflow-hidden">
            <Disclosure.Button className="flex items-center justify-between w-full px-4 py-3 hover:bg-secondary-50 transition-colors">
              <span className="font-semibold text-secondary-900">房間數</span>
              <ChevronDownIcon
                className={`w-5 h-5 text-secondary-500 transition-transform ${
                  open ? 'rotate-180' : ''
                }`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pb-4">
              <div className="flex gap-2 flex-wrap">
                {[null, 1, 2, 3, 4].map((num) => (
                  <button
                    key={num ?? 'all'}
                    onClick={() => filters.setFilter('beds', num)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filters.beds === num
                        ? 'bg-primary-500 text-white'
                        : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                    }`}
                  >
                    {num === null ? '不限' : num === 4 ? '4+' : `${num} 房`}
                  </button>
                ))}
              </div>
            </Disclosure.Panel>
          </div>
        )}
      </Disclosure>

      {/* 設施 */}
      <Disclosure>
        {({ open }) => (
          <div className="bg-white rounded-xl border border-secondary-100 overflow-hidden">
            <Disclosure.Button className="flex items-center justify-between w-full px-4 py-3 hover:bg-secondary-50 transition-colors">
              <span className="font-semibold text-secondary-900">設施</span>
              <ChevronDownIcon
                className={`w-5 h-5 text-secondary-500 transition-transform ${
                  open ? 'rotate-180' : ''
                }`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pb-4">
              <div className="grid grid-cols-2 gap-2">
                {AMENITIES_LIST.map((amenity) => {
                  const isSelected = filters.amenities.includes(amenity.id);
                  return (
                    <label
                      key={amenity.id}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-primary-50 border border-primary-200'
                          : 'bg-secondary-50 border border-transparent hover:bg-secondary-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {
                          const newAmenities = isSelected
                            ? filters.amenities.filter((a) => a !== amenity.id)
                            : [...filters.amenities, amenity.id];
                          filters.setFilter('amenities', newAmenities);
                        }}
                        className="sr-only"
                      />
                      <span className="text-lg">{amenity.icon}</span>
                      <span className={`text-sm ${isSelected ? 'text-primary-700' : 'text-secondary-700'}`}>
                        {amenity.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </Disclosure.Panel>
          </div>
        )}
      </Disclosure>

      {/* 重設按鈕 */}
      <button
        onClick={filters.resetFilters}
        className="w-full btn-secondary"
      >
        清除篩選條件
      </button>
    </div>
  );

  // 手機版使用 Dialog
  if (isMobile) {
    return (
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose || (() => {})}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-300"
                  enterFrom="-translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-300"
                  leaveFrom="translate-x-0"
                  leaveTo="-translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-sm">
                    <div className="flex h-full flex-col bg-gray-50 shadow-xl">
                      {/* Header */}
                      <div className="flex items-center justify-between px-4 py-4 border-b border-secondary-100 bg-white">
                        <div className="flex items-center gap-2">
                          <FunnelIcon className="w-5 h-5 text-primary-500" />
                          <Dialog.Title className="text-lg font-semibold text-secondary-900">
                            篩選條件
                          </Dialog.Title>
                        </div>
                        <button
                          onClick={onClose}
                          className="p-2 rounded-lg hover:bg-secondary-100 transition-colors"
                        >
                          <XMarkIcon className="w-6 h-6 text-secondary-500" />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="flex-1 overflow-y-auto p-4">
                        {content}
                      </div>

                      {/* Footer */}
                      <div className="p-4 border-t border-secondary-100 bg-white">
                        <button onClick={onClose} className="w-full btn-primary">
                          套用篩選
                        </button>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    );
  }

  // 桌面版直接渲染
  return (
    <aside className="w-72 flex-shrink-0">
      <div className="sticky top-20">
        <div className="flex items-center gap-2 mb-4">
          <AdjustmentsHorizontalIcon className="w-5 h-5 text-primary-500" />
          <h2 className="font-semibold text-secondary-900">篩選條件</h2>
        </div>
        {content}
      </div>
    </aside>
  );
}






