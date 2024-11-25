"use client";

import { useMemo } from "react";
import axios, { endpoints } from "@/lib/axios";
import { ClientGridManager } from "@/components/file-manager/client-manager-grid";
import { FolderItemType } from "@/components/file-manager/type";
import { useViewContext } from "@/components/file-manager-caption/context";
import { ClientManagerTable } from "@/components/file-manager/client-manager-table";
import { useFetcher } from "@/hooks/use-fetcher";

const fetchClientFolders = async (): Promise<FolderItemType[]> => {
  const res = await axios.get(endpoints.folder.clients);
  return res.data;
};

export const ClientFoldersView = () => {
  const { view } = useViewContext();

  // Fetch clients using useFetcher
  const { data: clients, loading } = useFetcher(fetchClientFolders, []);

  // Prepare the component based on the view type
  const renderClientFolders = useMemo(() => {
    if (view === "grid") {
      return (
        <ClientGridManager
          dataSource={clients ?? []}
          caption="Client Folders"
          loading={loading}
        />
      );
    }

    return (
      <ClientManagerTable
        dataSource={clients ?? []}
        caption="Client Folders"
        loading={loading}
      />
    );
  }, [view, clients, loading]);

  return <>{renderClientFolders}</>;
};
