"use client";

import React, { useState } from "react";
import Dragger from "antd/es/upload/Dragger";
import { Button } from "antd";
import RemSizeImage from "./RemSizeImage";

function DropFile({ onUpload }) {
  const [filehovering, setFileHovering] = useState(false);
  return (
    <div>
      <Dragger
        accept={[`.docx`]}
        customRequest={onUpload}
        showUploadList={false}
        className={
          filehovering ? "ln-logan-drop-area-active" : "ln-logan-drop-area"
        }
        multiple={false}
      >
        <div
          onDragEnter={(e) => {
            !filehovering && setFileHovering(true);
          }}
          onDragLeave={(e) => {
            filehovering && setFileHovering(false);
          }}
          onDrop={(e) => {
            filehovering && setFileHovering(false);
          }}
          className="flex gap-2 items-center justify-center"
        >
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
