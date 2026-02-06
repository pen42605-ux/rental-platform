import { useState, useEffect } from 'react';

/**
 * 防抖 Hook - 用於搜尋輸入等場景
 * @param value 需要防抖的值
 * @param delay 延遲毫秒數
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
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
