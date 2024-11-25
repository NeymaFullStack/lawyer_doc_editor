"use client";

import { useContext, createContext } from "react";
import { settingsContextProps } from "../types";

// ----------------------------------------------------------------------

export const SettingsContext = createContext<settingsContextProps>(
  {} as settingsContextProps
);

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);

  if (!context)
    throw new Error("useSettingsContext must be use inside SettingsProvider");

  return context;
};
