import { useEffect, useState } from 'react';

/**
 * Debounce hook - qiymatni berilgan vaqt davomida kutib turadi
 * @param value - Debounce qilinadigan qiymat
 * @param delay - Kutish vaqti (millisekundlarda), default: 300ms
 * @returns Debounced qiymat
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
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
