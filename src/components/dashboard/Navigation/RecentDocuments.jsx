"use client";
import React, { useEffect, useState } from "react";
import DocFile from "./DocFile";
import { getRecentDocumentList } from "@/api/clientSideServiceActions/dashboardServiceActions";
import { useRouter } from "next/navigation";
import { navigationItemTypes } from "@/constants/enums";
import LoganContextMenu from "@/components/generic/LoganContextMenu";
import { directoryContextMenuList } from "@/constants/list";
import { useSelector } from "react-redux";

function RecentDocuments({
  multipleSelectedItems,
  onSingleClickOnDoc,
  setMultipleSelectedItems,
  setOpenDeleteConfirmationModal,
  setOpenMoveItemsModal,
  onClickRenameItem,
  onClickDuplicate,
}) {
  const [recentDocuments, setRecentDocuments] = useState(null);
  const refreshDirectory = useSelector(
    (state) => state.folderNavigationReducer.refreshDirectory,
  );
  const router = useRouter();

  useEffect(() => {
    fetchRecentDocuments();
  }, [refreshDirectory]);

  if (!recentDocuments?.length > 0) return null;

  return (
    <div className="flex w-full flex-col gap-4">
      <h2 className="font-semibold text-black ">Recent Documents</h2>
      <div className=" w-full rounded-lg bg-white  p-5 pb-4">
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
                          selectedFolders: [],
                        });
                    }}
                    contextMenuItems={directoryContextMenuList({
                      disableMoveTo:
                        multipleSelectedItems.selectedFolders.length > 0,
                      isMultipleSelected:
                        multipleSelectedItems.selectedDocs.length +
                          multipleSelectedItems.selectedFolders.length >
                        1,
                      onClickRename: () =>
                        onClickRenameItem(navigationItemTypes.DOCUMENT),
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
                      onClickDuplicate: onClickDuplicate,
                    })}
                  >
                    <DocFile
                      onSingleClickOnDoc={onSingleClickOnDoc}
                      onDoubleClick={onDoubleClickDoc}
                      doc={doc}
                      selectedDocs={multipleSelectedItems?.selectedDocs}
                    />
                  </LoganContextMenu>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );

  function onDoubleClickDoc(doc) {
    // appDispatch(folderNavigationAction.setBreadCrumbs(slug));
    router.push(`/dashboard/doc-edit/${doc.id}`);
  }

  async function fetchRecentDocuments() {
    const res = await getRecentDocumentList();
    let documents = [];
    if (res?.length > 0) {
      documents = res;
    }
    setRecentDocuments(documents);
  }
}

export default RecentDocuments;
