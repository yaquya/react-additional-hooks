import { useCallback, useState } from "react";

/**

- Hook that provides a boolean state with toggle function
- @param initialState - Initial boolean state (default: false)
- @returns [state, toggle, setTrue, setFalse] tuple
- 
- @example
- const [isOpen, toggle, open, close] = useToggle(false)
- <button onClick={toggle}>Toggle</button>
*/
export function useToggle(
  initialState: boolean = false,
): [
  boolean,
  () => void,
  () => void,
  () => void,
  React.Dispatch<React.SetStateAction<boolean>>,
] {
  const [state, setState] = useState<boolean>(initialState);

  const toggle = useCallback(() => setState((prev) => !prev), []);
  const setTrue = useCallback(() => setState(true), []);
  const setFalse = useCallback(() => setState(false), []);

  return [state, toggle, setTrue, setFalse, setState];
}
