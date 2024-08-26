import React, { useState } from "react";
import LoganModal from "@/components/generic/LoganModal";
import RemSizeImage from "@/components/generic/RemSizeImage";
import DropFile from "./DropFile";
import { Button } from "../shadcn-components/ui/button";
import FilePreview from "@/components/generic/FilePreview";

function FileUploadModal({ isOpen, onClose }) {
  const [file, setFile] = useState(null);
  console.log("file", file);
  return (
    <LoganModal
      applyButtonText={"Save"}
      cancelButtonText={"Cancel"}
      modalOpen={isOpen}
      onClickCancel={onClose}
      onClickApply={() => {}}
      width={"30rem"}
      footerleft
    >
      <h2 className="text-2xl font-bold text-black">Upload Logo</h2>
      {file ? (
        <FilePreview
          deleteFile={() => {
            setFile(null);
          }}
          file={file}
        />
      ) : (
        <DropFile
          className={"!mt-7"}
          height={"9rem"}
          fileTypes={[".png", "jpeg", "jpg"]}
          onUpload={({ file }) => {
            setFile(file);
          }}
        />
      )}
    </LoganModal>
  );
}

export default FileUploadModal;
