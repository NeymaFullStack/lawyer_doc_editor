"use client";

import { useViewContext } from "@/components/file-manager-caption/context";
import { FileManagerCaption } from "@/components/file-manager-caption/file-manager-caption";
import { FolderGridManager } from "@/components/file-manager/folder-manager-grid";
import { DocumentGridManager } from "@/components/file-manager/document-manager-grid";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FolderNavigator } from "@/components/folder-navigator/folder-navigator";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icons";
import LoadingScreen from "@/components/loading-screen/loading-screen";
import { useFetcher } from "@/hooks/use-fetcher";
import {
  FolderItemType,
  ManagerItemType,
} from "@/components/file-manager/type";
import { FolderHierarchyType } from "../../components/folder-navigator/type";
import { iconColors } from "../../../tailwind.config";
import axios, { endpoints } from "@/lib/axios";
import { FolderManagerTable } from "@/components/file-manager/folder-manager-table";
import { cn } from "@/lib/utils";

type FolderViewProps = {
  folderId: string;
};

const fetchFolderData = async (folderId: string): Promise<FolderItemType> => {
  const endpoint = `${endpoints.folder.folder}${folderId}`;
  const response = await axios.get(endpoint);
  return response.data;
};

const fetchFolderHierarchy = async (
  folderId: string
): Promise<FolderHierarchyType[]> => {
  const endpoint = `${endpoints.folder.folderHierarchy}${folderId}`;
  const response = await axios.get(endpoint);
  return response.data.data;
};

export const FolderView = ({ folderId }: FolderViewProps) => {
  const { view } = useViewContext();

  const {
    data: folder,
    loading: folderLoading,
    error: folderError,
  } = useFetcher(() => fetchFolderData(folderId), [folderId]);

  const {
    data: folderHierarchy,
    loading: hierarchyLoading,
    error: hierarchyError,
  } = useFetcher(() => fetchFolderHierarchy(folderId), [folderId]);

  const loading = folderLoading || hierarchyLoading;

  const renderGridContent = () => {
    const hasSubProjects = !!folder?.sub_projects?.length;
    const hasDocuments = !!folder?.documents?.length;

    if (hasSubProjects && hasDocuments) {
      return (
        <>
          <FolderGridManager
            dataSource={folder.sub_projects ?? []}
            caption="Folders"
          />
          <DocumentGridManager
            dataSource={folder.documents ?? []}
            caption="Documents"
          />
        </>
      );
    }
    if (hasSubProjects) {
      return (
        <FolderGridManager
          dataSource={folder.sub_projects ?? []}
          caption="Folders"
        />
      );
    }
    if (hasDocuments) {
      return (
        <DocumentGridManager
          dataSource={folder.documents ?? []}
          caption="Documents"
        />
      );
    }
    return <EmptyFolderView />;
  };

  const createTableDataSource = (): ManagerItemType[] => {
    const subProjects =
      folder?.sub_projects?.map((folder) => ({
        id: folder.id,
        title: folder.title,
        type: "folder" as const,
        updated_at: folder.updated_at,
      })) ?? [];

    const documents =
      folder?.documents?.map((document) => ({
        id: document.id,
        title: document.document_name,
        type: "document" as const,
        updated_at: document.updated_at,
      })) ?? [];

    return [...subProjects, ...documents];
  };

  const renderTableContent = () => {
    const dataSource = createTableDataSource();
    return dataSource.length ? (
      <FolderManagerTable caption={""} dataSource={dataSource} />
    ) : (
      <EmptyFolderView />
    );
  };

  const renderContent = () => {
    if (loading || hierarchyError || folderError)
      return <LoadingScreen className="h-[calc(100vh-240px)]" />;

    return view === "grid" ? renderGridContent() : renderTableContent();
  };

  return (
    <div className="h-screen min-h-screen max-h-screen">
      <div className="flex flex-col items-stretch gap-4 h-full self-stretch min-h-screen">
        <FileManagerCaption
          placeholder="Search a client, document..."
          color={iconColors.from}
        />
        <FolderNavigator
          paths={folderHierarchy || []}
          loading={hierarchyLoading}
        />
        <ScrollArea
          className={cn(
            "bg-logan-primary-200 rounded-tl-xl border-t border-l border-logan-primary-300",
            {
              "h-[calc(100vh-128px)]": !hierarchyLoading,
            },
            { "h-[calc(100vh-80px)]": hierarchyLoading }
          )}
        >
          <div className="grow py-10 px-10  flex flex-col items-stretch gap-12 pb-4">
            {renderContent()}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

const EmptyFolderView = () => (
  <div
    className={cn(
      "w-full h-full flex flex-col items-center justify-center gap-14 m-auto",
      "h-[calc(100vh-200px)]"
    )}
  >
    <div>
      <img src="/assets/trash.png" alt="Trash" />
    </div>
    <div className="flex flex-col items-center gap-5">
      <div className="flex flex-col items-center gap-2 text-logan-black-foreground">
        <h3 className="m-0 text-lg font-semibold">This folder is empty.</h3>
        <span className="text-base text-center">
          Start adding Folders or Documents.
        </span>
      </div>
      <Button className="rounded-xl !bg-primary-gradient flex items-center px-4 py-2.5">
        <span className="aspect-square size-6 bg-white p-1 flex justify-center items-center rounded-md">
          <Icon iconName="plus" fill={iconColors.from} />
        </span>
        <span className="text-white text-sm font-bold">New Document</span>
      </Button>
    </div>
  </div>
);
