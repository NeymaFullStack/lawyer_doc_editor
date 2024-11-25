"use client";

import { useContext, createContext, useState } from "react";

type TabContextType = {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  selected: string | null;
  setSelected: (selected: string | null) => void;
};

export const TabContext = createContext({} as TabContextType);

export const TabProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <TabContext.Provider value={{ isOpen, setOpen, selected, setSelected }}>
      {children}
    </TabContext.Provider>
  );
};

export const useTabContext = () => {
  const context = useContext(TabContext);

  if (!context) throw new Error("useTabContext must be use inside TabProvider");

  return context;
};
