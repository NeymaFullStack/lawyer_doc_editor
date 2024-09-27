"use client";
import React, { useEffect, useState } from "react";
import DocFile from "./DocFile";
import { getRecentDocumentList } from "@/api/clientSideServiceActions/dashboardServiceActions";
import { useParams, useRouter } from "next/navigation";
import { navigationItemTypes } from "@/constants/enums";
import RenameModal from "./RenameModal";
import LoganContextMenu from "@/components/generic/LoganContextMenu";
import { directoryContextMenuList } from "@/constants/list";

function RecentDocuments() {
  const [recentDocuments, setRecentDocuments] = useState(null);
  const router = useRouter();
  const params = useParams();
  const [openRenameModal, setOpenRenameModal] = useState(false);
  const [contextMenuActiveId, setContextMenuActiveId] = useState(0);
  const [selectedItemsRenameDetails, setItemsRenameDetails] = useState(null);
  const [refreshList, setRefreshList] = useState(false);
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
          <div className="overflow-x-scroll pb-6">
            <ul className="flex items-center gap-x-6">
              {recentDocuments?.map((doc) => {
                return (
                  <li key={doc?.id}>
                    <LoganContextMenu
                      onOpenChange={(open) =>
                        open
                          ? setContextMenuActiveId(doc?.id)
                          : setContextMenuActiveId(0)
                      }
                      contextMenuItems={directoryContextMenuList(
                        doc,
                        () => {
                          setOpenRenameModal(true);
                          setItemsRenameDetails({
                            itemId: doc?.id,
                            itemType: navigationItemTypes.DOCUMENT,
                            currentName: doc?.document_name,
                          });
                        },
                        () => {
                          router.push(`/dashboard/doc-edit/${doc?.id}`);
                        },
                      )}
                    >
                      <DocFile
                        onClickDoc={onClickDoc}
                        doc={doc}
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

  function onClickDoc(doc) {
    // appDispatch(folderNavigationAction.setBreadCrumbs(slug));
    router.push(`/dashboard/doc-edit/${doc.id}`);
  }
  async function fetchRecentDocuments() {
    const res = await getRecentDocumentList({ client_id: params.folderId });
    if (res?.length > 0) {
      setRecentDocuments(res);
    }
  }
}

export default RecentDocuments;
