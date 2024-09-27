"use client";
import Sort from "@/components/generic/Sort";
import { sortStringTableList } from "@/utils/generic";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import RenameModal from "./RenameModal";

import { navigationItemTypes } from "@/constants/enums";
import ChooseEmplacementModal from "./ChooseEmplacementModal";
import { toast } from "sonner";

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
  const [openMoveItemsModal, setOpenMoveItemsModal] = useState(false);

  const [openDeleteConfirmationModal, setOpenDeleteConfirmationModal] =
    useState(false);
  const [contextMenuActiveId, setContextMenuActiveId] = useState(0);
  const [selectedItemsRenameDetails, setItemsRenameDetails] = useState(null);
  const [multipleSelectedItems, setMultipleSelectedItems] = useState({
    selectedFolders: [],
    selectedDocs: [],
  });
  const [moveItemsMetadata, setMoveItemsMetadata] = useState({
    emplacement: { selectedFolder: null, path: new Map() },
  });
  const selectMultiple = useRef(false);
  const handleKeyDown = (e) => {
    if (e.metaKey || e.ctrlKey) {
      selectMultiple.current = true;
    }
  };

  const handleKeyUp = (e) => {
    if (!e.metaKey && !e.ctrlKey) {
      selectMultiple.current = false;
    }
  };

  useEffect(() => {
    isDashboard ? fetchClientList() : fetchFolderList();
  }, [refreshDirectory]);

  useEffect(() => {
    appDispatch(documentVersioningAction.resetDocumentVersion());
    appDispatch(documentAction.resetDocumentSlice());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const clearSelection = () => {
    !openDeleteConfirmationModal &&
      !openRenameModal &&
      !openMoveItemsModal &&
      setMultipleSelectedItems({
        selectedFolders: [],
        selectedDocs: [],
      });
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      const target = event.target;
      const isFolder = target.closest('[aria-description="folder"]');
      const isDocument = target.closest('[aria-description="document"]');

      if (!isFolder && !isDocument) {
        clearSelection();
      }
    };

    window.addEventListener("click", handleOutsideClick);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [clearSelection]);

  console.log("totalItems", multipleSelectedItems);

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
      <DeleteConfirmationModal
        open={openDeleteConfirmationModal}
        onClose={() => {
          setOpenDeleteConfirmationModal(false);
        }}
        onConfirm={() => {
          toast.custom(
            (t) => (
              <div className="rounded-md bg-overlay px-3 py-4 text-xs  text-white">
                <span>“Compliance EU Regulation” has been deleted. </span>
                <span className="cursor-pointer font-bold underline">
                  {"Undo"}
                </span>
              </div>
            ),
            { duration: 5000, style: { width: "20.5rem" } },
          );
          setOpenDeleteConfirmationModal(false);
        }}
      />
      <ChooseEmplacementModal
        onConfirm={() => {
          toast.custom(
            (t) => (
              <div className="rounded-md bg-overlay px-3 py-4 text-xs  text-white">
                <span>
                  “Compliance EU Regulation” has been moved to the
                  “Post-Restructuring Op.” folder.{" "}
                </span>
                <span className="cursor-pointer font-bold underline">
                  {"Go to Folder"}
                </span>
              </div>
            ),
            { duration: 5000, style: { width: "36rem" } },
          );
          setOpenMoveItemsModal(false);
        }}
        type={"MOVETO"}
        open={openMoveItemsModal}
        onClose={() => {
          setOpenMoveItemsModal(false);
        }}
        saveDocFolderFieldValues={saveDocFolderFieldValues}
        formValues={moveItemsMetadata}
        moveMetaData={{
          noOfFiles:
            multipleSelectedItems.selectedDocs.length +
            multipleSelectedItems.selectedFolders.length,
        }}
      />
      {!loading && !folderListView && (
        <div className="flex w-full flex-col gap-4 ">
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
                      onOpenChange={(open) => {
                        !multipleSelectedItems?.selectedFolders?.find(
                          (item, index) => {
                            return item?.id === folder?.id;
                          },
                        ) &&
                          setMultipleSelectedItems({
                            selectedDocs: [],
                            selectedFolders: [folder],
                          });
                        open
                          ? setContextMenuActiveId(folder?.id)
                          : setContextMenuActiveId(0);
                      }}
                      contextMenuItems={directoryContextMenuList({
                        isMultipleSelected:
                          multipleSelectedItems.selectedDocs.length +
                            multipleSelectedItems.selectedFolders.length >
                          1,
                        onClickRename: () =>
                          onCLickRenameItem(navigationItemTypes.FOLDER),
                        onClickOpen: () => {
                          router.push(`/dashboard/${folder.id}`);
                        },
                        onClickMoveTo: () => {
                          // call download api

                          setOpenMoveItemsModal(true);
                        },
                        onCLickDelete: () => {
                          setOpenDeleteConfirmationModal(true);
                        },
                      })}
                    >
                      <DocFolder
                        nonClient={!isDashboard}
                        onDoubleClick={(folder) =>
                          router.push(`/dashboard/${folder.id}`)
                        }
                        folder={folder}
                        contextMenuActiveId={contextMenuActiveId}
                        selectedFolders={multipleSelectedItems?.selectedFolders}
                        onSingleClickOnFolder={onSingleClickOnFolder}
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
              directoryData?.documentsList.map((doc, index) => {
                return (
                  <li key={doc?.id}>
                    <LoganContextMenu
                      onOpenChange={(open) => {
                        !multipleSelectedItems?.selectedDocs.find(
                          (item, index) => {
                            return item?.id === doc?.id;
                          },
                        ) &&
                          setMultipleSelectedItems({
                            selectedDocs: [doc],
                            selectedFolders: [],
                          });
                        open
                          ? setContextMenuActiveId(doc?.id)
                          : setContextMenuActiveId(0);
                      }}
                      contextMenuItems={directoryContextMenuList({
                        isMultipleSelected:
                          multipleSelectedItems.selectedDocs.length +
                            multipleSelectedItems.selectedFolders.length >
                          1,
                        onClickRename: () =>
                          onCLickRenameItem(navigationItemTypes.DOCUMENT),
                        onClickOpen: () => {
                          router.push(`/dashboard/doc-edit/${doc.id}`);
                        },
                        onClickMoveTo: () => {
                          // call download api

                          setOpenMoveItemsModal(true);
                        },
                        onCLickDelete: () => {
                          // call delete api

                          setOpenDeleteConfirmationModal(true);
                        },
                      })}
                    >
                      <DocFile
                        onDoubleClick={() =>
                          router.push(`/dashboard/doc-edit/${doc.id}`)
                        }
                        doc={doc}
                        nonClient
                        contextMenuActiveId={contextMenuActiveId}
                        selectedDocs={multipleSelectedItems?.selectedDocs}
                        onSingleClickOnDoc={onSingleClickOnDoc}
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
          selectedFolders={multipleSelectedItems?.selectedFolders}
          selectedDocs={multipleSelectedItems?.selectedDocs}
          onOpenChange={(open, row) => {
            row?.version
              ? !multipleSelectedItems?.selectedDocs.find((item, index) => {
                  return item?.id === row?.id;
                }) &&
                setMultipleSelectedItems({
                  selectedDocs: [row],
                  selectedFolders: [],
                })
              : !multipleSelectedItems?.selectedFolders.find((item, index) => {
                  return item?.id === row?.id;
                }) &&
                setMultipleSelectedItems({
                  selectedDocs: [],
                  selectedFolders: [row],
                });

            open ? setContextMenuActiveId(row?.id) : setContextMenuActiveId(0);
          }}
          contextMenuItems={directoryContextMenuList({
            isMultipleSelected:
              multipleSelectedItems.selectedDocs.length +
                multipleSelectedItems.selectedFolders.length >
              1,
            onClickRename: () => {
              let item =
                multipleSelectedItems.selectedFolders[0] ||
                multipleSelectedItems.selectedDocs[0];
              onCLickRenameItem(
                item?.version
                  ? navigationItemTypes.DOCUMENT
                  : navigationItemTypes.FOLDER,
              );
            },
            onClickOpen: () => {
              let item =
                multipleSelectedItems.selectedFolders[0] ||
                multipleSelectedItems.selectedDocs[0];
              item?.version
                ? router.push(`/dashboard/doc-edit/${item.id}`)
                : router.push(`/dashboard/${item.id}`);
            },
            onClickMoveTo: () => {
              setOpenMoveItemsModal(true);
            },
            onCLickDelete: () => {
              setOpenDeleteConfirmationModal(true);
            },
          })}
          enableContextMenu
          onDoubleClickRow={(row) => {
            row?.version ? onDoubleClickDoc(row) : onDoubleClickFolder(row);
          }}
          onClickRow={(row) => {
            row?.version ? onSingleClickOnDoc(row) : onSingleClickOnFolder(row);
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
        foldersList: sortStringTableList(clientFolderList, "ascend", "title"),
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

  function onDoubleClickFolder(folder) {
    folder?.id && router.push(`${dashboardRoute}/${folder?.id}`);
  }

  function onDoubleClickDoc(doc) {
    router.push(`/dashboard/doc-edit/${doc.id}`);
  }

  function onSingleClickOnFolder(folder) {
    let foundIndex = multipleSelectedItems.selectedFolders.findIndex(
      (id) => id === folder,
    );
    let selectionData = { ...multipleSelectedItems };
    if (foundIndex !== -1) {
      if (selectMultiple.current) {
        selectionData.selectedFolders.splice(foundIndex, 1);
      } else {
        selectionData.selectedFolders = [];
      }
    } else {
      if (selectMultiple.current) {
        selectionData.selectedFolders.push(folder);
      } else {
        selectionData.selectedFolders = [folder];
      }
    }
    setMultipleSelectedItems(selectionData);
  }

  function onSingleClickOnDoc(doc) {
    let foundIndex = multipleSelectedItems.selectedDocs.findIndex(
      (id) => id === doc,
    );
    let selectionData = { ...multipleSelectedItems };
    if (foundIndex !== -1) {
      if (selectMultiple.current) {
        selectionData.selectedDocs.splice(foundIndex, 1);
      } else {
        selectionData.selectedDocs = [];
      }
    } else {
      if (selectMultiple.current) {
        selectionData.selectedDocs.push(doc);
      } else {
        selectionData.selectedDocs = [doc];
      }
    }
    setMultipleSelectedItems(selectionData);
  }

  function onCLickRenameItem(type) {
    let item =
      multipleSelectedItems.selectedFolders[0] ||
      multipleSelectedItems.selectedDocs[0];
    setOpenRenameModal(true);
    setItemsRenameDetails({
      itemId: item?.id,
      itemType: type,
      currentName: item?.title,
    });
  }

  function saveDocFolderFieldValues(values) {
    setMoveItemsMetadata({
      ...moveItemsMetadata,
      ...values,
    });
  }
}

export default Directory;
