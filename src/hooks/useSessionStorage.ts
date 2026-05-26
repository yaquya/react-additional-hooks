import { useEffect, useState } from "react";

/**

- Hook for managing state synchronized with sessionStorage
- @template T - Type of stored value
- @param key - sessionStorage key
- @param initialValue - Initial value or function returning initial value
- @returns [storedValue, setValue] tuple
- 
- @example
- const [name, setName] = useSessionStorage('userName', 'John')
- // Updates sessionStorage automatically
*/
export function useSessionStorage<T>(
  key: string,
  initialValue: T | (() => T),
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      if (item !== null) {
        return JSON.parse(item);
      }
      return initialValue instanceof Function ? initialValue() : initialValue;
    } catch (error) {
      console.warn(`Error reading sessionStorage key "${key}":`, error);
      return initialValue instanceof Function ? initialValue() : initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting sessionStorage key "${key}":`, error);
    }
  };

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch {
          // Ignore parse errors
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}
