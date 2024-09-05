import { importDoc } from "@/api/clientSideServiceActions/dashboardServiceActions";
import DropFile from "@/components/generic/DropFile";
import LoganModal from "@/components/generic/LoganModal";
import RemSizeImage from "@/components/generic/RemSizeImage";
import { folderNavigationAction } from "@/redux/folderNavigationSlice";
import { Button } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { modalType } from "./FolderDocCreation";
import FilePreview from "@/components/generic/FilePreview";

function ImportTemplateModal({
  open,
  onClose,
  formValues,
  saveDocFolderFieldValues,
}) {
  const appDispatch = useDispatch();

  const [file, setFile] = useState(null);

  useEffect(() => {
    formValues?.previewTemplate &&
      formValues?.documentTopic &&
      setFile({
        content: formValues?.previewTemplate,
        name: formValues?.documentTopic,
      });
  }, []);

  return (
    <LoganModal
      onClickCancel={() => onClose()}
      modalOpen={open}
      width={"38rem"}
      closable={false}
      customFooter={
        <div className="absolute -bottom-[3.5rem] right-0 flex items-center justify-end gap-3">
          <Button
            onClick={() => {
              onClose(),
                appDispatch(
                  folderNavigationAction.setOpenModalType(
                    modalType.DOCUMENT_TEMPLATE_TYPE_SELECTION,
                  ),
                );
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
            disabled={!file}
            icon={
              <RemSizeImage
                imagePath={"/assets/icons/arrow-right-white.svg"}
                remWidth={1}
                remHeight={1}
                alt={"back"}
              />
            }
            onClick={() => {
              appDispatch(
                folderNavigationAction.setOpenModalType(
                  modalType.DOCUMENT_PREVIEW,
                ),
              );
            }}
            className={`btn btn--primary `}
          >
            Continue
          </Button>
        </div>
      }
    >
      <h2 className="text-2xl font-bold text-black">
        Import a <span className="text-primary-blue">Documents</span>
      </h2>
      {!file ? (
        <>
          <div className="my-3 mb-4 text-sm  text-primary-gray">
            <span>Accepted file formats:</span>{" "}
            <span className="font-medium text-black-txt">
              .doc, .docx, .org, .pdf
            </span>
          </div>
          <DropFile height={"8.5rem"} onUpload={onUpload} />
        </>
      ) : (
        <div className="mt-2 h-full w-full">
          {/* <DocxThumbnail docxHtmlContent={file} /> */}
          <FilePreview
            file={file}
            deleteFile={() => {
              setFile(null);
            }}
          />
        </div>
      )}
    </LoganModal>
  );

  async function onUpload({ file }) {
    // TODO: info.file send to backend api save the response to file list for showing those files
    let formData = new FormData();
    formData.append("file", file);
    const res = await importDoc(formData);
    if (res) {
      saveDocFolderFieldValues({
        previewTemplate: res,
        documentTopic: file.name.split(".")[0],
      });
      setFile({
        content: res,
        type: file?.type,
        name: file.name.split(".")[0],
      });
    }
    return Promise.resolve();
  }
}

export default ImportTemplateModal;
