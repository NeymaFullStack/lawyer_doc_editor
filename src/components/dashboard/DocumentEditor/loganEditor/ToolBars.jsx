"use client";
import { documentActions, documentStatus } from "@/constants/enums";
import React, { useState } from "react";
import QuillToolbar from "./QuillToolbar";
import { useDispatch, useSelector } from "react-redux";
import "quill/dist/quill.core.css";
import DuplicateDocumentModal from "../documentAction/versionTool/DuplicateDocumentModal";
import RestoreDocModal from "../documentAction/versionTool/RestoreDocModal";
import { documentAction } from "@/redux/documentSlice";
import RemSizeImage from "@/components/generic/RemSizeImage";
import { Button } from "antd";

function Toolbars({ quillPages, visiblePage }) {
  const appDispatch = useDispatch();
  const [openDuplicateDocModal, setOpenDuplicateDocModal] = useState(false);
  const [openRestoreDocModal, setOpenRestoreDocModal] = useState(false);
  const { selectedDocumentVersion } = useSelector(
    (state) => state.documentVersioningReducer,
  );

  const activeDocumentAction = useSelector(
    (state) => state.documentReducer.activeDocumentAction,
  );

  const { exportDoc, activeQuillId, blurredActiveQuillId } = useSelector(
    (state) => state.quillReducer,
  );

  let toolbar = quillPages.map((quill, index) => {
    return (
      <div
        className={
          "flex h-full w-full items-center justify-start " +
          (activeDocumentAction !== documentActions.Draft &&
          activeDocumentAction !== documentActions.VariableTool &&
          activeDocumentAction !== documentActions.Reference
            ? "hidden"
            : activeQuillId == 0 && quill.id == blurredActiveQuillId
              ? ""
              : quill.id !== activeQuillId
                ? "hidden"
                : "")
        }
        key={"toolbar-" + quill.id}
      >
        <QuillToolbar tollbarId={quill.id} />
      </div>
    );
  });

  toolbar = (
    <div className="flex h-full w-full items-center">
      {toolbar}
      {activeDocumentAction == documentActions.VersionHistory ? (
        <div className="flex h-full w-full items-center">
          <h2 className="w-[45%] pl-3">
            {/* {versionHistoryDocument?.documentname || "Updated By Laws"} */}
          </h2>
          {
            // Might need to enable later >>>>>>>>>>>>>>>>>>
            /* <div className={"flex flex-1 h-full  items-center text-xs gap-2 "}>
            <span>page</span>
            <span className=" rounded-lg bg-white text-black p-2 py-[0.125rem]">
              {visiblePage}
            </span>
            <span>/ 152</span>
          </div> */
          }
          {selectedDocumentVersion?.is_auto_saved !== null && (
            <div className="mr-5 flex w-full items-center justify-end gap-4">
              <Button
                onClick={() => setOpenRestoreDocModal(true)}
                icon={
                  <RemSizeImage
                    imagePath={"/assets/icons/quillicons/restore-doc.svg"}
                    remWidth={1}
                    remHeight={1}
                    alt={"Save"}
                  />
                }
                className="btn btn--primary !py-1"
              >
                Restore
              </Button>

              {/* <button onClick={() => setOpenDuplicateDocModal(true)}>
                <RemSizeImage
                  imagePath={"/assets/icons/quillicons/duplicate-doc.svg"}
                  remWidth={1}
                  remHeight={1}
                  alt={"Duplicate"}
                />
              </button>
              <button
                onClick={() => {
                  appDispatch(documentAction.setExportDoc(!exportDoc));
                }}
              >
                <RemSizeImage
                  imagePath={"/assets/icons/export-blue.svg"}
                  remWidth={1}
                  remHeight={1}
                  alt={"Export"}
                />
              </button> */}
            </div>
          )}
        </div>
      ) : (
        <>
          {
            // Might need to enable later >>>>>>>>>>>>>>>>>>
            /* <div
              className={
                "flex flex-1 h-full justify-center items-center text-xs gap-2 " +
                (activeDocumentAction === documentActions.Draft ? "hidden" : "")
              }
            >
              <span>page</span>
              <span className=" rounded-lg bg-white text-black p-2 py-[0.125rem]">
                1
              </span>
              <span>/ 152</span>
            </div> */
          }
        </>
      )}
    </div>
  );
  return (
    <div
      className={
        "flex h-[3.3rem] w-full items-center border-b-[0.063rem] border-secondary-blue px-[0.4rem]"
      }
    >
      <DuplicateDocumentModal
        openDuplicateDocModal={openDuplicateDocModal}
        onClose={() => setOpenDuplicateDocModal(false)}
      />
      <RestoreDocModal
        openRestoreDocModal={openRestoreDocModal}
        onClose={() => setOpenRestoreDocModal(false)}
      />
      {toolbar}
    </div>
  );
}

export default React.memo(Toolbars);
