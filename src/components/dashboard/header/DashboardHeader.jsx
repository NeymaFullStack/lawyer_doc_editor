"use client";
import React, { useLayoutEffect, useState } from "react";
import DocumentState from "./DocumentState";
import { Button } from "antd";
import SaveCurrentDocumentModal from "../DocumentEditor/documentAction/SaveCurrentDocumentModal";
import RemSizeImage from "@/components/generic/RemSizeImage";
import { useDispatch, useSelector } from "react-redux";
import NavigationBreadCrumbs from "@/components/generic/NavigationBreadCrumbs";
import { usePathname, useSelectedLayoutSegments } from "next/navigation";
import {
  createNewDocumentVersion,
  exportDocumentPdf,
} from "@/api/clientSideServiceActions/dashboardServiceActions";
import { documentVersioningAction } from "@/redux/editor/documentVersioningSlice";
import FolderNavigationHeader from "./FolderNavigationHeader";

function DashboardHeader() {
  const appDispatch = useDispatch();
  const pathname = usePathname();
  const segments = useSelectedLayoutSegments();
  const [openSaveCurrentDocModal, setOpenSaveCurrentDocModal] = useState(false);
  const [showDocEditHeader, setShowEditHeader] = useState(false);
  const { folderListView, breadCrumbs: folderRoutes } = useSelector(
    (state) => state.folderNavigationReducer,
  );
  const { currentDocumentVersion } = useSelector(
    (state) => state.documentVersioningReducer,
  );
  const { currentDocument } = useSelector((state) => state.documentReducer);
  const [breadCrumbs, setBreadCrumbs] = useState([]);

  useLayoutEffect(() => {
    if (pathname.includes("/dashboard/doc-edit")) {
      folderRoutes?.length > 0;
      setBreadCrumbs(folderRoutes);
      !showDocEditHeader && setShowEditHeader(true);
    } else {
      // console.log("segment", segments);
      if (segments?.length > 0) {
        setBreadCrumbs(segments);
      } else {
        setBreadCrumbs([]);
      }
      showDocEditHeader && setShowEditHeader(false);
    }
  }, [pathname, folderRoutes]);

  return (
    <header className="flex flex-col gap-3 pb-3 pt-3">
      {openSaveCurrentDocModal && (
        <SaveCurrentDocumentModal
          openSaveCurrentDocModal={openSaveCurrentDocModal}
          onClose={() => setOpenSaveCurrentDocModal(false)}
        />
      )}
      {showDocEditHeader ? (
        <div className="flex w-full items-center justify-between px-7">
          <h2 className="text-lg font-semibold">
            {currentDocument?.document_name}
          </h2>
          <div className="flex items-center gap-3">
            <p className="flex items-center gap-[0.313rem] text-xs">
              <span>Last version saved Yesterday</span>
              <span className="rounded-full bg-[#A3A7AF] p-[0.156rem]"></span>
              <span>4:25pm</span>
            </p>
            {/* <DocumentState /> */}
            <Button
              onClick={onClickSaveButton}
              icon={
                <RemSizeImage
                  imagePath={"/assets/icons/save-white-icon.svg"}
                  remWidth={0.957}
                  remHeight={0.894}
                  alt={"Save"}
                />
              }
              className="btn btn--primary"
            >
              Save
            </Button>
            <Button
              onClick={async () => {
                let responsePdf = await exportDocumentPdf(
                  currentDocument?.id,
                  currentDocumentVersion?.version_id,
                );
                // console.log("responsePdf", responsePdf);
                // function binaryStringToArrayBuffer(binaryString) {
                //   const length = binaryString.length;
                //   const arrayBuffer = new ArrayBuffer(length);
                //   const uint8Array = new Uint8Array(arrayBuffer);
                //   for (let i = 0; i < length; i++) {
                //     uint8Array[i] = binaryString.charCodeAt(i);
                //   }
                //   return arrayBuffer;
                // }
                // console.log("responsePdf", responsePdf);
                // const buffer = binaryStringToArrayBuffer(responsePdf);
                const pdfBlob = new Blob([responsePdf.data], {
                  type: "application/pdf",
                });

                const fileUrl = URL.createObjectURL(pdfBlob);
                const w = window.open(fileUrl, "_blank");
                w && w.focus();
              }}
              icon={
                <RemSizeImage
                  imagePath={"/assets/icons/export-blue.svg"}
                  remWidth={0.957}
                  remHeight={0.894}
                  alt={"Export"}
                />
              }
              className="btn btn--secondary"
            >
              Export
            </Button>
            <button>
              <RemSizeImage
                imagePath={"/assets/icons/option-icon.svg"}
                remWidth={0.25}
                remHeight={1.041}
                alt={"Options"}
              />
            </button>
          </div>
        </div>
      ) : (
        <FolderNavigationHeader
          folderListView={folderListView}
          segments={segments}
        />
      )}
      {/* <NavigationBreadCrumbs breadCrumbs={breadCrumbs} /> */}
    </header>
  );

  async function onClickSaveButton() {
    // setOpenSaveCurrentDocModal(true);
    const res = await createNewDocumentVersion({
      document_id: currentDocument?.id,
      version_id: currentDocumentVersion?.version_id,
      is_auto_saved: false,
    });
    if (res[0].version_id && res[0].content) {
      appDispatch(
        documentVersioningAction.setDocumentVersion({
          currentDocumentVersion: {
            ...res[0],
            docContent: res[0].content,
          },
        }),
      );
    }
  }
}

export default DashboardHeader;
