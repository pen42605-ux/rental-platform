'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Sparkles, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// 熱門搜尋關鍵字
const HOT_SEARCHES = [
  '台北市', '新北市', '桃園市', '台中市', '高雄市',
  '信義區', '大安區', '板橋區', '中壢區', '西屯區',
  '捷運站', '近學校', '近商圈', '電梯大樓', '透天厝',
];

interface HeroSectionProps {
  onSearch: (query: string) => void;
}

export default function HeroSection({ onSearch }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleHotSearch = (keyword: string) => {
    setSearchQuery(keyword);
    onSearch(keyword);
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-600 py-12 md:py-16 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
            好房網 - 找房更簡單
          </h1>
          <p className="text-white/90 text-base md:text-lg max-w-2xl mx-auto">
            全台最大租屋、買房平台，數萬筆精選房源，快速找到理想的家
          </p>
        </motion.div>

        {/* Search box */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSearch}
          className="max-w-4xl mx-auto mb-6"
        >
          <div className="flex bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="flex-1 flex items-center px-4 md:px-6">
              <Search className="w-5 h-5 md:w-6 md:h-6 text-gray-400 mr-2 md:mr-3 flex-shrink-0" />
              <input
                type="text"
                placeholder="搜尋地區、捷運站、關鍵字..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-3 md:py-4 text-base md:text-lg text-gray-900 placeholder-gray-400 focus:outline-none"
              />
            </div>
            <Button
              type="submit"
              className="rounded-none px-6 md:px-10 py-3 md:py-4 h-auto font-semibold text-base"
            >
              搜尋
            </Button>
          </div>
        </motion.form>

        {/* Hot searches */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-2 mb-3">
            <Flame className="w-5 h-5 text-yellow-300" />
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span className="text-white/90 text-sm font-medium">熱門搜尋：</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {HOT_SEARCHES.map((keyword) => (
              <button
                key={keyword}
                onClick={() => handleHotSearch(keyword)}
                className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-sm rounded-full transition-colors backdrop-blur-sm border border-white/30"
              >
                {keyword}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
