"use client";

import React, { useEffect, useRef, useState } from "react";
import Dragger from "antd/es/upload/Dragger";
import { Button } from "antd";
import RemSizeImage from "./RemSizeImage";

function DropFile({ onUpload, customClass, height }) {
  const [filehovering, setFileHovering] = useState(false);

  return (
    <div
      onDragEnter={(e) => {
        e.preventDefault();
        console.log("enter");
        !filehovering && setFileHovering(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        console.log("leave");
        filehovering && setFileHovering(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        filehovering && setFileHovering(false);
      }}
      onDragOver={(e) => {
        !filehovering && setFileHovering(true);
        e.preventDefault();
        console.log("hover");
      }}
    >
      <Dragger
        // ref={dropRef}
        accept={[`.docx`, ".pdf"]}
        customRequest={onUpload}
        showUploadList={false}
        className={`${filehovering ? "ln-logan-drop-area-active" : "ln-logan-drop-area"}`}
        multiple={false}
        rootClassName={customClass}
        height={height || "4.5rem"}
      >
        <div className="flex items-center justify-center gap-2">
          <span className="font-bold">Drag & Drop Files Here</span>
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
        </div>
      </Dragger>
    </div>
  );
}

export default DropFile;
