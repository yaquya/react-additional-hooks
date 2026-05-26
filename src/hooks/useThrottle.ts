import { useEffect, useRef, useState } from "react";

/**

- Hook that throttles a value
- @template T - Type of value to throttle
- @param value - Value to throttle
- @param limit - Throttle limit in milliseconds
- @returns Throttled value
- 
- @example
- const [scrollPosition, setScrollPosition] = useState(0)
- const throttledPosition = useThrottle(scrollPosition, 100)
*/
export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef<number>(Date.now());

  useEffect(() => {
    const handler = setTimeout(
      () => {
        if (Date.now() - lastRan.current >= limit) {
          setThrottledValue(value);
          lastRan.current = Date.now();
        }
      },
      limit - (Date.now() - lastRan.current),
    );

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
}
