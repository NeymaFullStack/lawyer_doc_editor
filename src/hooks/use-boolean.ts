import { useState, useCallback } from "react";

interface ReturnType {
  value: boolean;
  onTrue: () => void;
  onFalse: () => void;
  onToggle: () => void;
  setValue: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useBoolean(defaultValue?: boolean): ReturnType {
  const [value, setvalue] = useState(!!defaultValue);

  const onTrue = useCallback(() => setvalue(true), []);

  const onFalse = useCallback(() => setvalue(false), []);

  const onToggle = useCallback(() => setvalue((v) => !v), []);

  return { value, onTrue, onFalse, onToggle, setValue: setvalue };
}
