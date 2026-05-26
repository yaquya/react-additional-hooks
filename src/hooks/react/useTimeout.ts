import { useCallback, useEffect, useRef, useState } from "react";

/**

- Hook that sets a timeout and automatically cleans it up
- @param callback - Function to execute after delay
- @param delay - Delay in milliseconds (null to pause)
- 
- @example
- useTimeout(() => setShowMessage(false), 3000)
*/
export function useTimeout(callback: () => void, delay: number | null): void {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const id = setTimeout(() => savedCallback.current(), delay);
    return () => clearTimeout(id);
  }, [delay]);
}

/**

- Version with manual control (start, stop, reset)
*/
export function useTimeoutController(delay: number) {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const callbackRef = useRef<(() => void) | null>(null);

  const setCallback = useCallback((cb: () => void) => {
    callbackRef.current = cb;
  }, []);

  const start = useCallback(() => {
    if (timeoutId) clearTimeout(timeoutId);
    if (callbackRef.current) {
      const id = setTimeout(callbackRef.current, delay);
      setTimeoutId(id);
    }
  }, [delay, timeoutId]);

  const stop = useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  }, [timeoutId]);

  const reset = useCallback(() => {
    stop();
    start();
  }, [stop, start]);

  useEffect(() => {
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  return { setCallback, start, stop, reset };
}
