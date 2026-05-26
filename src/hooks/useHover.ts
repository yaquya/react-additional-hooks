import { useEffect, useRef, useState } from "react";

/**

- Hook that detects when an element is being hovered
- @returns [ref, isHovered] tuple
- 
- @example
- const [hoverRef, isHovered] = useHover()
- <div ref={hoverRef}>{isHovered ? 'Hovering' : 'Not hovering'}</div>

*/
export function useHover<T extends HTMLElement = HTMLDivElement>(): [
  React.RefObject<T>,
  boolean,
] {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return [ref, isHovered];
}
