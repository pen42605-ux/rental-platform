'use client';

import { useCallback } from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RENT_PRICE_RANGES, AMENITIES, SORT_OPTIONS } from '@/constants';
import { CITIES } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface SearchFiltersProps {
  filters: Record<string, any>;
  onFilterChange: (key: string, value: any) => void;
  onReset: () => void;
  className?: string;
}

export default function SearchFilters({
  filters,
  onFilterChange,
  onReset,
  className,
}: SearchFiltersProps) {
  return (
    <aside className={cn('w-72 flex-shrink-0', className)}>
      <div className="sticky top-20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-primary-500" />
            <h2 className="font-semibold text-secondary-900">篩選條件</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-secondary-500"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            重設
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="space-y-6 pr-4">
            {/* 地區選擇 */}
            <div className="space-y-2">
              <Label>地區</Label>
              <Select
                value={filters.city || ''}
                onValueChange={(value) =>
                  onFilterChange('city', value || null)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="選擇縣市" />
                </SelectTrigger>
                <SelectContent>
                  {CITIES.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* 價格範圍 */}
            <div className="space-y-3">
              <Label>租金範圍</Label>
              {RENT_PRICE_RANGES.map((range, idx) => (
                <label
                  key={idx}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="priceRange"
                    checked={
                      filters.minPrice === range.min &&
                      filters.maxPrice === range.max
                    }
                    onChange={() => {
                      onFilterChange('minPrice', range.min);
                      onFilterChange('maxPrice', range.max);
                    }}
                    className="w-4 h-4 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-secondary-700 group-hover:text-primary-600 transition-colors text-sm">
                    {range.label}
                  </span>
                </label>
              ))}
            </div>

            <Separator />

            {/* 房間數 */}
            <div className="space-y-2">
              <Label>房間數</Label>
              <div className="flex gap-2 flex-wrap">
                {[null, 1, 2, 3, 4].map((num) => (
                  <Button
                    key={num ?? 'all'}
                    variant={filters.beds === num ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onFilterChange('beds', num)}
                  >
                    {num === null ? '不限' : num === 4 ? '4+' : `${num} 房`}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* 排序 */}
            <div className="space-y-2">
              <Label>排序方式</Label>
              <Select
                value={filters.sort || 'newest'}
                onValueChange={(value) => onFilterChange('sort', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* 設施 */}
            <div className="space-y-3">
              <Label>設施需求</Label>
              <div className="grid grid-cols-2 gap-2">
                {AMENITIES.slice(0, 12).map((amenity) => {
                  const isSelected = filters.amenities?.includes(amenity.id);
                  return (
                    <label
                      key={amenity.id}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm',
                        isSelected
                          ? 'bg-primary-50 border border-primary-200'
                          : 'bg-secondary-50 border border-transparent hover:bg-secondary-100'
                      )}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => {
                          const currentAmenities =
                            filters.amenities || [];
                          const newAmenities = checked
                            ? [...currentAmenities, amenity.id]
                            : currentAmenities.filter(
                                (a: string) => a !== amenity.id
                              );
                          onFilterChange('amenities', newAmenities);
                        }}
                      />
                      <span className="text-lg">{amenity.icon}</span>
                      <span>{amenity.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
}
