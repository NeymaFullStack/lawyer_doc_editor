import LoganModal from "@/components/generic/LoganModal";
import React from "react";

function RestoreDocModal({ openRestoreDocModal, document, onClose, onApply }) {
  return (
    <LoganModal
      applyButtonText={"Restore Current Document"}
      cancelButtonText={"Cancel"}
      modalOpen={openRestoreDocModal}
      onClickCancel={onClose}
      onClickApply={onApply}
      width={"44rem"}
      applyButtonClass={"btn--warn"}
    >
      <h2 className="font-bold text-2xl text-black">
        Restore Document Version
      </h2>
      <p className="mt-3 text-[0.813rem] p-5 bg-warn-light rounded-xl">
        <span className="text-black font-medium">Attention</span>: You are about
        to restore a previous version of this document.
        <span className="text-black font-medium">
          This action will overwrite the current document with the selected
          version. This action CANNOT be undone
        </span>
        {`. If you wish to keep the current version of the document, consider
        using the 'Duplicate' feature instead.`}
      </p>

      <div className="mt-4">
        <label
          htmlFor="doc-name"
          className="text-[0.784rem] text-black font-semibold mt-10"
        >
          {`Please Type "RESTORE" to confirm`}
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

export default RestoreDocModal;
