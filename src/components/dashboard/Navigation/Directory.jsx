"use client";
import Sort from "@/components/generic/Sort";
import { sortStringTableList } from "@/utils/generic";
import React, { useEffect, useState } from "react";
import DocFolder from "./DocFolder";
import { onClickFolder } from "@/utils/dashboard/navigation-utils";

import { useParams, usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import DocFile from "./DocFile";
import { folderNavigationAction } from "@/redux/folderNavigationSlice";
import {
  clientFoldersListTableColumns,
  foldersListTableColumns,
} from "@/constants/tableColumns/dashboardTableColumns";
import LoganTable from "@/components/generic/LoganTable";
import { documentVersioningAction } from "@/redux/editor/documentVersioningSlice";
import { documentAction } from "@/redux/documentSlice";
import CreateFolderModal from "./CreateFolderModal";
import { modalType } from "./FolderDocCreation";
import {
  getClientFolderList,
  getFolderDetails,
} from "@/api/clientSideServiceActions/dashboardServiceActions";

function Directory({ client = false }) {
  const appDispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const { folderListView, openModalType, refreshDirectory } = useSelector(
    (state) => state.folderNavigationReducer,
  );
  const { slug } = useParams();
  const [directoryData, setDirectoryData] = useState({
    listData: [],
    foldersList: [],
    documentsList: [],
  });

  useEffect(() => {
    client ? fetchClientList() : fetchFolderList();
  }, [refreshDirectory]);

  useEffect(() => {
    appDispatch(documentVersioningAction.resetDocumentVersion());
    appDispatch(documentAction.resetDocumentSlice());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex w-full flex-col gap-6">
      {openModalType === modalType.NEW_FOLDER && (
        <CreateFolderModal
          open={openModalType === modalType.NEW_FOLDER}
          onClose={() => {
            appDispatch(folderNavigationAction.setOpenModalType(""));
          }}
          parentFolderId={slug[slug.length - 1]}
        />
      )}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          {client ? (
            <h2 className="font-semibold text-black ">Client Folders</h2>
          ) : (
            <>
              {!folderListView && (
                <h2 className="font-semibold text-black ">Folders</h2>
              )}
            </>
          )}
          {!folderListView && (
            <Sort
              onClickSort={(sortOrder) => {
                setDirectoryData({
                  ...directoryData,
                  foldersList: sortStringTableList(
                    directoryData?.foldersList,
                    sortOrder,
                    "title",
                  ),
                });
              }}
              title={"Name"}
            />
          )}
        </div>
        {!folderListView && (
          <div className="grid grid-cols-6 gap-x-6 gap-y-5">
            {directoryData?.foldersList?.map((folder, index) => {
              return (
                <DocFolder
                  nonClient={!client}
                  onClickFolder={(folder) =>
                    onClickFolder(folder, pathname, router)
                  }
                  key={folder?.id}
                  folder={folder}
                />
              );
            })}
          </div>
        )}
      </div>

      {!folderListView && !client && (
        <div className="flex w-full flex-col gap-4">
          <div className="flex items-center gap-4">
            <h2 className="font-semibold text-black ">Documents</h2>
            <Sort
              onClickSort={(sortOrder) => {
                setDirectoryData({
                  ...directoryData,
                  documentsList: sortStringTableList(
                    directoryData.documentsList,
                    sortOrder,
                    "title",
                  ),
                });
              }}
              title={"Name"}
            />
          </div>
          <div className="grid grid-cols-5 gap-x-6 gap-y-7">
            {directoryData?.documentsList?.length > 0 &&
              directoryData?.documentsList.map((file, index) => {
                return (
                  <DocFile
                    onClickDoc={onClickDoc}
                    doc={file}
                    nonClient
                    key={index}
                  />
                );
              })}
          </div>
        </div>
      )}
      {folderListView && directoryData?.listData.length > 0 && (
        <LoganTable
          onClickRow={(folder) => onClickFolder(folder, pathname, router)}
          tableColumns={
            client
              ? clientFoldersListTableColumns(
                  setDirectoryData,
                  directoryData?.listData,
                )
              : foldersListTableColumns(
                  setDirectoryData,
                  directoryData?.listData,
                )
          }
          rowKey="id"
          className=" -mt-6 w-full"
          listData={directoryData?.listData}
        />
      )}
    </div>
  );

  async function fetchClientList() {
    const clientFolderList = await getClientFolderList();
    if (clientFolderList?.length > 0) {
      setDirectoryData({
        ...directoryData,
        foldersList: clientFolderList,
        listData: clientFolderList,
      });
    }
  }

  async function fetchFolderList() {
    const res = await getFolderDetails({ id: slug[slug.length - 1] });
    if (res?.sub_projects?.length || res?.documents?.length > 0) {
      setDirectoryData({
        ...directoryData,
        foldersList: res.sub_projects,
        documentsList: res?.documents,
        listData: [...res.sub_projects, res?.documents],
      });
    }
  }

  function onClickDoc(doc) {
    appDispatch(folderNavigationAction.setBreadCrumbs(slug));
    router.push(`/dashboard/doc-edit/${doc.id}`);
  }
}

export default Directory;
