'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { formatPrice } from '@/lib/utils'

interface PriceRangeSliderProps {
  min?: number
  max?: number
  value: [number, number]
  onChange: (value: [number, number]) => void
}

export default function PriceRangeSlider({ 
  min = 0, 
  max = 100000, 
  value, 
  onChange 
}: PriceRangeSliderProps) {
  const [localValue, setLocalValue] = useState(value)

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = parseInt(e.target.value)
    const newValue: [number, number] = [newMin, Math.max(newMin, localValue[1])]
    setLocalValue(newValue)
    onChange(newValue)
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = parseInt(e.target.value)
    const newValue: [number, number] = [Math.min(localValue[0], newMax), newMax]
    setLocalValue(newValue)
    onChange(newValue)
  }

  return (
    <div className="space-y-4">
      <Label className="text-lg font-semibold">租金範圍</Label>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">最低</span>
          <span className="font-semibold text-primary-600">{formatPrice(localValue[0])}</span>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={1000}
          value={localValue[0]}
          onChange={handleMinChange}
          className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">最高</span>
          <span className="font-semibold text-primary-600">{formatPrice(localValue[1])}</span>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={1000}
          value={localValue[1]}
          onChange={handleMaxChange}
          className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
        />
      </div>

      <div className="pt-2 text-center">
        <p className="text-sm text-secondary-600">
          {formatPrice(localValue[0])} - {formatPrice(localValue[1])}
        </p>
      </div>
    </div>
  )
}
