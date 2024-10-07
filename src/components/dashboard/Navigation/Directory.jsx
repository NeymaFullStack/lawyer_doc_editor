"use client";
import Sort from "@/components/generic/Sort";
import { sortStringTableList } from "@/utils/generic";
import React, { useEffect, useRef, useState } from "react";
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
  duplicateDocument,
  getClientFolderList,
  getFolderDetails,
  getRecentDocumentList,
  moveFolderDoc,
} from "@/api/clientSideServiceActions/dashboardServiceActions";
import { dashboardRoute } from "@/constants/routes";
import LoganContextMenu from "@/components/generic/LoganContextMenu";
import { directoryContextMenuList } from "@/constants/list";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import RenameModal from "./RenameModal";

import {
  navigationItemTypes,
  navigationSelectionItemsArea,
} from "@/constants/enums";
import ChooseEmplacementModal from "./ChooseEmplacementModal";
import { toast } from "sonner";
import Loader from "@/components/generic/Loader";
import RecentDocuments from "./RecentDocuments";
import Link from "next/link";

function Directory({ isDashboard = false }) {
  const appDispatch = useDispatch();
  const router = useRouter();
  const { folderListView, openModalType, refreshDirectory, currentClient } =
    useSelector((state) => state.folderNavigationReducer);
  const [loading, setLoading] = useState(true);
  const { folderId } = useParams();
  const [directoryData, setDirectoryData] = useState({
    listData: [],
    foldersList: [],
    documentsList: [],
  });

  const [recentDocuments, setRecentDocuments] = useState([]);
  const [openRenameModal, setOpenRenameModal] = useState(false);
  const [openMoveItemsModal, setOpenMoveItemsModal] = useState(false);
  const [selectionTrackingData, setSelectionTrackingData] = useState({
    previousSelectionArea: "",
    // currentSelectionArea: "",
    previousSelectionIndex: -1,
    // currentSelectionIndex: -1,
  });
  const [openDeleteConfirmationModal, setOpenDeleteConfirmationModal] =
    useState(false);
  const [selectedItemsRenameDetails, setItemsRenameDetails] = useState(null);
  const [multipleSelectedItems, setMultipleSelectedItems] = useState({
    selectedFolders: [],
    selectedDocs: [],
  });
  const [moveItemsMetadata, setMoveItemsMetadata] = useState({
    emplacement: { selectedFolder: null, path: new Map() },
  });
  const selectionKeys = useRef({ shift: false, ctrl: false });
  const handleKeyDown = (e) => {
    if (e.metaKey || e.ctrlKey) {
      selectionKeys.current = { shift: false, ctrl: true };
    } else if (e.key === "Shift") {
      selectionKeys.current = { shift: true, ctrl: false };
    }
  };

  const handleKeyUp = (e) => {
    if (!e.metaKey && !e.ctrlKey) {
      selectionKeys.current = { shift: false, ctrl: false };
    } else if (!(e.key === "Shift")) {
      selectionKeys.current = { shift: false, ctrl: false };
    }
  };

  useEffect(() => {
    isDashboard && appDispatch(folderNavigationAction.setCurrentClient(null));
  }, []);

  useEffect(() => {
    if (isDashboard) {
      fetchRecentDocuments();
      fetchClientList();
    } else {
      fetchFolderList();
    }
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
    setSelectionTrackingData({
      previousSelectionArea: "",
      previousSelectionIndex: -1,
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

  if (loading) {
    return <Loader />;
  }

  console.log("currentClient", currentClient);

  return (
    <div className="my-4 flex h-full flex-col gap-8 overflow-y-auto px-6 py-1 ">
      {isDashboard && (
        <RecentDocuments
          recentDocuments={recentDocuments}
          multipleSelectedItems={multipleSelectedItems}
          onSingleClickOnDoc={(doc, index) =>
            onSingleClickOnDoc(
              doc,
              index,
              navigationSelectionItemsArea.RECENT_DOCUMENTS,
            )
          }
          setMultipleSelectedItems={setMultipleSelectedItems}
          setOpenDeleteConfirmationModal={setOpenDeleteConfirmationModal}
          setOpenMoveItemsModal={setOpenMoveItemsModal}
          onClickRenameItem={onCLickRenameItem}
          onClickDuplicate={onDuplicateDoc}
        />
      )}
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
          setMultipleSelectedItems={setMultipleSelectedItems}
          multipleSelectedItems={multipleSelectedItems}
        />
        <ChooseEmplacementModal
          onConfirm={onMoveItemsConfirm}
          type={"MOVETO"}
          open={openMoveItemsModal}
          onClose={() => {
            setOpenMoveItemsModal(false);
          }}
          saveDocFolderFieldValues={saveDocFolderFieldValues}
          formValues={moveItemsMetadata}
          moveMetaData={{
            multipleSelectedItems: multipleSelectedItems,
            noOfFiles:
              multipleSelectedItems?.selectedDocs?.length +
              multipleSelectedItems?.selectedFolders?.length,
          }}
        />
        {!folderListView && (
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
                        }}
                        contextMenuItems={directoryContextMenuList({
                          disableDuplicate: true,
                          disableMoveTo:
                            isDashboard &&
                            multipleSelectedItems.selectedFolders.length > 0,
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
                          onClickDelete: () => {
                            setOpenDeleteConfirmationModal(true);
                          },
                        })}
                      >
                        <DocFolder
                          index={index}
                          nonClient={!isDashboard}
                          onDoubleClick={(folder) => {
                            isDashboard &&
                              appDispatch(
                                folderNavigationAction.setCurrentClient(folder),
                              );
                            router.push(`/dashboard/${folder.id}`);
                          }}
                          folder={folder}
                          selectedFolders={
                            multipleSelectedItems?.selectedFolders
                          }
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

        {!folderListView && !isDashboard && (
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
                        }}
                        contextMenuItems={directoryContextMenuList({
                          disableMoveTo:
                            isDashboard &&
                            multipleSelectedItems.selectedFolders.length > 0,
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
                          onClickDelete: () => {
                            // call delete api

                            setOpenDeleteConfirmationModal(true);
                          },
                          onClickDuplicate: onDuplicateDoc,
                        })}
                      >
                        <DocFile
                          index={index}
                          onDoubleClick={() =>
                            router.push(`/dashboard/doc-edit/${doc.id}`)
                          }
                          doc={doc}
                          nonClient
                          selectedDocs={multipleSelectedItems?.selectedDocs}
                          onSingleClickOnDoc={(doc, index) =>
                            onSingleClickOnDoc(
                              doc,
                              index,
                              navigationSelectionItemsArea.DOCUMENTS,
                            )
                          }
                        />
                      </LoganContextMenu>
                    </li>
                  );
                })}
            </ul>
          </div>
        )}
        {folderListView && directoryData?.listData.length > 0 && (
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
                : !multipleSelectedItems?.selectedFolders.find(
                    (item, index) => {
                      return item?.id === row?.id;
                    },
                  ) &&
                  setMultipleSelectedItems({
                    selectedDocs: [],
                    selectedFolders: [row],
                  });
            }}
            contextMenuItems={(item) =>
              directoryContextMenuList({
                disableDuplicate:
                  multipleSelectedItems.selectedFolders.length > 0,
                disableMoveTo:
                  isDashboard &&
                  multipleSelectedItems.selectedFolders.length > 0,
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
                onClickDelete: () => {
                  setOpenDeleteConfirmationModal(true);
                },
                onClickDuplicate: onDuplicateDoc,
              })
            }
            enableContextMenu
            onDoubleClickRow={(row) => {
              if (row?.version) {
                onDoubleClickDoc(row);
              } else {
                isDashboard &&
                  appDispatch(folderNavigationAction.setCurrentClient(row));
                onDoubleClickFolder(row);
              }
            }}
            onClickRow={(row, index) => {
              row?.version
                ? onSingleClickOnDoc(
                    row,
                    index,
                    navigationSelectionItemsArea.TABLE,
                  )
                : onSingleClickOnFolder(
                    row,
                    index,
                    navigationSelectionItemsArea.TABLE,
                  );
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
            className="w-full table-fixed select-none"
            listData={directoryData?.listData}
          />
        )}
      </div>
    </div>
  );

  async function fetchRecentDocuments() {
    const res = await getRecentDocumentList();
    let documents = [];
    if (res?.length > 0) {
      documents = res;
    }
    setRecentDocuments(documents);
  }

  async function fetchClientList() {
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
      // res?.parent_id === null && setIsFolderClient(true);
    } else {
      setDirectoryData({
        setDirectoryData: [],
        documentsList: [],
        listData: [],
      });
    }
    setLoading(false);
  }

  function onDoubleClickFolder(folder) {
    folder?.id && router.push(`${dashboardRoute}/${folder?.id}`);
  }

  function onDoubleClickDoc(doc) {
    router.push(`/dashboard/doc-edit/${doc.id}`);
  }

  function onSingleClickOnFolder(folder, index, area) {
    let selectionData = { ...multipleSelectedItems };
    let previousSelectionArea = selectionTrackingData.previousSelectionArea;
    let previousSelectionIndex = selectionTrackingData.previousSelectionIndex;
    let selectedFolderIds = multipleSelectedItems.selectedFolders.map(
      (item) => item.id,
    );
    let selectedDocIds = multipleSelectedItems.selectedDocs.map(
      (item) => item.id,
    );

    if (
      selectionKeys.current.shift &&
      previousSelectionArea &&
      previousSelectionIndex !== -1
    ) {
      let folderListSelectionSlice = [];

      if (previousSelectionArea === area && previousSelectionIndex !== index) {
        let folderDocSlicingList = folderListView
          ? directoryData.listData
          : directoryData.foldersList;
        if (previousSelectionIndex > index) {
          folderListSelectionSlice = folderDocSlicingList.slice(
            index,
            previousSelectionIndex,
          );
        } else {
          folderListSelectionSlice = folderDocSlicingList.slice(
            previousSelectionIndex + 1,
            index + 1,
          );
        }
        for (let item of folderListSelectionSlice) {
          if (item?.version) {
            if (!selectedDocIds.includes(item.id)) {
              selectionData.selectedDocs.push(item);
            }
          } else {
            if (!selectedFolderIds.includes(item.id)) {
              selectionData.selectedFolders.push(item);
            }
          }
        }
      }
      setMultipleSelectedItems(selectionData);
      setSelectionTrackingData({
        previousSelectionArea: area,
        previousSelectionIndex: index,
      });
      return;
    }
    let foundIndex = multipleSelectedItems.selectedFolders.findIndex(
      (item) => item.id === folder.id,
    );
    if (foundIndex !== -1) {
      if (selectionKeys.current.ctrl) {
        selectionData.selectedFolders.splice(foundIndex, 1);
      } else {
        selectionData.selectedFolders = [];
      }
    } else {
      if (selectionKeys.current.ctrl) {
        selectionData.selectedFolders.push(folder);
      } else {
        selectionData.selectedFolders = [folder];
        selectionData.selectedDocs = [];
      }
    }
    setSelectionTrackingData({
      previousSelectionArea: area,
      previousSelectionIndex: index,
    });
    setMultipleSelectedItems(selectionData);
  }

  function onSingleClickOnDoc(doc, index, area) {
    let selectionData = { ...multipleSelectedItems };
    let previousSelectionArea = selectionTrackingData.previousSelectionArea;
    let previousSelectionIndex = selectionTrackingData.previousSelectionIndex;
    let selectedDocIds = multipleSelectedItems.selectedDocs.map(
      (item) => item.id,
    );
    let selectedFolderIds = multipleSelectedItems.selectedFolders.map(
      (item) => item.id,
    );
    if (
      selectionKeys.current.shift &&
      previousSelectionArea &&
      previousSelectionIndex !== -1
    ) {
      let docListSelectionSlice = [];
      if (previousSelectionIndex !== index && previousSelectionArea === area) {
        console.log("folderlistView", folderListView);
        console.log("area", area);
        console.log("previousArea", previousSelectionArea);

        let documentAreaList =
          area === navigationSelectionItemsArea.RECENT_DOCUMENTS
            ? recentDocuments
            : folderListView
              ? directoryData.listData
              : directoryData.documentsList;
        console.log("documentAreaList", documentAreaList);
        if (previousSelectionIndex > index) {
          docListSelectionSlice = documentAreaList.slice(
            index,
            previousSelectionIndex,
          );
        } else {
          docListSelectionSlice = documentAreaList.slice(
            previousSelectionIndex + 1,
            index + 1,
          );
        }
        for (let item of docListSelectionSlice) {
          if (item?.version || item?.document_name) {
            if (!selectedDocIds.includes(item.id)) {
              selectionData.selectedDocs.push(item);
            }
          } else {
            if (!selectedFolderIds.includes(item.id)) {
              selectionData.selectedFolders.push(item);
            }
          }
        }
      }
      setMultipleSelectedItems(selectionData);
      setSelectionTrackingData({
        previousSelectionArea: area,
        previousSelectionIndex: index,
      });
      return;
    }
    let foundIndex = multipleSelectedItems.selectedDocs.findIndex(
      (item) => item.id === doc.id,
    );
    if (foundIndex !== -1) {
      if (selectionKeys.current.ctrl) {
        selectionData.selectedDocs.splice(foundIndex, 1);
      } else {
        selectionData.selectedDocs = [];
      }
    } else {
      if (selectionKeys.current.ctrl) {
        selectionData.selectedDocs.push(doc);
      } else {
        selectionData.selectedDocs = [doc];
        selectionData.selectedFolders = [];
      }
    }
    setSelectionTrackingData({
      previousSelectionArea: area,
      previousSelectionIndex: index,
    });
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
      currentName: item?.title || item?.document_name,
    });
  }

  async function onMoveItemsConfirm() {
    let res = await moveFolderDoc({
      project_ids: [
        ...multipleSelectedItems?.selectedFolders.map((item) => item?.id),
      ],
      document_ids: [
        ...multipleSelectedItems?.selectedDocs.map((item) => item?.id),
      ],
      target_project_id: moveItemsMetadata.emplacement.selectedFolder.id,
    });
    if (res?.target_project_id) {
      // Promise.resolve();
      appDispatch(folderNavigationAction.toggleRefreshDirectory());
      toast.custom(
        (t) => (
          <div className="rounded-md bg-overlay px-3 py-4 text-xs  text-white">
            <span>
              {multipleSelectedItems.selectedDocs.length +
                multipleSelectedItems.selectedFolders.length >
              1
                ? "Multiple Items have moved to "
                : (multipleSelectedItems.selectedDocs[0]?.title ||
                    multipleSelectedItems.selectedDocs[0]?.document_name ||
                    multipleSelectedItems.selectedFolders[0]?.title) +
                  " has moved to "}
              “{moveItemsMetadata.emplacement.selectedFolder.title}” folder.{" "}
            </span>
            <Link
              href={`/dashboard/${moveItemsMetadata.emplacement.selectedFolder.id}`}
            >
              <span className="cursor-pointer font-bold underline">
                {"Go to Folder"}
              </span>
            </Link>
          </div>
        ),
        { duration: 5000 },
      );
      setMoveItemsMetadata({
        emplacement: { selectedFolder: null, path: new Map() },
      });
      setOpenMoveItemsModal(false);
    }
  }

  async function onDuplicateDoc() {
    let res = await duplicateDocument({
      document_ids: [
        ...multipleSelectedItems?.selectedDocs.map((item) => item?.id),
      ],
    });
    if (res.status === "success") {
      appDispatch(folderNavigationAction.toggleRefreshDirectory());

      toast.custom(
        (t) => (
          <div className="rounded-md bg-overlay px-3 py-4 text-xs  text-white">
            <span>
              {multipleSelectedItems.selectedDocs.length > 1
                ? "A copy of Multiple documents have been successfully created"
                : "A copy of " +
                  (multipleSelectedItems.selectedDocs[0]?.title ||
                    multipleSelectedItems.selectedDocs[0]?.document_name) +
                  " has been successfully created. "}
            </span>
            {res?.data?.length === 1 && (
              <Link href={`/dashboard/doc-edit/${res.data?.[0]?.id}`}>
                <span className="cursor-pointer font-bold underline">
                  {"Open"}
                </span>
              </Link>
            )}
          </div>
        ),
        { duration: 5000 },
      );
      setMultipleSelectedItems({
        selectedFolders: [],
        selectedDocs: res?.data,
      });
    }
  }

  function saveDocFolderFieldValues(values) {
    setMoveItemsMetadata({
      ...moveItemsMetadata,
      ...values,
    });
  }
}

export default Directory;
