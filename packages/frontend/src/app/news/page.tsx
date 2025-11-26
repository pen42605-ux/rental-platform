'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CalendarIcon, ClockIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

// 模擬新聞數據
const NEWS_CATEGORIES = ['全部', '市場動態', '政策解讀', '購房指南', '裝修設計', '投資理財'];
const NEWS_ARTICLES = [
  {
    id: 1,
    title: '2024年房市展望：利率走勢與購房時機分析',
    category: '市場動態',
    excerpt: '隨著央行政策調整，2024年房市將面臨新的挑戰與機遇。本文深入分析利率走勢對房市的影響，並提供購房時機建議...',
    image: '/api/placeholder/800/400',
    date: '2024-01-15',
    readTime: '5 分鐘',
    featured: true,
  },
  {
    id: 2,
    title: '青年購屋補助方案完整解析',
    category: '政策解讀',
    excerpt: '政府最新推出的青年購屋補助方案，提供最高500萬元的優惠貸款。本文詳細說明申請條件、流程與注意事項...',
    image: '/api/placeholder/800/400',
    date: '2024-01-12',
    readTime: '8 分鐘',
    featured: false,
  },
  {
    id: 3,
    title: '首次購房必看：從看房到交屋完整指南',
    category: '購房指南',
    excerpt: '第一次買房不知道從何開始？本文提供完整的購房流程指南，從看房技巧、議價策略到交屋注意事項，幫助您順利完成購房...',
    image: '/api/placeholder/800/400',
    date: '2024-01-10',
    readTime: '12 分鐘',
    featured: false,
  },
  {
    id: 4,
    title: '小坪數空間設計：打造舒適居住環境',
    category: '裝修設計',
    excerpt: '如何在有限的空間內創造最大的使用價值？專業設計師分享小坪數空間規劃技巧與收納設計要點...',
    image: '/api/placeholder/800/400',
    date: '2024-01-08',
    readTime: '6 分鐘',
    featured: false,
  },
  {
    id: 5,
    title: '房地產投資策略：如何選擇潛力區域',
    category: '投資理財',
    excerpt: '房地產投資需要考慮哪些因素？本文分析區域發展潛力、交通建設、生活機能等關鍵指標，幫助投資者做出明智決策...',
    image: '/api/placeholder/800/400',
    date: '2024-01-05',
    readTime: '10 分鐘',
    featured: false,
  },
  {
    id: 6,
    title: '租屋族必知：租約簽訂與權益保障',
    category: '購房指南',
    excerpt: '簽訂租約時需要注意哪些事項？如何保障自身權益？本文提供租屋族必知的實用資訊與法律常識...',
    image: '/api/placeholder/800/400',
    date: '2024-01-03',
    readTime: '7 分鐘',
    featured: false,
  },
];

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const filteredArticles = selectedCategory === '全部'
    ? NEWS_ARTICLES
    : NEWS_ARTICLES.filter(article => article.category === selectedCategory);

  const featuredArticle = NEWS_ARTICLES.find(article => article.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">房地產新聞</h1>
          <p className="text-primary-100 text-lg">
            掌握最新市場動態、政策解讀與購房指南
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 主要內容 */}
          <div className="flex-1">
            {/* 分類標籤 */}
            <div className="flex flex-wrap gap-2 mb-8">
              {NEWS_CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-blue-700 hover:bg-blue-50 border-2 border-blue-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* 精選文章 */}
            {selectedCategory === '全部' && featuredArticle && (
              <div className="mb-8">
                <Link
                  href={`/news/${featuredArticle.id}`}
                  className="block bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
                >
                  <div className="relative h-64 md:h-80 bg-gray-200">
                    <Image
                      src={featuredArticle.image}
                      alt={featuredArticle.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                        ✨ 精選
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium border border-blue-200">
                        {featuredArticle.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{featuredArticle.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ClockIcon className="w-4 h-4" />
                        <span>{featuredArticle.readTime}</span>
                      </div>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {featuredArticle.title}
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed mb-4">
                      {featuredArticle.excerpt}
                    </p>
                    <div className="flex items-center text-blue-600 font-medium">
                      📖 閱讀全文
                      <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* 文章列表 */}
            <div className="space-y-6">
              {filteredArticles
                .filter(article => !article.featured || selectedCategory !== '全部')
                .map((article) => (
                  <Link
                    key={article.id}
                    href={`/news/${article.id}`}
                    className="block bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden group"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="relative w-full md:w-64 h-48 md:h-auto bg-gray-200 flex-shrink-0">
                        <Image
                          src={article.image}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1 p-6">
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium border border-blue-200">
                            {article.category}
                          </span>
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{article.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ClockIcon className="w-4 h-4" />
                            <span>{article.readTime}</span>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed mb-4 line-clamp-2">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center text-blue-600 font-medium">
                          📖 閱讀全文
                          <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>

          {/* 側邊欄 */}
          <aside className="w-full lg:w-80 space-y-6">
            {/* 熱門文章 */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">熱門文章</h3>
              <div className="space-y-4">
                {NEWS_ARTICLES.slice(0, 5).map((article, index) => (
                  <Link
                    key={article.id}
                    href={`/news/${article.id}`}
                    className="flex items-start gap-3 group"
                  >
                    <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {article.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">{article.date}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* 訂閱電子報 */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-600 rounded-xl shadow-md p-6 text-white">
              <h3 className="text-xl font-bold mb-3">訂閱電子報</h3>
              <p className="text-primary-100 text-sm mb-4">
                訂閱我們的電子報，第一時間收到最新房市資訊與購房指南
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="輸入您的 Email"
                  className="w-full px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button
                  type="submit"
                  className="w-full bg-white text-blue-600 font-semibold py-2 rounded-lg hover:bg-blue-50 transition-colors shadow-md"
                >
                  ✉️ 訂閱
                </button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

