import {
  getClientFolderList,
  getFolderDetails,
} from "@/api/clientSideServiceActions/dashboardServiceActions";
import RemSizeImage from "@/components/generic/RemSizeImage";
import React, { useEffect, useState } from "react";

function EmplacementFoldersList({
  client,
  parentFolderId,
  onClickFolder,
  selectedFolder,
}) {
  const [folderList, setFolderList] = useState(null);
  useEffect(() => {
    client ? fetchClientList() : fetchFolderList();
  }, [parentFolderId]);
  return (
    <ul className={`h-full flex-1 overflow-x-hidden overflow-y-scroll `}>
      {folderList ? (
        folderList?.map((folder, index) => {
          return (
            <li
              key={index}
              className={`flex cursor-pointer items-center gap-3 rounded-md px-1 py-2 pl-2 hover:bg-six ${folder?.id === selectedFolder ? "bg-six" : ""}`}
              onClick={() => onClickFolder(folder, parentFolderId, client)}
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
              <span className="w-[4rem] overflow-hidden text-nowrap text-xs font-medium text-black-txt">
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
  }
  async function fetchFolderList() {
    const res = await getFolderDetails({ id: parentFolderId });
    if (res.sub_projects?.length > 0) {
      setFolderList(res.sub_projects);
    }
    if (res.sub_projects?.length === 0) {
      setFolderList(null);
    }
  }
}

export default EmplacementFoldersList;
