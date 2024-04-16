import LoganModal from "@/components/generic/LoganModal";
import Stepper from "@/components/generic/Stepper";
import React, { useState } from "react";

function DuplicateDocumentModal({
  openDuplicateDocModal,
  document,
  onClose,
  onApply,
}) {
  const [step, setStep] = useState(1);

  return (
    <LoganModal
      applyButtonText={step == 1 ? "Continue" : "Duplicate"}
      cancelButtonText={"Cancel"}
      modalOpen={openDuplicateDocModal}
      onClickCancel={onClose}
      onClickApply={onApply}
      width={"43.188rem"}
      footerleft={
        <Stepper
          totalSteps={2}
          currentStep={1}
          stepActiveColor={"bg-blue-gradient"}
        />
      }
    >
      <h2 className="font-bold text-2xl text-black">
        Duplicate Selected Version Of Document
      </h2>
      <p className="mt-3 text-[0.813rem]">
        Create a new document that is an exact copy of the selected version of
        the current document.
        <br /> This action will not affect the current version of the Document.
      </p>

      <div className="mt-4">
        <label
          htmlFor="doc-name"
          className="text-[0.784rem] text-black font-semibold mt-10"
        >
          New Document Name
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

export default DuplicateDocumentModal;
