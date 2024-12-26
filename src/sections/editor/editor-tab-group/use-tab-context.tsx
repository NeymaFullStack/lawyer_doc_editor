"use client";

import { useContext, createContext, useState } from "react";

export const defaultAvatar = "/favicon/favicon-32x32.png";

export interface Comment {
  comment_id: string;
  document_id: string;
  avatar?: string;
  name?: string;
  content: string;
  date?: string;
  time?: string;
  status: "ACTIVE" | "ARCHIVED";
  replies?: Reply[];
}

export interface Reply {
  avatar?: string;
  name?: string;
  date?: string;
  time?: string;
  content: string;
}

type TabContextType = {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  selected: string | null;
  setSelected: (selected: string | null) => void;
  showPreview: boolean;
  setShowPreview: (showPreview: boolean) => void;
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
};

export const TabContext = createContext({} as TabContextType);

export const TabProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>("Chatai");
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [comments, setComments] = useState<Comment[]>([]);

  return (
    <TabContext.Provider
      value={{
        isOpen,
        setOpen,
        selected,
        setSelected,
        showPreview,
        setShowPreview,
        comments,
        setComments,
      }}
    >
      {children}
    </TabContext.Provider>
  );
};

export const useTabContext = () => {
  const context = useContext(TabContext);

  if (!context) throw new Error("useTabContext must be use inside TabProvider");

  return context;
};
