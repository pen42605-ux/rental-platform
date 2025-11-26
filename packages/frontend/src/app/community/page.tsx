'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPinIcon,
  HomeIcon,
  BuildingOfficeIcon,
  ShoppingBagIcon,
  AcademicCapIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';

// 模擬社區數據
const COMMUNITIES = [
  {
    id: 1,
    name: '信義區豪宅社區',
    address: '台北市信義區信義路五段',
    type: '電梯大樓',
    year: 2020,
    totalUnits: 120,
    avgPrice: 850000,
    image: '/api/placeholder/800/600',
    facilities: ['健身房', '游泳池', '管理室', '停車場'],
    nearby: {
      mrt: '信義安和站 (500m)',
      school: '信義國小 (300m)',
      shopping: '信義商圈 (800m)',
    },
  },
  {
    id: 2,
    name: '大安森林公園社區',
    address: '台北市大安區建國南路',
    type: '電梯大樓',
    year: 2018,
    totalUnits: 80,
    avgPrice: 920000,
    image: '/api/placeholder/800/600',
    facilities: ['健身房', '圖書館', '兒童遊戲區', '管理室'],
    nearby: {
      mrt: '大安森林公園站 (200m)',
      school: '大安國中 (400m)',
      shopping: 'SOGO百貨 (600m)',
    },
  },
  {
    id: 3,
    name: '板橋新板特區',
    address: '新北市板橋區新站路',
    type: '電梯大樓',
    year: 2021,
    totalUnits: 200,
    avgPrice: 650000,
    image: '/api/placeholder/800/600',
    facilities: ['健身房', '游泳池', 'SPA', '商務中心', '停車場'],
    nearby: {
      mrt: '板橋站 (100m)',
      school: '板橋國小 (500m)',
      shopping: '板橋大遠百 (200m)',
    },
  },
];

export default function CommunityPage() {
  const [selectedCity, setSelectedCity] = useState('全部');
  const cities = ['全部', '台北市', '新北市', '桃園市', '台中市', '高雄市'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 via-teal-600 to-cyan-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">社區資訊</h1>
          <p className="text-green-100 text-lg">
            深入了解各社區環境、設施與周邊生活機能
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* 城市篩選 */}
        <div className="flex flex-wrap gap-2 mb-8">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCity === city
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-blue-700 hover:bg-blue-50 border-2 border-blue-200'
                  }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* 社區列表 */}
        <div className="space-y-6">
          {COMMUNITIES.map((community) => (
            <Link
              key={community.id}
              href={`/community/${community.id}`}
              className="block bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden group"
            >
              <div className="flex flex-col lg:flex-row">
                <div className="relative w-full lg:w-96 h-64 lg:h-auto bg-gray-200 flex-shrink-0">
                  <Image
                    src={community.image}
                    alt={community.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      {community.type}
                    </span>
                  </div>
                </div>
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {community.name}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <MapPinIcon className="w-5 h-5" />
                        <span>{community.address}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>屋齡：{new Date().getFullYear() - community.year} 年</span>
                        <span>總戶數：{community.totalUnits} 戶</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        ${community.avgPrice.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">平均單價/坪</div>
                    </div>
                  </div>

                  {/* 設施 */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">社區設施</h4>
                    <div className="flex flex-wrap gap-2">
                      {community.facilities.map((facility, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                        >
                          {facility}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 周邊設施 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <BuildingOfficeIcon className="w-5 h-5 text-blue-500" />
                      <span>{community.nearby.mrt}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <AcademicCapIcon className="w-5 h-5 text-green-500" />
                      <span>{community.nearby.school}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <ShoppingBagIcon className="w-5 h-5 text-purple-500" />
                      <span>{community.nearby.shopping}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 社區搜尋 */}
        <section className="mt-12 bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">搜尋社區</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="輸入社區名稱"
              className="input"
            />
            <select className="input">
              <option>選擇縣市</option>
              <option>台北市</option>
              <option>新北市</option>
              <option>桃園市</option>
            </select>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-colors">
              🔍 搜尋社區
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

