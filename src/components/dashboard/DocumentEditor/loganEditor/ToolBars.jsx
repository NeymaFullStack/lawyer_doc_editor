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

function Toolbars({ quillPages, visiblePage }) {
  const appDispatch = useDispatch();
  const [openDuplicateDocModal, setOpenDuplicateDocModal] = useState(false);
  const [openRestoreDocModal, setOpenRestoreDocModal] = useState(false);
  const exportDoc = useSelector((state) => state.documentReducer.exportDoc);

  const versionHistoryDocument = useSelector(
    (state) => state.documentReducer.documentLoading
  );

  const activeDocumentAction = useSelector(
    (state) => state.documentReducer.activeDocumentAction
  );

  const documentState = useSelector(
    (state) => state.documentReducer.documentState
  );

  let isStatusDraft = documentState === documentStatus.Draft ? true : false;
  const activeQuillId = useSelector(
    (state) => state.quillReducer.activeQuillId
  );

  const blurredActiveQuillId = useSelector(
    (state) => state.quillReducer.blurredActiveQuillId
  );
  let toolbar = quillPages.map((quill, index) => {
    return (
      <div
        className={
          "w-full h-full flex justify-start items-center " +
          (!isStatusDraft ||
          (activeDocumentAction !== documentActions.Draft &&
            activeDocumentAction !== documentActions.VariableTool &&
            activeDocumentAction !== documentActions.Reference)
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
    <div className="w-full h-full flex items-center">
      {toolbar}
      {activeDocumentAction == documentActions.VersionHistory ? (
        <div className="flex w-full h-full items-center">
          <h2 className="w-[45%] pl-3">
            {versionHistoryDocument?.documentname || "Updated By Laws"}
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
          <div className="flex w-full items-center justify-end gap-4 mr-5">
            <button onClick={() => setOpenRestoreDocModal(true)}>
              <RemSizeImage
                imagePath={"/assets/icons/quillicons/restore-doc.svg"}
                remWidth={1}
                remHeight={1}
                alt={"Restore"}
              />
              {/* <Image
                src={"/assets/icons/quillicons/restore-doc.svg"}
                height={16}
                width={16}
                alt="Restore"
              /> */}
            </button>
            <button onClick={() => setOpenDuplicateDocModal(true)}>
              <RemSizeImage
                imagePath={"/assets/icons/quillicons/duplicate-doc.svg"}
                remWidth={1}
                remHeight={1}
                alt={"Duplicate"}
              />
              {/* <Image
                src={"/assets/icons/quillicons/duplicate-doc.svg"}
                height={16}
                width={16}
                alt="Duplicate"
              /> */}
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
              {/* <Image
                src={"/assets/icons/export-blue.svg"}
                height={16}
                width={16}
                alt="Export"
              /> */}
            </button>
          </div>
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
        "border-b-[0.063rem] border-secondary-blue h-[3.3rem] flex px-[0.4rem] w-full items-center"
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
