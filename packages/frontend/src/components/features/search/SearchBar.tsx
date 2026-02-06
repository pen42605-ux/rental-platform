'use client';

import { useState } from 'react';
import { Search, MapPin, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CITIES, TRANSACTION_TYPE_MAP } from '@/constants';

interface SearchBarProps {
  onSearch?: (query: string, filters: Record<string, string>) => void;
  className?: string;
}

/**
 * 全站搜尋列 - 類似 591 首頁的搜尋功能
 */
export default function SearchBar({ onSearch, className }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [transactionType, setTransactionType] = useState('RENT');
  const [city, setCity] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query, { transactionType, city });
  };

  return (
    <form onSubmit={handleSearch} className={className}>
      <div className="flex flex-col md:flex-row gap-3 bg-white rounded-2xl shadow-2xl p-3 md:p-4">
        {/* 交易類型選擇 */}
        <Select value={transactionType} onValueChange={setTransactionType}>
          <SelectTrigger className="w-full md:w-32">
            <SelectValue placeholder="交易類型" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(TRANSACTION_TYPE_MAP).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 縣市選擇 */}
        <Select value={city} onValueChange={setCity}>
          <SelectTrigger className="w-full md:w-36">
            <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="選擇縣市" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">不限縣市</SelectItem>
            {CITIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 搜尋輸入 */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="搜尋地區、捷運站、社區名稱..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 h-10"
          />
        </div>

        {/* 進階篩選按鈕 */}
        <Button type="button" variant="outline" size="icon" className="hidden md:flex">
          <SlidersHorizontal className="h-4 w-4" />
        </Button>

        {/* 搜尋按鈕 */}
        <Button type="submit" className="h-10 px-8">
          搜尋
        </Button>
      </div>
    </form>
  );
}
