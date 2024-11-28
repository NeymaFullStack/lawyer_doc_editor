"use client";
import { useCallback, useEffect, useState } from "react";
import { useDocumentContext } from "../document";
import { Header } from "./header";
import { FolderHierarchyType } from "@/components/folder-navigator/type";
import axios, { endpoints } from "@/lib/axios";
import { FolderNavigator } from "@/components/folder-navigator/folder-navigator";
import { DropdownProvider } from "@/components/hook-form/dropdown-provider";

type DocumentLayoutProps = {
  children: React.ReactNode;
  id: string;
};

const fetchFolderHierarchy = async (
  folderId: string
): Promise<FolderHierarchyType[]> => {
  const endpoint = `${endpoints.folder.folderHierarchy}${folderId}`;
  const response = await axios.get(endpoint);
  return response.data.data;
};

export const EditorLayout = ({ children, id }: DocumentLayoutProps) => {
  const { fetchDocument, document } = useDocumentContext();
  const [path, setPath] = useState<FolderHierarchyType[] | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPath = useCallback(async (projectId: string) => {
    if (!projectId) return;
    setLoading(true);
    try {
      const data = await fetchFolderHierarchy(projectId);
      setPath(data);
    } catch (error) {
      console.error("Failed to fetch folder hierarchy:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocument(id);
  }, [id, fetchDocument]);

  useEffect(() => {
    if (document?.project_id) {
      fetchPath(document.project_id);
    }
  }, [document?.project_id, fetchPath]);

  return (
    <DropdownProvider>
      <div className="w-full h-screen min-h-screen max-h-screen pr-6">
        <div className="flex flex-col items-stretch gap-5 h-full self-stretch pt-8">
          <Header />
          <FolderNavigator paths={path ?? []} loading={loading} />
          <div className="grow">{children}</div>
        </div>
      </div>
    </DropdownProvider>
  );
};
