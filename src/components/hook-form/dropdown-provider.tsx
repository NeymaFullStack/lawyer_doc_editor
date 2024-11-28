// DropdownContext.tsx
import React, { createContext, ReactNode, useContext, useState } from "react";

// Define the shape of the context data
interface DropdownContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create the context with default value
const DropdownContext = createContext<DropdownContextType | undefined>(
  undefined
);

// Create a custom hook for easier consumption of the context
export const useDropdown = (): DropdownContextType => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error("useDropdown must be used within a DropdownProvider");
  }
  return context;
};

type DropdownProviderProps = {
  children: ReactNode;
};
export const DropdownProvider: React.FC<DropdownProviderProps> = ({
  children,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      {children}
    </DropdownContext.Provider>
  );
};
