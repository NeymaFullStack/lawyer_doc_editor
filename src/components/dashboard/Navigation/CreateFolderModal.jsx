"use client";
import LoganModal from "@/components/generic/LoganModal";
import { Button, Form, Input } from "antd";
import React from "react";
import { useState } from "react";

function CreateFolderModal({ open, onClose, folderHierarchy, parentFolderId }) {
  const [folderName, SetFolderName] = useState("");

  return (
    <LoganModal
      modalOpen={open}
      width={"43.188rem"}
      footer={false}
      onClickCancel={onClose}
    >
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold text-black">
          New <span className="text-primary-blue">Folder</span>
        </h2>
        {/* {clientFolder && (
          <span className="flex items-center gap-2 rounded-md bg-black-txt px-3 py-[0.35rem] font-bold leading-none text-white">
            <RemSizeImage
              imagePath={"/assets/icons/client-folder-white.svg"}
              remWidth={0.9}
              remHeight={0.9}
              alt={"Route"}
            />
            <span>{clientFolder}</span>
          </span>
        )} */}
      </div>
      <div className="mt-4">
        <Form
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          validateTrigger={[]}
          className="flex items-end gap-3"
        >
          <Form.Item
            label="Folder Name *"
            name="folderName"
            rules={[{ required: true, message: "Please input folder name!" }]}
            className="mb-2 flex-1"
          >
            <Input
              autoComplete="off"
              onChange={(e) => {
                SetFolderName(e.target.value);
              }}
              value={folderName}
              placeholder="Enter Folder Name"
            />
          </Form.Item>
          <Form.Item className="mb-2">
            <Button
              disabled={folderName.length <= 0}
              className={`btn text-xs ${
                folderName.length > 0 && "btn--primary"
              } `}
              onClick={createFolder}
            >
              Create
            </Button>
          </Form.Item>
        </Form>
      </div>
    </LoganModal>
  );

  async function createFolder() {
    if (parentFolderId) {
      let res = await createFolder({
        parent_id: parentFolderId,
        title: folderName,
      });
      if (res) {
        onClose();
        SetFolderName("");
      }
    }
  }
}

export default CreateFolderModal;
