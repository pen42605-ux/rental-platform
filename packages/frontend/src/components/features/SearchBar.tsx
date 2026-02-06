/**
 * 搜尋列組件 - 主頁搜尋功能
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { CITIES, PROPERTY_TYPES } from '@/constants';

export function SearchBar() {
  const router = useRouter();
  const [city, setCity] = useState('');
  const [type, setType] = useState('');
  const [keyword, setKeyword] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    if (city) params.append('city', city);
    if (type) params.append('type', type);
    if (keyword) params.append('q', keyword);

    router.push(`/listings?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-xl p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            縣市
          </label>
          <Select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full"
          >
            <option value="">全部縣市</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            房型
          </label>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full"
          >
            <option value="">全部房型</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            關鍵字
          </label>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="搜尋地區、捷運站、學校..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="lg" className="px-8">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              搜尋
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
