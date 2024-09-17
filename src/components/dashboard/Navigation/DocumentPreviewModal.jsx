import LoganModal from "@/components/generic/LoganModal";
import RemSizeImage from "@/components/generic/RemSizeImage";
import { Button } from "antd";
import React, { useState } from "react";
import parse from "html-react-parser";
import { modalType } from "./FolderDocCreation";
import { useDispatch } from "react-redux";
import { folderNavigationAction } from "@/redux/folderNavigationSlice";

import {
  createClient,
  createDocument,
  getAppendixContent,
} from "@/api/clientSideServiceActions/dashboardServiceActions";
import { documentAction } from "@/redux/documentSlice";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { documentIndexingAction } from "@/redux/editor/documentIndexingSlice";

function DocumentPreviewModal({
  open,
  onClose,
  formValues,
  slugs,
  clientCreation,
}) {
  const appDispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const { newAppendixState } = useSelector(
    (state) => state.documentIndexingReducer,
  );
  const { currentDocumentVersion } = useSelector(
    (state) => state.documentVersioningReducer,
  );

  return (
    <LoganModal
      hideCloseicon={true}
      className={"preview-modal relative"}
      modalOpen={open}
      width={"43.188rem"}
      onClickCancel={() => onClose()}
      footer
      customFooter={
        <div className="absolute -bottom-[3.5rem] right-0 flex items-center justify-end gap-3">
          <Button
            onClick={() => {
              appDispatch(
                folderNavigationAction.setOpenModalType(
                  formValues.isImport
                    ? modalType.IMPORT_TEMPLATE
                    : modalType.CREATE_DOCUMENT,
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
            loading={loading}
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
          {formValues?.previewTemplate && parse(formValues?.previewTemplate)}
        </div>
      </div>
    </LoganModal>
  );

  async function onClickCreateDocument() {
    setLoading(true);

    if (newAppendixState?.id) {
      createNewDocument();
      return;
    }
    if (clientCreation && formValues?.clientName) {
      const formData = new FormData();
      formData.append("title", formValues?.clientName);
      delete formValues?.clientName;
      for (let key in formValues?.optionalClientDetails) {
        formData.append(key, formValues?.optionalClientDetails[key]);
      }
      let res = await createClient(formData);
      res?.project_id && (await createNewDocument(res?.project_id));
      setLoading(false);
    } else {
      (formValues.emplacement.selectedFolder || params?.folderId) &&
        createNewDocument(formValues.emplacement.selectedFolder);
    }
  }

  async function createNewDocument(parentFolderId) {
    if (newAppendixState?.id) {
      let res = await getAppendixContent({
        document_id: currentDocumentVersion?.id,
        version_id: currentDocumentVersion?.version_id,
        is_import: false,
        content: formValues?.previewTemplate,
      });
      if (res) {
        appDispatch(
          documentIndexingAction.setNewAppendixState({
            content: res?.content,
          }),
        );
        onClose();
      }
    } else {
      let res = await createDocument(formValues?.isImport ? true : false, {
        document_name: formValues?.documentTopic,
        project_id: params?.folderId ? params?.folderId : parentFolderId,
        content: formValues?.previewTemplate,
      });

      if (res) {
        appDispatch(documentAction.setCurrentDocument(res));
        router.push(`/dashboard/doc-edit/${res?.id}`);
        onClose();
      }
    }
  }
}

export default DocumentPreviewModal;
