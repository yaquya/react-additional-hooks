import { useEffect, useRef } from "react";

/**

- Hook that detects clicks outside of a referenced element
- @param handler - Callback function when click outside occurs
- @returns React ref to attach to the element
- 
- @example
- const ref = useClickOutside(() => setIsOpen(false))
- return <div ref={ref}>Content</div>
*/
export function useClickOutside<T extends HTMLElement = HTMLDivElement>(
  handler: () => void,
): React.RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [handler]);

  return ref;
}
