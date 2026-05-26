import { useEffect, useRef } from "react";

/**

- Hook that returns the previous value of a variable
- @template T - Type of value
- @param value - Current value
- @returns Previous value (undefined on first render)
- 
- @example
- const [count, setCount] = useState(0)
- const prevCount = usePrevious(count)
- // prevCount will be previous value of count
*/
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
