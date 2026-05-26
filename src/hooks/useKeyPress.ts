import { useEffect, useState } from "react";

type Key = string;
type Keys = Key[];

/**

- Hook that tracks when specific keys are pressed
- @param targetKey - Single key or array of keys to listen for
- @returns Boolean indicating if target key(s) are pressed
- 
- @example
- const isEscapePressed = useKeyPress('Escape')
- const isCtrlCPressed = useKeyPress(['Control', 'c'])
*/
export function useKeyPress(targetKey: Key | Keys): boolean {
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    const keys = Array.isArray(targetKey) ? targetKey : [targetKey];

    const downHandler = (event: KeyboardEvent) => {
      if (keys.includes(event.key)) {
        if (!keyPressed) setKeyPressed(true);
      }
    };

    const upHandler = (event: KeyboardEvent) => {
      if (keys.includes(event.key)) {
        setKeyPressed(false);
      }
    };

    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [targetKey, keyPressed]);

  return keyPressed;
}
