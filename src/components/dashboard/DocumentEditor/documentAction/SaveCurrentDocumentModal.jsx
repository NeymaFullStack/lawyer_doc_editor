import LoganModal from "@/components/generic/LoganModal";
import RemSizeImage from "@/components/generic/RemSizeImage";
import Image from "next/image";
import React from "react";

function SaveCurrentDocumentModal({
  openSaveCurrentDocModal,
  document,
  onClose,
  onApply,
}) {
  return (
    <LoganModal
      applyButtonText={"Save"}
      cancelButtonText={"Cancel"}
      modalOpen={openSaveCurrentDocModal}
      onClickCancel={onClose}
      onClickApply={onApply}
      width={"43.188rem"}
      applyButtonIcon={
        <RemSizeImage
          imagePath={"/assets/icons/save-white-icon.svg"}
          remWidth={0.894}
          remHeight={0.957}
          alt={"Save"}
        />
        // <Image
        //   src={"/assets/icons/save-white-icon.svg"}
        //   height={15.31}
        //   width={14.31}
        //   alt="Save"
        // />
      }
    >
      <h2 className="font-bold text-2xl text-black">
        Save Document Current Version
      </h2>
      <div className="mt-4">
        <label
          htmlFor="doc-name"
          className="text-[0.784rem] text-black font-semibold mt-10"
        >
          Saved Document Version Title
        </label>
        <input
          autoComplete="off"
          id="doc-name"
          type="text"
          className="border-[0.063rem] w-full border-secondary-blue h-[2.813rem] mt-2 rounded-xl pl-4 text-primary-gray text-sm"
        ></input>
      </div>
    </LoganModal>
  );
}

export default SaveCurrentDocumentModal;
