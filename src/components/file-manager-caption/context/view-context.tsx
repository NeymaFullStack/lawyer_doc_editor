"use client";

import { useContext, createContext } from "react";

import { ViewContextProps } from "../types";

// ----------------------------------------------------------------------

export const ViewContext = createContext({} as ViewContextProps);

export const useViewContext = () => {
  const context = useContext(ViewContext);

  if (!context)
    throw new Error("useViewContext must be use inside ViewProvider");

  return context;
};
