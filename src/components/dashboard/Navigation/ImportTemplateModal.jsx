import { importDoc } from "@/api/clientSideServiceActions/dashboardServiceActions";
import DocxThumbnail from "@/components/generic/DocxThumnail";
import DropFile from "@/components/generic/DropFile";
import LoganModal from "@/components/generic/LoganModal";
import RemSizeImage from "@/components/generic/RemSizeImage";
import { folderNavigationAction } from "@/redux/folderNavigationSlice";
import { Button } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { modalType } from "./FolderDocCreation";

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
        Import a <span className="text-primary-blue">Template</span>
      </h2>
      <div className="my-3 mb-4 text-sm  text-primary-gray">
        <span>Accepted file formats:</span>{" "}
        <span className="font-medium text-black-txt">
          .doc, .docx, .org, .pdf
        </span>
      </div>
      <DropFile height={"8.5rem"} onUpload={onUpload} />
      {file && (
        <div className="mt-2 flex items-center gap-2 rounded-lg bg-six p-2">
          {/* <DocxThumbnail docxHtmlContent={file} /> */}
          <span>{file.name}</span>
          <div
            onClick={() => {
              setFile(null);
            }}
            className="cursor-pointer"
          >
            <RemSizeImage
              imagePath={"/assets/icons/delete-gray.svg"}
              remWidth={1}
              remHeight={1}
              alt={"delete"}
            />
          </div>
        </div>
      )}
    </LoganModal>
  );

  async function onUpload({ file }) {
    // TODO: info.file send to backend api save the response to file list for showing those files
    let formData = new FormData();

    formData.append("file", file);
    const {
      data: { data: content },
    } = await importDoc(formData);
    saveDocFolderFieldValues({
      previewTemplate: content,
      documentTopic: file.name.split(".")[0],
    });
    setFile({ content: content, name: file.name.split(".")[0] });
  }
}

export default ImportTemplateModal;
