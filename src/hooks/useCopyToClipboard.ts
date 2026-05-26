import { useCallback, useState } from "react";

type CopiedValue = string | null;
type CopyFn = (text: string) => Promise<boolean>;

/**

- Hook that provides copy to clipboard functionality
- @returns [copiedText, copy] tuple
- 
- @example
- const [copiedText, copy] = useCopyToClipboard()
- copy('Text to copy')
*/
export function useCopyToClipboard(): [CopiedValue, CopyFn] {
  const [copiedText, setCopiedText] = useState<CopiedValue>(null);

  const copy: CopyFn = useCallback(async (text) => {
    if (!navigator?.clipboard) {
      console.warn("Clipboard not supported");
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2000);
      return true;
    } catch (error) {
      console.warn("Copy failed:", error);
      setCopiedText(null);
      return false;
    }
  }, []);

  return [copiedText, copy];
}
