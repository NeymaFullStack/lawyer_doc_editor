"use client";

import { useContext, createContext } from "react";

import { DocumentContextType } from "./type";

// ----------------------------------------------------------------------

export const DocumentContext = createContext({} as DocumentContextType);

export const useDocumentContext = () => {
  const context = useContext(DocumentContext);

  if (!context)
    throw new Error("useDocumentContext must be use inside DocumentProvider");

  return context;
};
