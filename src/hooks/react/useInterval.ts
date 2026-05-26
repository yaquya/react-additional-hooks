import { useEffect, useRef } from "react";

/**

- Hook that sets up an interval and automatically cleans it up
- @param callback - Function to execute at intervals
- @param delay - Delay in milliseconds (null to pause)
- 
- @example
- const [seconds, setSeconds] = useState(0)
- useInterval(() => setSeconds(s => s + 1), 1000)
*/
export function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}
