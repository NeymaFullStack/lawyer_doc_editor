"use client";

import React, { useEffect, useRef, useState } from "react";
import Dragger from "antd/es/upload/Dragger";
import { Button } from "antd";
import RemSizeImage from "./RemSizeImage";
import { cn } from "@/utils/shadcn-utils";
import Loader from "./Loader";
import LoadingIcon from "./LoadingIcon";

function DropFile({ onUpload, customClass, height, className, fileTypes }) {
  const [filehovering, setFileHovering] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <div
      onDragEnter={(e) => {
        e.preventDefault();
        // console.log("enter");
        !filehovering && setFileHovering(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        // console.log("leave");
        filehovering && setFileHovering(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        filehovering && setFileHovering(false);
      }}
      onDragOver={(e) => {
        !filehovering && setFileHovering(true);
        e.preventDefault();
        // console.log("hover");
      }}
      className={className}
    >
      <Dragger
        // ref={dropRef}

        accept={fileTypes || [`.docx`, ".pdf"]}
        customRequest={async (fileData) => {
          setLoading(true);
          await onUpload(fileData);
          setLoading(false);
        }}
        showUploadList={false}
        className={cn(
          "ln-logan-drop-area",
          filehovering && "ln-logan-drop-area-active",
        )}
        multiple={false}
        rootClassName={customClass}
        height={height || "4.5rem"}
      >
        <div className="flex items-center justify-center gap-2">
          {loading ? (
            <>
              <LoadingIcon height={"h-5"} width={"w-5"} className={"mr-2"} />
              <span className="font-bold">
                Hold On, Your File is On its way.
              </span>
            </>
          ) : (
            <>
              <span className="font-bold ">Drag & Drop Files Here</span>
              {!filehovering && (
                <div className="flex items-center gap-2">
                  <span>or</span>
                  <Button
                    icon={
                      <RemSizeImage
                        imagePath={"/assets/icons/add-white.svg"}
                        remWidth={1.343}
                        remHeight={1.343}
                        alt={"Browse Files"}
                      />
                    }
                    className="btn btn--primary"
                  >
                    Browse Files
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </Dragger>
    </div>
  );
}

export default DropFile;
