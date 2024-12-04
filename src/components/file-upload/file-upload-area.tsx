import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "../ui/button";
import { Icon } from "../icons";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "../loading-spinner";

interface FileUploadAreaProps {
  onUpload: (files: File[]) => void | Promise<void>;
  className?: string;
  acceptedfileTypes?: string[];
  multiple?: boolean;
}

const FileUploadArea: React.FC<FileUploadAreaProps> = ({
  onUpload,
  acceptedfileTypes = [],
  className = "",
  multiple = false,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setLoading(() => true);
      await onUpload(acceptedFiles);
      setLoading(() => false);
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragAccept, isDragActive } =
    useDropzone({
      onDrop,
      // onDragEnter: () => setIsDragActive(true),
      // onDragLeave: () => setIsDragActive(false),
      // onDropAccepted: () => setIsDragActive(false),
      multiple: multiple, // Allows multiple files
    });
  return (
    <>
      {loading && (
        <div className="my-3 flex h-40 border-spacing-5 items-center justify-center gap-5 rounded-lg border-[2px] border-dashed  border-gray-300 p-4 px-6 text-[1rem] font-semibold text-primary-gray">
          <LoadingSpinner height={"h-5"} width={"w-5"} className={"mr-2"} />
          <span>Hold On, Your File is On its way.</span>
        </div>
      )}
      <div
        {...getRootProps()}
        className={cn(
          "my-3 flex h-40 border-spacing-5 bg-slate-50 cursor-pointer items-center justify-center rounded-lg  border-2 border-dashed border-gray-300 p-4 px-6 transition-colors",
          (isDragAccept || isDragActive) && "border-blue-500",
          loading && "hidden",
          className
        )}
      >
        <>
          <input {...getInputProps()} accept={acceptedfileTypes?.join(",")} />
          <div
            className={cn(
              "flex w-full items-center justify-center gap-5 text-[1rem] text-logan-black-foreground"
            )}
          >
            <span className="font-semibold ">Drag & Drop Files Here</span>
            <span>or</span>
            {!isDragActive && (
              <Button className=" gap-3" variant={"primary-blue"}>
                <Icon iconName="plus" fill={"white"} />
                <span>Browse Files</span>
              </Button>
            )}
          </div>
        </>
      </div>
    </>
  );
};

export default React.memo(FileUploadArea);
