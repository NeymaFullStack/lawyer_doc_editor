import RemSizeImage from "@/components/generic/RemSizeImage";
import React from "react";

function DocFolder({ onClickFolder, folder, nonClient = false }) {
  return (
    <div
      onClick={() => {
        onClickFolder(folder);
      }}
      className="bg-white rounded-xl shadow-out p-5 py-4 pr-3 flex items-center cursor-pointer text-xs text-black-txt font-semibold justify-between "
    >
      <div className="flex items-center gap-3">
        <RemSizeImage
          imagePath={
            nonClient
              ? "/assets/icons/non-client-folder.svg"
              : "/assets/icons/client-folder.svg"
          }
          remWidth={1.313}
          remHeight={1.313}
          alt={"Client Folder"}
        />
        <span>{folder?.title}</span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <RemSizeImage
          imagePath={"/assets/icons/blue-option-hoz.svg"}
          remWidth={0.8}
          remHeight={0.781}
          alt="option"
          className={"rotate-90"}
        />
      </button>
    </div>
  );
}

export default DocFolder;
