import React, { useState } from "react";
import LoganModal from "@/components/generic/LoganModal";
import RemSizeImage from "@/components/generic/RemSizeImage";
import DropFile from "./DropFile";
import { Button } from "../shadcn-components/ui/button";
import FilePreview from "@/components/generic/FilePreview";

function FileUploadModal({ isOpen, onClose, onClickSave }) {
  const [file, setFile] = useState(null);
  return (
    <LoganModal
      modalOpen={isOpen}
      onClickCancel={onClose}
      width={"30rem"}
      customFooter={
        <Button
          className="mt-4"
          onClick={() => {
            file && onClickSave();
          }}
          variant={file ? "primary-blue" : "secondary"}
        >
          Save
        </Button>
      }
    >
      <h2 className="text-2xl font-bold text-black">Upload Logo</h2>
      <div className="h-[9rem]">
        {file ? (
          <FilePreview
            deleteFile={() => {
              setFile(null);
            }}
            file={file}
          />
        ) : (
          <DropFile
            height={"9rem"}
            className={"mt-4"}
            fileTypes={[".png", "jpeg", "jpg"]}
            onUpload={({ file }) => {
              setFile(file);
            }}
          />
        )}
      </div>
    </LoganModal>
  );
}

export default FileUploadModal;
