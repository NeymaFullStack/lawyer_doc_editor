import RemSizeImage from "@/components/generic/RemSizeImage";
import React, { useState } from "react";

function DocFolder({ onClickFolder, folder, nonClient = false }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
      onDoubleClick={() => {
        onClickFolder(folder);
      }}
      className="group flex cursor-pointer items-center rounded-xl bg-white p-5  py-4 text-xs  font-semibold text-black-txt shadow-out hover:bg-secondary-blue "
    >
      <div className="flex  max-w-[90%] items-center gap-3">
        <div className="min-w-fit">
          <RemSizeImage
            imagePath={
              nonClient
                ? "/assets/icons/non-client-folder.svg"
                : isHovered
                  ? "/assets/icons/client-folder-blue-bg.svg"
                  : "/assets/icons/client-folder.svg"
            }
            remWidth={1.313}
            remHeight={1.313}
            alt={"Client Folder"}
          />
        </div>
        <span className="truncate group-hover:text-primary-blue">
          {folder?.title}
        </span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="ml-auto"
      >
        <RemSizeImage
          imagePath={"/assets/icons/blue-option-hoz.svg"}
          remWidth={0.4}
          remHeight={0.4}
          alt="option"
          className={"rotate-90"}
        />
      </button>
    </div>
  );
}

export default DocFolder;
