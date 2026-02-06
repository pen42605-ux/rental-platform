'use client';

import { useState, useEffect } from 'react';

/**
 * Debounce hook - 延遲更新值
 * 常用於搜尋輸入框，避免頻繁發送 API 請求
 *
 * @param value - 需要 debounce 的值
 * @param delay - 延遲時間 (ms)，預設 500ms
 * @returns debounced 後的值
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
