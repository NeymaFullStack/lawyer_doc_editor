import LoganModal from "@/components/generic/LoganModal";
import React, { useState } from "react";
import { Input } from "@/components/shadcn-components/ui/input";
import { Button } from "@/components/shadcn-components/ui/button";

function DeleteConfirmationModal({ open, onConfirm, onClose }) {
  const [input, setInput] = useState("");

  return (
    <LoganModal
      modalOpen={open}
      width={"36rem"}
      onClickCancel={onClose}
      footer
      customFooter={
        <div className="mt-3 flex items-center gap-3">
          <Button
            variant={input === "DELETE" ? "warn" : "secondary"}
            onClick={() => {
              input === "DELETE" && onConfirm();
            }}
          >
            Delete
          </Button>
          <Button variant={"normal"} onClick={onClose}>
            Cancel
          </Button>
        </div>
      }
    >
      <h2 className="mt-3 flex items-center text-2xl font-bold text-black">
        Delete 1 File
      </h2>
      <p className="mt-3 rounded-xl bg-warn-light px-3 py-5 text-center text-xs !text-black-txt">
        <span className="font-medium text-black">Attention:</span>
        {`
        You're about to delete one or several files.`}
        <span className="font-bold">This action CANNOT be undone.</span> Are you
        sure you want to proceed?
      </p>
      <div className="mt-3 flex flex-col gap-1">
        <p className="text-xs font-bold">Please type "DELETE" to confirm</p>
        <Input
          value={input || ""}
          autoComplete="off"
          onChange={(e) => {
            setInput(e.target.value);
          }}
          className="my-[0.4rem] h-[2.3rem]"
        />
      </div>
    </LoganModal>
  );
}

export default DeleteConfirmationModal;
