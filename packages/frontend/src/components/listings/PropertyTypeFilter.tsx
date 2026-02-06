'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const propertyTypes = [
  { id: 'WHOLE_FLOOR', label: '整層住家', icon: '🏢' },
  { id: 'STUDIO', label: '獨立套房', icon: '🏠' },
  { id: 'SUITE', label: '分租套房', icon: '🚪' },
  { id: 'ROOM', label: '雅房', icon: '🛏️' },
  { id: 'PARKING', label: '車位', icon: '🚗' },
]

interface PropertyTypeFilterProps {
  selected: string[]
  onChange: (types: string[]) => void
}

export default function PropertyTypeFilter({ selected, onChange }: PropertyTypeFilterProps) {
  const toggleType = (typeId: string) => {
    if (selected.includes(typeId)) {
      onChange(selected.filter(id => id !== typeId))
    } else {
      onChange([...selected, typeId])
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">物件類型</h3>
      <div className="grid grid-cols-2 gap-2">
        {propertyTypes.map((type) => (
          <Button
            key={type.id}
            variant={selected.includes(type.id) ? 'default' : 'outline'}
            className="justify-start h-auto py-3 px-4"
            onClick={() => toggleType(type.id)}
          >
            <span className="text-xl mr-2">{type.icon}</span>
            <span>{type.label}</span>
          </Button>
        ))}
      </div>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((typeId) => {
            const type = propertyTypes.find(t => t.id === typeId)
            return (
              <Badge key={typeId} variant="secondary">
                {type?.icon} {type?.label}
              </Badge>
            )
          })}
        </div>
      )}
    </div>
  )
}
