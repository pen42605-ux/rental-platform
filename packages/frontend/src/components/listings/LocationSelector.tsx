'use client'

import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { CITIES } from '@/lib/utils'
import districtsData from '@/lib/districts'

interface LocationSelectorProps {
  city?: string
  district?: string
  onCityChange: (city: string) => void
  onDistrictChange: (district: string) => void
}

export default function LocationSelector({ 
  city, 
  district, 
  onCityChange, 
  onDistrictChange 
}: LocationSelectorProps) {
  const [selectedCity, setSelectedCity] = useState(city || '')
  
  const districts = selectedCity ? districtsData[selectedCity] || [] : []

  const handleCityChange = (newCity: string) => {
    setSelectedCity(newCity)
    onCityChange(newCity)
    onDistrictChange('') // 重置區域
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="city" className="text-lg font-semibold">
          縣市
        </Label>
        <Select value={selectedCity} onValueChange={handleCityChange}>
          <SelectTrigger id="city" className="w-full">
            <SelectValue placeholder="選擇縣市" />
          </SelectTrigger>
          <SelectContent>
            {CITIES.map((cityName) => (
              <SelectItem key={cityName} value={cityName}>
                {cityName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedCity && districts.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="district" className="text-lg font-semibold">
            行政區
          </Label>
          <Select value={district} onValueChange={onDistrictChange}>
            <SelectTrigger id="district" className="w-full">
              <SelectValue placeholder="選擇行政區" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">全部行政區</SelectItem>
              {districts.map((districtName) => (
                <SelectItem key={districtName} value={districtName}>
                  {districtName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {selectedCity && district && (
        <div className="p-3 bg-primary-50 rounded-lg border border-primary-100">
          <p className="text-sm text-primary-700">
            已選擇：<span className="font-semibold">{selectedCity} {district}</span>
          </p>
        </div>
      )}
    </div>
  )
}
