/**
 * 搜尋欄組件 (Search Bar Component)
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Home } from 'lucide-react';

interface SearchBarProps {
  onSearch?: (params: SearchParams) => void;
  className?: string;
}

interface SearchParams {
  keyword: string;
  city: string;
  propertyType: string;
}

const cities = [
  { value: 'all', label: '全部縣市' },
  { value: 'taipei', label: '台北市' },
  { value: 'new-taipei', label: '新北市' },
  { value: 'taoyuan', label: '桃園市' },
  { value: 'taichung', label: '台中市' },
  { value: 'tainan', label: '台南市' },
  { value: 'kaohsiung', label: '高雄市' },
];

const propertyTypes = [
  { value: 'all', label: '所有類型' },
  { value: 'apartment', label: '公寓' },
  { value: 'house', label: '透天厝' },
  { value: 'studio', label: '套房' },
  { value: 'share', label: '雅房' },
];

export function SearchBar({ onSearch, className = '' }: SearchBarProps) {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState('all');
  const [propertyType, setPropertyType] = useState('all');

  const handleSearch = () => {
    const params = { keyword, city, propertyType };
    
    if (onSearch) {
      onSearch(params);
    } else {
      // Navigate to search page with query params
      const queryParams = new URLSearchParams();
      if (keyword) queryParams.set('q', keyword);
      if (city !== 'all') queryParams.set('city', city);
      if (propertyType !== 'all') queryParams.set('type', propertyType);
      
      router.push(`/search?${queryParams.toString()}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:gap-2 ${className}`}>
      {/* Keyword Search */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="搜尋地區、捷運站、關鍵字..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyPress={handleKeyPress}
          className="pl-10 h-12"
        />
      </div>

      {/* City Select */}
      <Select value={city} onValueChange={setCity}>
        <SelectTrigger className="w-full sm:w-[160px] h-12">
          <MapPin className="h-4 w-4 mr-2" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {cities.map((c) => (
            <SelectItem key={c.value} value={c.value}>
              {c.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Property Type Select */}
      <Select value={propertyType} onValueChange={setPropertyType}>
        <SelectTrigger className="w-full sm:w-[160px] h-12">
          <Home className="h-4 w-4 mr-2" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {propertyTypes.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Search Button */}
      <Button onClick={handleSearch} size="lg" className="h-12 px-8">
        <Search className="h-4 w-4 mr-2" />
        搜尋
      </Button>
    </div>
  );
}
