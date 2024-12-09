"use client";

import { useContext, createContext } from "react";

import { RefreshContextType } from "./type";

// ----------------------------------------------------------------------

export const RefreshContext = createContext({} as RefreshContextType);

export const useRefreshContext = () => {
  const context = useContext(RefreshContext);

  if (!context)
    throw new Error("useDocumentContext must be use inside DocumentProvider");

  return context;
};
