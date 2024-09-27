"use client";
import RemSizeImage from "@/components/generic/RemSizeImage";
import Tag from "@/components/generic/Tag";
import { documentVersioningAction } from "@/redux/editor/documentVersioningSlice";
import { dtYYMMDD12hrFormat } from "@/utils/dateUtils";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

function DocumentVersion({ docVersion }) {
  const { selectedDocumentVersion } = useSelector(
    (state) => state.documentVersioningReducer,
  );
  const { currentDocument } = useSelector((state) => state.documentReducer);
  const appDispatch = useDispatch();
  const onHoverVersion = () => {
    // set hover version
    selectedDocumentVersion?.version_id !== docVersion?.version_id &&
      appDispatch(
        documentVersioningAction.setDocumentVersion({
          activeDocumentVersion: {
            ...docVersion,
            docContent: docVersion?.content || docVersion?.docContent,
          },
        }),
      );
  };
  const tagStyleClasses = () => {
    let style = {};
    if (docVersion?.is_auto_saved === true) {
      style = { textColor: "text-auto-save", bgColor: "bg-auto-save" };
    } else if (docVersion?.is_auto_saved === false) {
      style = { textColor: "text-save", bgColor: "bg-save" };
    }
    if (style?.textColor || style?.bgColor) {
      return style;
    }
  };
  return (
    <div
      onClick={onSelectVersion}
      onMouseEnter={onHoverVersion}
      onMouseLeave={() => {
        selectedDocumentVersion.version_id !== docVersion.version_id &&
          appDispatch(
            documentVersioningAction.setDocumentVersion({
              activeDocumentVersion: selectedDocumentVersion,
            }),
          );
      }}
      className={`flex cursor-pointer items-center justify-between gap-[0.15rem] px-2 py-2 text-xs hover:bg-six ${selectedDocumentVersion?.version_id === docVersion?.version_id ? "bg-six" : ""}`}
    >
      <div className="flex w-[30%] items-center gap-2">
        {docVersion?.version_id === selectedDocumentVersion?.version_id && (
          <RemSizeImage
            imagePath={"/assets/icons/arrow-left.svg"}
            remWidth={0.375}
            remHeight={0.688}
            alt={"Selected Version"}
          />
        )}
        <span
          className={`truncate font-semibold text-black ${selectedDocumentVersion?.version_id === docVersion?.version_id ? "text-primary-blue" : ""}`}
        >
          {docVersion?.is_auto_saved === null
            ? currentDocument?.document_name
            : docVersion?.version_name || docVersion?.document_name || "NA"}
        </span>
      </div>
      <div className="w-[35%]">
        {dtYYMMDD12hrFormat(
          docVersion?.created_at,
          docVersion?.is_auto_saved === null ? true : false,
        ) || "NA"}
      </div>
      {/* {docVersion?.participants?.length > 0 && <span>{}</span>} */}
      <div className="flex w-[30%] items-center justify-end">
        <Tag {...tagStyleClasses()} className="flex items-center">
          {docVersion?.is_auto_saved !== null && (
            <RemSizeImage
              imagePath={`${docVersion?.is_auto_saved === true ? "/assets/icons/docaction/autosave.svg" : "/assets/icons/docaction/save-green.svg"}`}
              remWidth={0.8}
              remHeight={0.8}
              alt={"doc-state"}
            />
          )}
          {docVersion?.is_auto_saved !== null ? (
            <span>
              {docVersion?.is_auto_saved === true ? "Auto-Save" : "Save"}
            </span>
          ) : (
            <span>Current Version</span>
          )}
        </Tag>
      </div>
    </div>
  );

  function onSelectVersion() {
    let newDocContent =
      docVersion?.is_auto_saved === null
        ? docVersion?.docContent
        : docVersion?.content;
    appDispatch(
      documentVersioningAction.setDocumentVersion({
        selectedDocumentVersion: {
          ...docVersion,
          docContent: newDocContent,
        },
        activeDocumentVersion: {
          ...docVersion,
          docContent: newDocContent,
        },
      }),
    );
  }
}

export default DocumentVersion;
