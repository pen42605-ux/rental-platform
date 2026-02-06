'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AMENITIES_LIST } from '@/lib/utils'

interface AmenitySelectorProps {
  selected: string[]
  onChange: (amenities: string[]) => void
  mode?: 'filter' | 'create'
}

export default function AmenitySelector({ 
  selected, 
  onChange, 
  mode = 'filter' 
}: AmenitySelectorProps) {
  const toggleAmenity = (amenityId: string) => {
    if (selected.includes(amenityId)) {
      onChange(selected.filter(id => id !== amenityId))
    } else {
      onChange([...selected, amenityId])
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">
        {mode === 'filter' ? '設施篩選' : '物件設施'}
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {AMENITIES_LIST.map((amenity) => (
          <Button
            key={amenity.id}
            variant={selected.includes(amenity.id) ? 'default' : 'outline'}
            size="sm"
            className="justify-start h-auto py-2 px-3"
            onClick={() => toggleAmenity(amenity.id)}
          >
            <span className="mr-2">{amenity.icon}</span>
            <span className="text-sm">{amenity.label}</span>
          </Button>
        ))}
      </div>

      {selected.length > 0 && (
        <div className="pt-2">
          <p className="text-sm text-muted-foreground mb-2">
            已選擇 {selected.length} 項設施
          </p>
          <div className="flex flex-wrap gap-2">
            {selected.map((amenityId) => {
              const amenity = AMENITIES_LIST.find(a => a.id === amenityId)
              return amenity ? (
                <Badge key={amenityId} variant="secondary" className="text-sm">
                  {amenity.icon} {amenity.label}
                </Badge>
              ) : null
            })}
          </div>
        </div>
      )}
    </div>
  )
}
