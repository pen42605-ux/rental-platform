'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, MapPin, DollarSign, Home } from 'lucide-react'

interface QuickSearchBarProps {
  onSearch?: (query: string) => void
}

const popularSearches = [
  { label: '台北市', icon: <MapPin className="h-3 w-3" /> },
  { label: '10000-20000', icon: <DollarSign className="h-3 w-3" /> },
  { label: '獨立套房', icon: <Home className="h-3 w-3" /> },
  { label: '大安區', icon: <MapPin className="h-3 w-3" /> },
]

export default function QuickSearchBar({ onSearch }: QuickSearchBarProps) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(query)
  }

  const handleQuickSearch = (searchTerm: string) => {
    setQuery(searchTerm)
    onSearch?.(searchTerm)
  }

  return (
    <div className="w-full space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="搜尋地區、捷運站、學校..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>
        <Button type="submit" size="lg" className="px-8">
          搜尋
        </Button>
      </form>

      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm text-muted-foreground">熱門搜尋：</span>
        {popularSearches.map((search, index) => (
          <Badge
            key={index}
            variant="outline"
            className="cursor-pointer hover:bg-primary-50 hover:text-primary-700 hover:border-primary-300 transition-colors"
            onClick={() => handleQuickSearch(search.label)}
          >
            {search.icon}
            <span className="ml-1">{search.label}</span>
          </Badge>
        ))}
      </div>
    </div>
  )
}
