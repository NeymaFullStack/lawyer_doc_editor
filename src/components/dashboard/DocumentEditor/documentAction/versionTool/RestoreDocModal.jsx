import {
  restoreDocumentVersion,
  updateDocumentVersionContent,
} from "@/api/clientSideServiceActions/dashboardServiceActions";
import LoganModal from "@/components/generic/LoganModal";
import { documentVersioningAction } from "@/redux/editor/documentVersioningSlice";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function RestoreDocModal({ openRestoreDocModal, onClose }) {
  const appDispatch = useDispatch();
  const [input, setInput] = useState("");
  const { selectedDocumentVersion, currentDocumentVersion } = useSelector(
    (state) => state.documentVersioningReducer,
  );
  const { currentDocument } = useSelector((state) => state.documentReducer);

  return (
    <LoganModal
      applyButtonText={"Restore Current Document"}
      cancelButtonText={"Cancel"}
      modalOpen={openRestoreDocModal}
      onClickCancel={onClose}
      onClickApply={() => {
        input === "RESTORE" && onClickApplyButton();
      }}
      width={"44rem"}
      applyButtonClass={"btn--warn"}
    >
      <h2 className="text-2xl font-bold text-black">
        Restore Document Version
      </h2>
      <p className="mt-3 rounded-xl bg-warn-light p-5 text-[0.813rem]">
        <span className="font-medium text-black">Attention</span>: You are about
        to restore a previous version of this document.
        <span className="font-medium text-black">
          This action will overwrite the current document with the selected
          version. This action CANNOT be undone
        </span>
        {`. If you wish to keep the current version of the document, consider
        using the 'Duplicate' feature instead.`}
      </p>

      <div className="mt-4">
        <label
          htmlFor="doc-name"
          className="mt-10 text-[0.784rem] font-semibold text-black"
        >
          {`Please Type "RESTORE" to confirm`}
        </label>
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          autoComplete="off"
          id="doc-name"
          type="text"
          className="mt-2 h-[2.813rem] w-full rounded-xl border-[0.063rem] border-secondary-blue pl-4 text-sm text-primary-gray"
        ></input>
      </div>
    </LoganModal>
  );

  async function onClickApplyButton() {
    if (
      selectedDocumentVersion &&
      selectedDocumentVersion.docContent &&
      selectedDocumentVersion.version_id
    ) {
      const res = await restoreDocumentVersion({
        document_id: currentDocument?.id,
        version_id: selectedDocumentVersion.version_id,
      });
      if (res.data) {
        appDispatch(
          documentVersioningAction.setDocumentVersion({
            currentDocumentVersion: {
              ...currentDocumentVersion,
              docContent: res.data[0].content,
            },
          }),
        );
        onClose();
      }
    }
  }
}

export default RestoreDocModal;
