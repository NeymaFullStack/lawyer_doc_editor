"use client";
import {
  renameDocument,
  renameFolder,
} from "@/api/clientSideServiceActions/dashboardServiceActions";
import LoganModal from "@/components/generic/LoganModal";
import { folderNavigationAction } from "@/redux/folderNavigationSlice";
import { Button, Form, Input } from "antd";
import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { navigationItemTypes } from "@/constants/enums";

function RenameModal({ open, onClose, itemType, currentName = "", itemId }) {
  const [itemName, setItemName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const appDispatch = useDispatch();

  return (
    <LoganModal
      modalOpen={open}
      width={"43.188rem"}
      footer={false}
      onClickCancel={onClose}
    >
      <div
        className="flex items-center gap-3 "
        onContextMenu={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-black">
          Rename
          <span className="text-primary-blue">
            {itemType === navigationItemTypes.FOLDER ? " Folder" : " Document"}
          </span>
        </h2>
      </div>
      <div className="mt-4 ">
        <Form
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          validateTrigger={[]}
          className="flex  items-end gap-3"
        >
          <Form.Item
            initialValue={currentName}
            label={
              itemType === navigationItemTypes.FOLDER ? " Folder" : " Document"
            }
            name="itemName"
            rules={[{ required: true, message: "Please input folder name!" }]}
            className="mb-2 flex-1"
          >
            <Input
              autoComplete="off"
              onChange={(e) => {
                setItemName(e.target.value);
              }}
              value={itemName}
              placeholder={`Enter ${itemType === navigationItemTypes.FOLDER ? " Folder" : " Document"} Name`}
            />
          </Form.Item>
        </Form>
        <div className="mt-3 flex items-center gap-3">
          <Button
            loading={isLoading}
            disabled={itemName.length <= 0}
            className={`btn btn--primary border-[1px] border-primary-blue `}
            onClick={onClickRename}
          >
            Save
          </Button>
          <Button onClick={onClose} className={`btn btn--normal`}>
            Cancel
          </Button>
        </div>
      </div>
    </LoganModal>
  );

  async function onClickRename() {
    setIsLoading(true);
    if (itemType === navigationItemTypes.FOLDER) {
      let res = await renameFolder(itemId, { title: itemName });
      if (res) {
        setItemName("");
        appDispatch(folderNavigationAction.toggleRefreshDirectory());
        onClose();
      }
    } else if (itemType === navigationItemTypes.DOCUMENT) {
      let res = await renameDocument(itemId, { document_name: itemName });
      if (res) {
        setItemName("");
        appDispatch(folderNavigationAction.toggleRefreshDirectory());
        onClose();
      }
    }
    setIsLoading(false);
  }
}

export default React.memo(RenameModal);
