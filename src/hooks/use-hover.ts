// hooks/useHover.ts
import { useState } from "react";

export function useHover() {
  const [hover, setHover] = useState<boolean>(false);

  const handleMouseOver = () => setHover(true);
  const handleMouseOut = () => setHover(false);

  return {
    hover,
    handleMouseOver,
    handleMouseOut,
  };
}
