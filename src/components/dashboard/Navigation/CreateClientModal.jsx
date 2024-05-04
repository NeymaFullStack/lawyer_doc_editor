import LoganModal from "@/components/generic/LoganModal";
import RemSizeImage from "@/components/generic/RemSizeImage";
import { Button, Form, Input } from "antd";
import React, { useEffect, useState } from "react";
import { createFolder } from "@/api/clientSideServiceActions/dashboardServiceActions";
import { useDispatch } from "react-redux";
import { folderNavigationAction } from "@/redux/folderNavigationSlice";
import { modalType } from "./FolderDocCreation";

function CreateClientModal({
  open,
  onClose,
  saveDocFolderFieldValues,
  formValues: { clientName = "" },
}) {
  const appDispatch = useDispatch();
  console.log("clientName", clientName);
  return (
    <>
      <LoganModal
        onClickCancel={() => onClose()}
        modalOpen={open}
        width={"43.188rem"}
        footer
        customFooter={
          <div className="mt-2 flex items-center gap-3">
            <Button
              disabled={clientName <= 0}
              onClick={() => {
                onClickCreateDoc();
              }}
              icon={
                <RemSizeImage
                  imagePath={"/assets/icons/add-white.svg"}
                  remWidth={1.343}
                  remHeight={1.343}
                  alt={"Add"}
                />
              }
              className={`btn text-xs ${
                clientName.length > 0
                  ? "btn--primary"
                  : "bg-secondary-blue text-primary-blue  hover:text-primary-blue"
              } `}
            >
              Create Your Client First Document
            </Button>
            <span>or</span>
            <Button
              onClick={() => {
                clientName.length > 1 && onClickSaveClose();
              }}
              className={`btn btn--primary-trans ${
                clientName.length < 1 && "cursor-default opacity-30"
              }`}
            >
              Save and Close
            </Button>
          </div>
        }
      >
        <h2 className="text-2xl font-bold text-black">New Client</h2>
        <div className="mt-4">
          <Form
            labelCol={{ span: 24 }} // Adjust label column span as needed
            wrapperCol={{ span: 24 }} // Adjust wrapper column span as needed
            validateTrigger={[]}
          >
            <Form.Item
              initialValue={clientName}
              name="clientName"
              label={"Client Name *"}
              rules={[{ required: true, message: "Field Required" }]}
            >
              <Input
                value={clientName}
                onChange={(e) => {
                  saveDocFolderFieldValues({ clientName: e.target.value });
                }}
                autoComplete="off"
                placeholder="Enter your name"
              />
            </Form.Item>
          </Form>
          {/* <label
            htmlFor="doc-name"
            className="text-[0.784rem] text-black font-semibold mt-10"
          >
            Client Name *
          </label>
          <input
            autoComplete="off"
            onChange={(e) => setClientName(e.target.value)}
            value={clientName}
            id="folder-name"
            type="text"
            className="my-4 focus:border-primary-blue border-[0.063rem] w-full border-secondary-blue h-[2.813rem] mt-2 rounded-xl pl-4 text-primary-gray text-sm"
          ></input> */}
        </div>
      </LoganModal>
    </>
  );

  async function onClickSaveClose() {
    const res = createFolder({
      title: clientName,
    });
    onClose();
  }
  function onClickCreateDoc() {
    appDispatch(
      folderNavigationAction.setOpenModalType(
        modalType.DOCUMENT_TEMPLATE_TYPE_SELECTION,
      ),
    );
    onClose(true, { createClient: true });
  }
}

export default CreateClientModal;
