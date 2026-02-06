import { useState, useEffect } from 'react';

/**
 * Debounce hook - 延遲搜尋等操作
 * @param value - 要 debounce 的值
 * @param delay - 延遲時間（毫秒）
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
