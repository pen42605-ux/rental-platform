/**
 * 房源篩選器組件
 */
'use client';

import { useState } from 'react';
import { SearchFilters } from '@/types';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CITIES, PROPERTY_TYPES, PRICE_RANGES, AMENITIES } from '@/constants';

interface PropertyFiltersProps {
  onFiltersChange: (filters: SearchFilters) => void;
  initialFilters?: SearchFilters;
}

export function PropertyFilters({
  onFiltersChange,
  initialFilters = {},
}: PropertyFiltersProps) {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFiltersChange(filters);
  };

  const handleResetFilters = () => {
    const emptyFilters: SearchFilters = {};
    setFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>篩選條件</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 縣市 */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            縣市
          </label>
          <Select
            value={filters.city || ''}
            onChange={(e) => handleFilterChange('city', e.target.value)}
          >
            <option value="">全部縣市</option>
            {CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </Select>
        </div>

        {/* 房型 */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            房型
          </label>
          <Select
            value={filters.type || ''}
            onChange={(e) => handleFilterChange('type', e.target.value)}
          >
            <option value="">全部房型</option>
            {PROPERTY_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </Select>
        </div>

        {/* 價格範圍 */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            租金範圍
          </label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="最低價"
              value={filters.minPrice || ''}
              onChange={(e) =>
                handleFilterChange('minPrice', Number(e.target.value))
              }
            />
            <Input
              type="number"
              placeholder="最高價"
              value={filters.maxPrice || ''}
              onChange={(e) =>
                handleFilterChange('maxPrice', Number(e.target.value))
              }
            />
          </div>
        </div>

        {/* 面積範圍 */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            坪數範圍
          </label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="最小坪數"
              value={filters.minArea || ''}
              onChange={(e) =>
                handleFilterChange('minArea', Number(e.target.value))
              }
            />
            <Input
              type="number"
              placeholder="最大坪數"
              value={filters.maxArea || ''}
              onChange={(e) =>
                handleFilterChange('maxArea', Number(e.target.value))
              }
            />
          </div>
        </div>

        {/* 房間數 */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            房間數
          </label>
          <Select
            value={filters.rooms?.toString() || ''}
            onChange={(e) =>
              handleFilterChange('rooms', Number(e.target.value))
            }
          >
            <option value="">不限</option>
            <option value="1">1 房</option>
            <option value="2">2 房</option>
            <option value="3">3 房</option>
            <option value="4">4 房以上</option>
          </Select>
        </div>

        {/* 按鈕 */}
        <div className="flex gap-2 pt-4">
          <Button onClick={handleApplyFilters} className="flex-1">
            套用篩選
          </Button>
          <Button
            onClick={handleResetFilters}
            variant="outline"
            className="flex-1"
          >
            重置
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
