'use client';

import { useState, useCallback, useEffect } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onSuggestionsFetch?: (query: string) => Promise<string[]>;
  className?: string;
  size?: 'default' | 'lg';
}

export default function SearchBar({
  placeholder = '搜尋地區、捷運站、關鍵字...',
  onSearch,
  onSuggestionsFetch,
  className,
  size = 'default',
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  // 取得搜尋建議
  useEffect(() => {
    if (debouncedQuery && onSuggestionsFetch) {
      onSuggestionsFetch(debouncedQuery).then(setSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery, onSuggestionsFetch]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSearch(query);
      setShowSuggestions(false);
    },
    [query, onSearch]
  );

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      setQuery(suggestion);
      onSearch(suggestion);
      setShowSuggestions(false);
    },
    [onSearch]
  );

  return (
    <form onSubmit={handleSubmit} className={cn('relative', className)}>
      <div
        className={cn(
          'flex bg-white rounded-xl shadow-lg overflow-hidden border border-secondary-200',
          size === 'lg' && 'shadow-2xl'
        )}
      >
        <div className="flex-1 flex items-center px-4">
          <Search
            className={cn(
              'text-secondary-400 mr-3 flex-shrink-0',
              size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'
            )}
          />
          <input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            className={cn(
              'w-full text-secondary-900 placeholder-secondary-400 focus:outline-none bg-transparent',
              size === 'lg' ? 'py-4 text-lg' : 'py-3 text-base'
            )}
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSuggestions([]);
              }}
              className="p-1 hover:bg-secondary-100 rounded-full"
            >
              <X className="w-4 h-4 text-secondary-400" />
            </button>
          )}
        </div>
        <Button
          type="submit"
          className={cn(
            'rounded-none font-semibold',
            size === 'lg' ? 'px-10 text-base' : 'px-6'
          )}
        >
          搜尋
        </Button>
      </div>

      {/* 搜尋建議 */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-secondary-200 rounded-xl shadow-lg z-50 overflow-hidden">
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-secondary-50 transition-colors"
            >
              <MapPin className="w-4 h-4 text-secondary-400 flex-shrink-0" />
              <span className="text-secondary-700">{suggestion}</span>
            </button>
          ))}
        </div>
      )}
    </form>
  );
}
