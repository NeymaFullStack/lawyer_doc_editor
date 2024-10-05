import RemSizeImage from "@/components/generic/RemSizeImage";

import { cn } from "@/utils/shadcn-utils";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function DocFolder({
  onDoubleClick,
  folder,
  nonClient = false,
  selectedFolders,
  onSingleClickOnFolder,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const isSelected = selectedFolders?.find((item) => item?.id === folder?.id);
  return (
    <div
      aria-description="folder"
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
      onDoubleClick={() => {
        onDoubleClick(folder);
      }}
      onClick={() => {
        onSingleClickOnFolder(folder);
      }}
      className={cn(
        "group flex cursor-pointer select-none items-center rounded-xl border-[1px]  border-white  bg-white p-5  py-4 text-sm font-medium text-black-txt shadow-out hover:bg-secondary-blue ",
        isSelected &&
          " border-primary-blue bg-secondary-blue text-primary-blue",
      )}
    >
      <div className="flex  max-w-[90%] items-center gap-3">
        <div className="min-w-fit">
          <RemSizeImage
            imagePath={
              nonClient
                ? "/assets/icons/non-client-folder.svg"
                : isHovered || isSelected
                  ? "/assets/icons/client-folder-blue-bg.svg"
                  : "/assets/icons/client-folder.svg"
            }
            remWidth={1.313}
            remHeight={1.313}
            alt={"Client Folder"}
          />
        </div>
        <span
          // onSelect={(e) => {
          //   e.preventDefault();
          // }}
          className="truncate group-hover:text-primary-blue"
        >
          {folder?.title}
        </span>
      </div>
      {/* <button
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
      </button> */}
    </div>
  );
}

export default DocFolder;
