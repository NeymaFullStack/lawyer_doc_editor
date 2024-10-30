import LoganModal from "@/components/generic/LoganModal";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { folderNavigationAction } from "@/redux/folderNavigationSlice";
import { toast } from "sonner";
import {
  deleteFolderDoc,
  undoFolderDocDeletion,
} from "@/api/clientSideServiceActions/dashboardServiceActions";
import { useDispatch } from "react-redux";
import { set } from "react-hook-form";
import Loader from "@/components/generic/Loader";

function DeleteConfirmationModal({
  open,
  setMultipleSelectedItems,
  onClose,
  multipleSelectedItems,
}) {
  const [input, setInput] = useState("");
  const appDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoganModal
      modalOpen={open}
      width={"36rem"}
      onClickCancel={() => {
        onClose();
        setIsLoading(false);
        setInput("");
      }}
      footer
      customFooter={
        <div className="mt-3 flex items-center gap-3">
          <Button
            disabled={isLoading}
            variant={input === "DELETE" ? "warn" : "secondary"}
            onClick={() => {
              input === "DELETE" && deleteSelection();
            }}
          >
            {isLoading && (
              <Loader
                width={"h-[1rem]"}
                height={"w-[1rem]"}
                className={"mr-2"}
              />
            )}
            Delete
          </Button>
          <Button
            variant={"normal"}
            onClick={() => {
              onClose();
              setIsLoading(false);
              setInput("");
            }}
          >
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

  async function deleteSelection() {
    setIsLoading(true);
    const deleteRes = await deleteFolderDoc({
      project_ids: [
        ...multipleSelectedItems?.selectedFolders.map((item) => item?.id),
      ],
      document_ids: [
        ...multipleSelectedItems?.selectedDocs.map((item) => item?.id),
      ],
    });
    if (deleteRes?.status === "success") {
      appDispatch(folderNavigationAction.toggleRefreshDirectory());
      toast.custom(
        (t) => (
          <div className="rounded-md bg-overlay px-3 py-4 text-xs  text-white">
            <span>
              {multipleSelectedItems.selectedDocs.length +
                multipleSelectedItems.selectedFolders.length >
              1
                ? "Multiple Items have been deleted. "
                : (multipleSelectedItems.selectedDocs[0]?.title ||
                    multipleSelectedItems.selectedDocs[0]?.document_name ||
                    multipleSelectedItems.selectedFolders[0]?.title) +
                  " has been deleted. "}
            </span>
            <span
              onClick={async () => {
                await undoFolderDocDeletion();
                appDispatch(folderNavigationAction.toggleRefreshDirectory());
                toast.dismiss(t.id);
              }}
              className="cursor-pointer font-bold underline"
            >
              {"Undo"}
            </span>
          </div>
        ),
        { duration: 5000 },
      );
      setInput("");
      onClose();
      setMultipleSelectedItems({
        selectedFolders: [],
        selectedDocs: [],
      });
      setIsLoading(false);
    }
  }
}

export default DeleteConfirmationModal;
