import LoganModal from "@/components/generic/LoganModal";
import { Button } from "antd";
import React from "react";

function ArticleDeleteConfirmationModal({ open, onConfirm, onClose }) {
  return (
    <LoganModal
      modalOpen={open}
      width={"30rem"}
      onClickCancel={onClose}
      footer
      customFooter={
        <div className="mt-4 flex items-center justify-center gap-3">
          <Button onClick={onConfirm} className={`btn btn--warn`}>
            Yes, Delete
          </Button>
          <Button onClick={onClose} className={`btn btn--normal-outlined`}>
            No, Cancel
          </Button>
        </div>
      }
    >
      <h2 className="mt-3 flex items-center justify-center text-2xl font-bold text-black">
        <span>Are You Sure? </span>
      </h2>
      <p className="mt-3 rounded-xl bg-warn-light p-5 text-center text-[0.813rem] !text-black-txt">
        <span className="font-medium text-black">Attention</span>
        {`: Attention:
        You're about to delete this article. If it contains sub-articles, they
        will also be deleted.`}
      </p>
    </LoganModal>
  );
}

export default ArticleDeleteConfirmationModal;
