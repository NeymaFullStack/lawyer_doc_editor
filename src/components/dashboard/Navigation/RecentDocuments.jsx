"use client";
import React, { useEffect, useRef, useState } from "react";
import DocFile from "./DocFile";
import { getRecentDocumentList } from "@/api/clientSideServiceActions/dashboardServiceActions";
import { useParams, useRouter } from "next/navigation";
import { navigationItemTypes } from "@/constants/enums";
import RenameModal from "./RenameModal";
import LoganContextMenu from "@/components/generic/LoganContextMenu";
import { directoryContextMenuList } from "@/constants/list";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import ChooseEmplacementModal from "./ChooseEmplacementModal";

function RecentDocuments() {
  const [recentDocuments, setRecentDocuments] = useState(null);
  const router = useRouter();
  const params = useParams();
  const [openRenameModal, setOpenRenameModal] = useState(false);
  const [refreshList, setRefreshList] = useState(false);
  const [openMoveItemsModal, setOpenMoveItemsModal] = useState(false);
  const [openDeleteConfirmationModal, setOpenDeleteConfirmationModal] =
    useState(false);
  const [contextMenuActiveId, setContextMenuActiveId] = useState(0);
  const [selectedItemsRenameDetails, setItemsRenameDetails] = useState(null);
  const [multipleSelectedItems, setMultipleSelectedItems] = useState({
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
  useEffect(() => {
    fetchRecentDocuments();
  }, [params, refreshList]);

  return (
    <div className="flex w-full flex-col gap-4">
      <h2 className="font-semibold text-black ">Recent Documents</h2>
      {recentDocuments && (
        <div className=" w-full rounded-lg bg-white  p-5 pb-4">
          <RenameModal
            open={openRenameModal}
            onClose={() => {
              setOpenRenameModal(false);
              setItemsRenameDetails(null);
              setRefreshList((prev) => !prev);
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
              noOfFiles: multipleSelectedItems.selectedDocs.length,
            }}
          />
          <div className="overflow-x-scroll pb-6">
            <ul className="flex items-center gap-x-6">
              {recentDocuments?.map((doc) => {
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
                          });
                        open
                          ? setContextMenuActiveId(doc?.id)
                          : setContextMenuActiveId(0);
                      }}
                      contextMenuItems={directoryContextMenuList({
                        isMultipleSelected:
                          multipleSelectedItems.selectedDocs.length > 1,
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
                        onSingleClickOnDoc={onSingleClickOnDoc}
                        onDoubleClick={onDoubleClickDoc}
                        doc={doc}
                        selectedDocs={multipleSelectedItems?.selectedDocs}
                        contextMenuActiveId={contextMenuActiveId}
                      />
                    </LoganContextMenu>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
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

  function onDoubleClickDoc(doc) {
    // appDispatch(folderNavigationAction.setBreadCrumbs(slug));
    router.push(`/dashboard/doc-edit/${doc.id}`);
  }
  function onCLickRenameItem(type) {
    let item = multipleSelectedItems.selectedDocs[0];
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
  async function fetchRecentDocuments() {
    const res = await getRecentDocumentList({ client_id: params.folderId });
    if (res?.length > 0) {
      setRecentDocuments(res);
    }
  }
}

export default RecentDocuments;
