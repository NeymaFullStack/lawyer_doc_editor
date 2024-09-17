"use client";
import Sort from "@/components/generic/Sort";
import { sortStringTableList } from "@/utils/generic";
import React, { useEffect, useState } from "react";
import DocFolder from "./DocFolder";

import { useParams, useRouter } from "next/navigation";
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
import { dashboardRoute } from "@/constants/routes";
import LoganContextMenu from "@/components/generic/LoganContextMenu";
import { directoryContextMenuList } from "@/constants/list";
import RenameModal from "./RenameModal";
import { navigationItemTypes } from "@/constants/enums";

function Directory({
  isDashboard = false,
  setLoading,
  loading,
  setIsFolderClient,
}) {
  const appDispatch = useDispatch();
  const router = useRouter();
  const { folderListView, openModalType, refreshDirectory } = useSelector(
    (state) => state.folderNavigationReducer,
  );
  const { folderId } = useParams();
  const [directoryData, setDirectoryData] = useState({
    listData: [],
    foldersList: [],
    documentsList: [],
  });
  const [openRenameModal, setOpenRenameModal] = useState(false);
  const [contextMenuActiveId, setContextMenuActiveId] = useState(0);
  const [selectedItemsRenameDetails, setItemsRenameDetails] = useState(null);

  useEffect(() => {
    isDashboard ? fetchClientList() : fetchFolderList();
  }, [refreshDirectory]);

  useEffect(() => {
    appDispatch(documentVersioningAction.resetDocumentVersion());
    appDispatch(documentAction.resetDocumentSlice());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-full w-full flex-col items-start gap-6">
      {openModalType === modalType.NEW_FOLDER && (
        <CreateFolderModal
          open={openModalType === modalType.NEW_FOLDER}
          onClose={() => {
            appDispatch(folderNavigationAction.setOpenModalType(""));
          }}
          parentFolderId={folderId}
        />
      )}
      <RenameModal
        open={openRenameModal}
        onClose={() => {
          setOpenRenameModal(false);
          setItemsRenameDetails(null);
        }}
        currentName={selectedItemsRenameDetails?.currentName}
        itemType={selectedItemsRenameDetails?.itemType}
        itemId={selectedItemsRenameDetails?.itemId}
      />
      {!loading && !folderListView && (
        <div className="flex w-full flex-col gap-4">
          <div className="flex items-center gap-4">
            {isDashboard ? (
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
            <ul className="grid grid-cols-4 gap-x-6 gap-y-5">
              {directoryData?.foldersList?.map((folder, index) => {
                return (
                  <li key={folder?.id}>
                    <LoganContextMenu
                      onOpenChange={(open) =>
                        open
                          ? setContextMenuActiveId(folder?.id)
                          : setContextMenuActiveId(0)
                      }
                      contextMenuItems={directoryContextMenuList(
                        router,
                        folder,
                        () => {
                          setOpenRenameModal(true);
                          setItemsRenameDetails({
                            itemId: folder?.id,
                            itemType: navigationItemTypes.FOLDER,
                            currentName: folder?.title,
                          });
                        },
                      )}
                    >
                      <DocFolder
                        nonClient={!isDashboard}
                        onClickFolder={(folder) => onClickFolder(folder)}
                        folder={folder}
                        contextMenuActiveId={contextMenuActiveId}
                      />
                    </LoganContextMenu>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {!loading && !folderListView && !isDashboard && (
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
          <ul className="grid grid-cols-5 gap-x-6 gap-y-7">
            {directoryData?.documentsList?.length > 0 &&
              directoryData?.documentsList.map((file, index) => {
                return (
                  <li key={file?.id}>
                    <LoganContextMenu
                      onOpenChange={(open) =>
                        open
                          ? setContextMenuActiveId(file?.id)
                          : setContextMenuActiveId(0)
                      }
                      contextMenuItems={directoryContextMenuList(
                        router,
                        file,
                        () => {
                          setOpenRenameModal(true);
                          setItemsRenameDetails({
                            itemId: file?.id,
                            itemType: navigationItemTypes.DOCUMENT,
                            currentName: file?.document_name,
                          });
                        },
                      )}
                    >
                      <DocFile
                        onClickDoc={onClickDoc}
                        doc={file}
                        nonClient
                        contextMenuActiveId={contextMenuActiveId}
                      />
                    </LoganContextMenu>
                  </li>
                );
              })}
          </ul>
        </div>
      )}
      {!loading && folderListView && directoryData?.listData.length > 0 && (
        <LoganTable
          onClickRow={(row) => {
            row?.version ? onClickDoc(row) : onClickFolder(row);
          }}
          tableColumns={
            isDashboard
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
          className="w-full table-fixed"
          listData={directoryData?.listData}
        />
      )}
    </div>
  );

  async function fetchClientList() {
    !loading && setLoading(false);
    const clientFolderList = await getClientFolderList();
    if (clientFolderList?.length > 0) {
      setDirectoryData({
        foldersList: clientFolderList,
        listData: clientFolderList,
      });
    }
    setLoading(false);
  }

  async function fetchFolderList() {
    !loading && setLoading(false);
    const res = await getFolderDetails({ id: folderId });
    if (res?.sub_projects?.length > 0 || res?.documents?.length > 0) {
      setDirectoryData({
        foldersList: sortStringTableList(res.sub_projects, "ascend", "title"),
        documentsList: res?.documents.map((doc, index) => {
          return { ...doc, title: doc.document_name };
        }),
        listData: [
          ...res.sub_projects,
          ...res?.documents.map((doc, index) => {
            return { ...doc, title: doc.document_name };
          }),
        ],
      });
      res?.parent_id === null && setIsFolderClient(true);
    }
    setLoading(false);
  }

  function onClickFolder(folder) {
    folder?.id && router.push(`${dashboardRoute}/${folder?.id}`);
  }

  function onClickDoc(doc) {
    router.push(`/dashboard/doc-edit/${doc.id}`);
  }
}

export default Directory;
