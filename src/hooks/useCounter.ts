import { useCallback, useState } from "react";

interface CounterOptions {
  min?: number;
  max?: number;
  step?: number;
}

/**

- Hook for managing counter state with increment/decrement operations
- @param initialValue - Initial counter value (default: 0)
- @param options - Configuration options (min, max, step)
- @returns Counter object with value and methods
- 
- @example
- const { count, increment, decrement, reset, set } = useCounter(0, { min: 0, max: 10 })
*/
export function useCounter(
  initialValue: number = 0,
  options: CounterOptions = {},
) {
  const { min, max, step = 1 } = options;
  const [count, setCount] = useState<number>(initialValue);

  const increment = useCallback(() => {
    setCount((prev) => {
      const next = prev + step;
      if (max !== undefined && next > max) return prev;
      return next;
    });
  }, [step, max]);

  const decrement = useCallback(() => {
    setCount((prev) => {
      const next = prev - step;
      if (min !== undefined && next < min) return prev;
      return next;
    });
  }, [step, min]);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  const set = useCallback(
    (value: number | ((prev: number) => number)) => {
      setCount((prev) => {
        const newValue = typeof value === "function" ? value(prev) : value;
        if (min !== undefined && newValue < min) return prev;
        if (max !== undefined && newValue > max) return prev;
        return newValue;
      });
    },
    [min, max],
  );

  return { count, increment, decrement, reset, set };
}
