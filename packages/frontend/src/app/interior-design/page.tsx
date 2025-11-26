'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { StarIcon, EyeIcon, HeartIcon } from '@heroicons/react/24/outline';

// 模擬設計案例數據
const DESIGN_STYLES = ['全部', '現代風', '北歐風', '工業風', '日式', '美式', '簡約風'];
const DESIGN_CASES = [
  {
    id: 1,
    title: '25坪小宅大變身：現代簡約風格',
    designer: '王設計師',
    style: '現代風',
    area: '25坪',
    images: ['/api/placeholder/800/600', '/api/placeholder/800/600'],
    rating: 4.8,
    views: 1234,
    likes: 89,
    description: '透過開放式設計與巧妙收納，將25坪空間打造成寬敞舒適的現代居所。',
  },
  {
    id: 2,
    title: '溫馨北歐風：30坪親子宅',
    designer: '李設計師',
    style: '北歐風',
    area: '30坪',
    images: ['/api/placeholder/800/600'],
    rating: 4.9,
    views: 2156,
    likes: 156,
    description: '運用自然材質與柔和色調，營造溫馨舒適的親子生活空間。',
  },
  {
    id: 3,
    title: '工業風Loft：40坪個性空間',
    designer: '張設計師',
    style: '工業風',
    area: '40坪',
    images: ['/api/placeholder/800/600'],
    rating: 4.7,
    views: 1890,
    likes: 134,
    description: '裸露管線與金屬元素，打造充滿個性的工業風格居住空間。',
  },
  {
    id: 4,
    title: '日式禪風：20坪靜謐空間',
    designer: '陳設計師',
    style: '日式',
    area: '20坪',
    images: ['/api/placeholder/800/600'],
    rating: 4.6,
    views: 987,
    likes: 78,
    description: '簡約線條與自然材質，創造寧靜和諧的日式居住環境。',
  },
  {
    id: 5,
    title: '美式鄉村風：35坪溫馨家園',
    designer: '林設計師',
    style: '美式',
    area: '35坪',
    images: ['/api/placeholder/800/600'],
    rating: 4.8,
    views: 1456,
    likes: 112,
    description: '溫暖色調與復古元素，打造充滿溫馨感的美式鄉村風格。',
  },
  {
    id: 6,
    title: '極簡主義：18坪單身公寓',
    designer: '黃設計師',
    style: '簡約風',
    area: '18坪',
    images: ['/api/placeholder/800/600'],
    rating: 4.9,
    views: 2234,
    likes: 201,
    description: '極簡設計理念，在有限空間中創造無限可能。',
  },
];

export default function InteriorDesignPage() {
  const [selectedStyle, setSelectedStyle] = useState('全部');
  const filteredCases = selectedStyle === '全部'
    ? DESIGN_CASES
    : DESIGN_CASES.filter(case_ => case_.style === selectedStyle);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">室內設計</h1>
          <p className="text-purple-100 text-lg">
            探索精選設計案例，找到屬於您的理想風格
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* 風格篩選 */}
        <div className="flex flex-wrap gap-2 mb-8">
          {DESIGN_STYLES.map((style) => (
            <button
              key={style}
              onClick={() => setSelectedStyle(style)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedStyle === style
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-blue-700 hover:bg-blue-50 border-2 border-blue-200'
                  }`}
            >
              {style}
            </button>
          ))}
        </div>

        {/* 設計案例網格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCases.map((case_) => (
            <Link
              key={case_.id}
              href={`/interior-design/${case_.id}`}
              className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden"
            >
              <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                <Image
                  src={case_.images[0]}
                  alt={case_.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold border border-blue-200">
                    {case_.style}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <button className="bg-white/90 hover:bg-white p-2 rounded-full transition-colors">
                    <HeartIcon className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <StarIcon className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-semibold text-gray-900">{case_.rating}</span>
                  <span className="text-sm text-gray-500">({case_.views} 瀏覽)</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {case_.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {case_.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{case_.area}</span>
                    <span>設計師：{case_.designer}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <EyeIcon className="w-4 h-4" />
                    <span>{case_.views}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 設計師推薦 */}
        <section className="mt-12 bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">推薦設計師</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['王設計師', '李設計師', '張設計師'].map((designer, index) => (
              <div key={index} className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  {designer.charAt(0)}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{designer}</h3>
                <p className="text-sm text-gray-600 mb-4">10年設計經驗</p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg text-sm shadow-md transition-colors">
                  🎨 查看作品
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

