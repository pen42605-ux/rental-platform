'use client';

import { useEffect, useState } from 'react';
import { Clock, TrendingUp, MapPin } from 'lucide-react';
import { useDebounce } from '@/hooks';

interface SearchSuggestionsProps {
  query: string;
  onSelect: (suggestion: string) => void;
  isVisible: boolean;
}

interface Suggestion {
  text: string;
  type: 'history' | 'trending' | 'location';
}

/**
 * 搜尋建議下拉面板
 * 顯示搜尋歷史、熱門搜尋和位置建議
 */
export default function SearchSuggestions({
  query,
  onSelect,
  isVisible,
}: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery) {
      // 無輸入時顯示歷史 + 熱門
      setSuggestions([
        { text: '台北市大安區', type: 'history' },
        { text: '捷運信義安和站', type: 'history' },
        { text: '信義區', type: 'trending' },
        { text: '板橋區', type: 'trending' },
        { text: '中山區', type: 'trending' },
      ]);
      return;
    }

    // TODO: 呼叫 API 取得搜尋建議
    // searchApi.suggest(debouncedQuery).then(...)
  }, [debouncedQuery]);

  if (!isVisible) return null;

  const getIcon = (type: Suggestion['type']) => {
    switch (type) {
      case 'history':
        return <Clock className="w-4 h-4 text-muted-foreground" />;
      case 'trending':
        return <TrendingUp className="w-4 h-4 text-orange-500" />;
      case 'location':
        return <MapPin className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-border z-50 overflow-hidden">
      <div className="py-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSelect(suggestion.text)}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-accent transition-colors"
          >
            {getIcon(suggestion.type)}
            <span className="text-sm text-foreground">{suggestion.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
