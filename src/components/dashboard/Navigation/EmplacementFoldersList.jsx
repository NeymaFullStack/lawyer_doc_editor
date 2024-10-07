import {
  getClientFolderList,
  getFolderDetails,
} from "@/api/clientSideServiceActions/dashboardServiceActions";
import Loader from "@/components/generic/Loader";
import RemSizeImage from "@/components/generic/RemSizeImage";
import { cn } from "@/utils/shadcn-utils";
import { current } from "@reduxjs/toolkit";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function EmplacementFoldersList({
  client,
  parentFolderId,
  onClickFolder,
  selectedFolder,
  selectedMovableFolderDocIds = [],
}) {
  const [folderList, setFolderList] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentClient = useSelector(
    (state) => state.folderNavigationReducer.currentClient,
  );
  console.log("currentClient", currentClient);
  useEffect(() => {
    client ? fetchClientList() : fetchFolderList();
  }, [parentFolderId]);
  console.log("selectedMovableFolderDocIds", selectedMovableFolderDocIds);
  return (
    <ul
      className={cn(
        "h-full flex-1 overflow-x-hidden overflow-y-scroll",
        loading && "flex items-center justify-center",
      )}
    >
      {loading && <Loader />}
      {folderList || loading ? (
        folderList?.map((folder, index) => {
          return (
            <li
              key={index}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-md px-1 py-2 pl-2 hover:bg-six",
                folder?.id === selectedFolder?.id && "bg-six ",
                (selectedMovableFolderDocIds.includes(folder.id) ||
                  (client &&
                    currentClient !== null &&
                    currentClient?.id !== folder.id)) &&
                  "cursor-default opacity-50 hover:bg-white",
              )}
              onClick={() => {
                selectedMovableFolderDocIds.includes(folder.id) ||
                (client &&
                  currentClient !== null &&
                  currentClient?.id !== folder.id)
                  ? () => {}
                  : onClickFolder(folder, parentFolderId, client);
              }}
            >
              <RemSizeImage
                imagePath={
                  !client
                    ? "/assets/icons/non-client-folder.svg"
                    : "/assets/icons/client-folder.svg"
                }
                remWidth={1.1}
                remHeight={1.1}
                alt={"Client Folder"}
              />
              <span
                className={cn(
                  "truncate text-nowrap text-xs font-medium text-black-txt",
                )}
              >
                {folder?.title}
              </span>
            </li>
          );
        })
      ) : (
        <li className="pl-5">0 Folders</li>
      )}
    </ul>
  );

  async function fetchClientList() {
    const clientFolderList = await getClientFolderList();
    if (clientFolderList?.length > 0) {
      setFolderList(clientFolderList);
    }
    setLoading(false);
  }
  async function fetchFolderList() {
    const res = await getFolderDetails({ id: parentFolderId });
    if (res.sub_projects?.length > 0) {
      setFolderList(res.sub_projects);
    }
    if (res.sub_projects?.length === 0) {
      setFolderList(null);
    }
    setLoading(false);
  }
}

export default EmplacementFoldersList;
