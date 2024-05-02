import LoganModal from "@/components/generic/LoganModal";
import RemSizeImage from "@/components/generic/RemSizeImage";
import { Button } from "antd";
import React, { useEffect, useState } from "react";
import parse from "html-react-parser";
import { modalType } from "./FolderDocCreation";
import { useDispatch } from "react-redux";
import { folderNavigationAction } from "@/redux/folderNavigationSlice";
import { createDocument } from "@/api/clientSideServiceActions/dashboardServiceActions";
import { documentAction } from "@/redux/documentSlice";
import { useParams, useRouter } from "next/navigation";

function DocumentPreviewModal({
  open,
  onClose,
  formValues: { previewTemplate = "", documentTopic = "" },
  slugs,
}) {
  const appDispatch = useDispatch();
  const router = useRouter();
  const { slug } = useParams();
  console.log("slugs", slug);

  return (
    <LoganModal
      className={"preview-modal relative"}
      closable={false}
      modalOpen={open}
      width={"43.188rem"}
      onClickCancel={onClose}
      footer
      customFooter={
        <div className="absolute -bottom-[3.5rem] right-0 flex items-center justify-end gap-3">
          <Button
            onClick={() => {
              appDispatch(
                folderNavigationAction.setOpenModalType(
                  modalType.CREATE_DOCUMENT,
                ),
              );
              onClose(true, { previewTemplate: "" });
            }}
            icon={
              <RemSizeImage
                imagePath={"/assets/icons/left-arrow-grey.svg"}
                remWidth={1}
                remHeight={1}
                alt={"back"}
              />
            }
            className={`btn btn--normal`}
          >
            Back
          </Button>
          <Button
            icon={
              <RemSizeImage
                imagePath={"/assets/icons/arrow-right-white.svg"}
                remWidth={1}
                remHeight={1}
                alt={"back"}
              />
            }
            onClick={onClickCreateDocument}
            className={`btn btn--primary flex-row-reverse`}
          >
            Create Document
          </Button>
        </div>
      }
      // applyButtonText={"Create Document"}
      // cancelButtonText={"Back"}
      // modalButtonsCLass={" flex-row-reverse"}
      // cancelButtonIcon={
      //   <RemSizeImage
      //     imagePath={"/assets/icons/left-arrow-grey.svg"}
      //     remWidth={1}
      //     remHeight={1}
      //     alt={"AI"}
      //   />
      // }
    >
      <div className="flex items-center justify-between  rounded-t-lg bg-white p-4">
        <h2 className="text-2xl text-[1.3rem] font-bold text-black">
          Choose <span className="text-primary-blue">How To Begin</span>
        </h2>
        <RemSizeImage
          imagePath={"/assets/icons/poweredby-ai.svg"}
          remWidth={8}
          remHeight={2}
          alt={"AI"}
        />
      </div>
      <div className="h-[62vh] overflow-y-scroll pb-5">
        <div className="preview-page mx-20 mt-5 min-h-[70vh] bg-white p-5  !text-black">
          {previewTemplate && parse(previewTemplate)}
        </div>
      </div>
    </LoganModal>
  );

  async function onClickCreateDocument() {
    let res = await createDocument({
      document_name: documentTopic,
      project_id: 1,
      content: previewTemplate,
    });

    if (res) {
      appDispatch(documentAction.setCurrentDocument(res));
      appDispatch(folderNavigationAction.setBreadCrumbs(slug));
      router.push(`/dashboard/doc-edit/${res?.id}`);
      onClose();
    }
  }
}

export default DocumentPreviewModal;
