/**
 * 價格範圍滑桿組件 (Price Range Slider Component)
 */

'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface PriceRangeSliderProps {
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: [number, number];
  onChange?: (value: [number, number]) => void;
  className?: string;
}

export function PriceRangeSlider({
  min = 0,
  max = 50000,
  step = 1000,
  defaultValue = [0, 50000],
  onChange,
  className = '',
}: PriceRangeSliderProps) {
  const [value, setValue] = useState<[number, number]>(defaultValue);

  const handleChange = (newValue: number[]) => {
    const range = [newValue[0], newValue[1]] as [number, number];
    setValue(range);
    onChange?.(range);
  };

  const formatPrice = (price: number) => {
    if (price >= 10000) {
      return `${(price / 10000).toFixed(1)}萬`;
    }
    return price.toLocaleString();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <Label>租金範圍</Label>
        <span className="text-sm text-muted-foreground">
          ${formatPrice(value[0])} - ${formatPrice(value[1])} / 月
        </span>
      </div>
      
      <Slider
        min={min}
        max={max}
        step={step}
        value={value}
        onValueChange={handleChange}
        className="w-full"
      />
      
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>${formatPrice(min)}</span>
        <span>${formatPrice(max)}</span>
      </div>
    </div>
  );
}
