import LoganModal from "@/components/generic/LoganModal";
import RemSizeImage from "@/components/generic/RemSizeImage";
import { folderNavigationAction } from "@/redux/folderNavigationSlice";
import { Button, Form } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { modalType } from "./FolderDocCreation";
import { useSelector } from "react-redux";

function DocCreationTypeModal({
  onClose,
  open,
  formValues: { createClient },
  saveDocFolderFieldValues,
}) {
  const appDispatch = useDispatch();
  const [hoveredButton, setHoveredButton] = useState("");
  const { newAppendixState } = useSelector(
    (state) => state.documentIndexingReducer,
  );

  return (
    <LoganModal
      closable={false}
      modalOpen={open}
      hideCloseicon={true}
      onClickCancel={() => onClose()}
      width={"43.188rem"}
      className={"relative"}
      customFooter={
        <div className="absolute -bottom-[3.5rem] right-0 flex items-center justify-end gap-3">
          <Button
            onClick={() => {
              if (newAppendixState?.id) {
                onClose(false, { newAppendix: true });
                return;
              }
              if (createClient) {
                appDispatch(
                  folderNavigationAction.setOpenModalType(modalType.New_CLIENT),
                );
              } else {
                appDispatch(
                  folderNavigationAction.setOpenModalType(
                    modalType.EMPLACEMENT,
                  ),
                );
              }
            }}
            icon={
              <RemSizeImage
                imagePath={"/assets/icons/left-arrow-grey.svg"}
                remWidth={1}
                remHeight={1}
                alt={"back"}
              />
            }
            className={`btn btn--normal`}
          >
            {newAppendixState?.id ? "Cancel" : "Back"}
          </Button>
        </div>
      }
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-black">
          {newAppendixState?.id ? "Add an" : "Choose"}{" "}
          <span className="text-primary-blue">
            {newAppendixState?.id ? "Appendix" : "How To Begin"}
          </span>
        </h2>
        <RemSizeImage
          imagePath={"/assets/icons/poweredby-ai.svg"}
          remWidth={8}
          remHeight={2}
          alt={"AI"}
        />
      </div>
      <p className="mt-3 text-xs">
        To {newAppendixState?.id ? "add a new ppendix" : "create your document"}
        , you can start from scratch, import your document, or select a
        template.
      </p>
      <div className="mb-3 mt-5 flex items-center justify-between gap-4 font-semibold  text-primary-gray">
        <div
          onClick={() => {
            appDispatch(
              folderNavigationAction.setOpenModalType(
                modalType.CREATE_DOCUMENT,
              ),
            );
          }}
          onMouseEnter={() => {
            setHoveredButton("scratch");
          }}
          onMouseLeave={() => setHoveredButton("")}
          className={`flex cursor-pointer flex-col items-center gap-3 rounded-lg bg-six px-6 py-6  text-black hover:bg-primary-blue hover:text-white`}
        >
          <RemSizeImage
            imagePath={
              hoveredButton === "scratch"
                ? "/assets/icons/white-doc-scratch.svg"
                : "/assets/icons/blue-doc-scratch.svg"
            }
            remWidth={1}
            remHeight={1}
            alt={"AI"}
          />
          <span>Start From Scratch</span>
        </div>
        <span>Or</span>
        <div
          onMouseEnter={() => {
            setHoveredButton("importTemplate");
          }}
          onClick={() => {
            appDispatch(
              folderNavigationAction.setOpenModalType(
                modalType?.IMPORT_TEMPLATE,
              ),
            );
            saveDocFolderFieldValues({ isImport: true });
          }}
          onMouseLeave={() => setHoveredButton("")}
          className={`flex cursor-pointer flex-col items-center gap-3 rounded-lg bg-six px-6 py-6 text-black  hover:bg-primary-blue hover:text-white`}
        >
          <RemSizeImage
            imagePath={
              hoveredButton === "importTemplate"
                ? "/assets/icons/import-temp-white.svg"
                : "/assets/icons/import-temp-blue.svg"
            }
            remWidth={1}
            remHeight={1}
            alt={"AI"}
          />
          <span>Import A Template</span>
        </div>
        <span>Or</span>
        <div
          onMouseLeave={() => setHoveredButton("")}
          onMouseEnter={() => {
            setHoveredButton("browseTemplate");
          }}
          className={`flex cursor-pointer flex-col items-center gap-3 rounded-lg bg-six px-6 py-6 text-black hover:bg-purple-gradient hover:text-white`}
        >
          <RemSizeImage
            imagePath={
              hoveredButton === "browseTemplate"
                ? "/assets/icons/browse-temp-white.svg"
                : "/assets/icons/browse-temp-blue.svg"
            }
            remWidth={1}
            remHeight={1}
            alt={"AI"}
          />
          <span>Browse Template</span>
        </div>
      </div>

      {/* <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold text-black">Create A New Document</h2>
        {clientFolder && (
          <span className="flex items-center gap-2 rounded-md bg-black-txt px-3 py-[0.35rem] font-bold leading-none text-white">
            <RemSizeImage
              imagePath={"/assets/icons/client-folder-white.svg"}
              remWidth={0.9}
              remHeight={0.9}
              alt={"Route"}
            />
            <span>{clientFolder}</span>
          </span>
        )}
      </div>
      <div className="mt-4">
        <Form
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          validateTrigger={[]}
        >
          <Form.Item
            label="Document Name *"
            name="docName"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input
              autoComplete="off"
              onChange={(e) => {
                setDocName(e.target.value);
              }}
              placeholder="Enter Document Name"
            />
          </Form.Item>
        </Form>
      </div> */}
    </LoganModal>
  );
}

export default DocCreationTypeModal;
