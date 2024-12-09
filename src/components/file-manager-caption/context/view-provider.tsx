"use client";
import { getStorage, setStorage } from "@/hooks/use-local-storage";
import { ViewType } from "../types";
import { useEffect, useState } from "react";
import { ViewContext } from "./view-context";

type ViewProviderProps = {
  children: React.ReactNode;
  defaultView: ViewType;
};

const STORAGE_KEY = "view";

export function ViewProvider({ children, defaultView }: ViewProviderProps) {
  const initialView = getStorage(STORAGE_KEY);
  const [view, setView] = useState<ViewType>(initialView ?? defaultView);

  useEffect(() => {
    setStorage(STORAGE_KEY, view);
  }, [initialView, view]);

  return (
    <ViewContext.Provider value={{ view, setView }}>
      {children}
    </ViewContext.Provider>
  );
}
