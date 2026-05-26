import { useEffect, useState } from "react";

/**

- Hook that debounces a value
- @template T - Type of value to debounce
- @param value - Value to debounce
- @param delay - Delay in milliseconds
- @returns Debounced value
- 
- @example
- const [searchTerm, setSearchTerm] = useState('')
- const debouncedSearch = useDebounce(searchTerm, 500)
- 
- useEffect(() => {
- // API call with debounced value
- searchAPI(debouncedSearch)
- }, [debouncedSearch])
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
