import {
  createDocument,
  createFolder,
} from "@/api/clientSideServiceActions/dashboardServiceActions";
import LoganModal from "@/components/generic/LoganModal";
import RemSizeImage from "@/components/generic/RemSizeImage";
import Stepper from "@/components/generic/Stepper";
import { documentAction } from "@/redux/documentSlice";
import { folderNavigationAction } from "@/redux/folderNavigationSlice";
import { Button, Form, Input } from "antd";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

function CreateNewDocModal({ clientFolder = null, open, onClose }) {
  const appDispatch = useDispatch();
  const { slug } = useParams();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [docName, setDocName] = useState("");
  const { newAppendixState } = useSelector(
    (state) => state.documentIndexingReducer,
  );
  const [hoveredButton, setHoveredButton] = useState("");

  return (
    <LoganModal
      closable={false}
      applyButtonText={step == 2 ? "" : "Continue"}
      cancelButtonText={"Cancel"}
      modalOpen={open}
      applyButtonClass={
        docName.length <= 0 && "btn--secondary bg-none   opacity-30 disabled"
      }
      onClickCancel={onClickCancel}
      onClickApply={() => setStep(step + 1)}
      width={"43.188rem"}
      footerleft={
        <Stepper
          totalSteps={2}
          currentStep={step}
          stepActiveColor={"bg-blue-gradient"}
        />
      }
    >
      {step == 2 ? (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-black">
              {newAppendixState?.id ? "Create Your" : "Choose"}
              <span className="text-primary-blue">
                {newAppendixState?.id ? "Appendix" : "How To Begin"}
              </span>{" "}
              {newAppendixState?.id && "From Scratch"}
            </h2>
            <RemSizeImage
              imagePath={"/assets/icons/poweredby-ai.svg"}
              remWidth={8}
              remHeight={2}
              alt={"AI"}
            />
          </div>
          <p className="mt-3 text-xs">
            Describe the document you would like to generate. Try to be as
            accurate as possible.
          </p>
          <div className="mt-5 flex items-center gap-4">
            <Button
              onMouseEnter={() => {
                setHoveredButton("scratch");
              }}
              icon={
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
              }
              onMouseLeave={() => setHoveredButton("")}
              className={`btn btn--secondary hover:btn--primary flex-col items-center justify-center  gap-2  px-8 py-10 text-xs `}
            >
              Start From Scratch
            </Button>
            <span>Or</span>
            <Button
              icon={
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
              }
              onMouseEnter={() => {
                setHoveredButton("importTemplate");
              }}
              onMouseLeave={() => setHoveredButton("")}
              className={`btn btn--secondary hover:btn--primary flex-col items-center justify-center  gap-2  px-8 py-10 text-xs `}
            >
              Import A Template
            </Button>
            <span>Or</span>
            <Button
              icon={
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
              }
              s
              onMouseLeave={() => setHoveredButton("")}
              onMouseEnter={() => {
                setHoveredButton("browseTemplate");
              }}
              className={`btn btn--secondary hover:btn--purple flex-col items-center justify-center gap-2 px-8 py-10 text-xs `}
            >
              Browse Template
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-black">
              Create A New Document
            </h2>
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

              {/* <Form.Item wrapperCol={{ span: 24 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item> */}
            </Form>
            {/* <label
      htmlFor="doc-name"
      className="text-[0.784rem] text-black font-semibold mt-10"
    >
      New Document Name
    </label>
    <input
      autoComplete="off"
      onChange={(e) => setDocName(e.target.value)}
      value={docName}
      id="doc-name"
      type="text"
      className="my-4 focus:border-primary-blue border-[0.063rem] w-full border-secondary-blue h-[2.813rem] mt-2 rounded-xl pl-4 text-primary-gray text-sm"
    ></input> */}
          </div>
        </>
      )}
    </LoganModal>
  );

  function onClickCancel() {
    setDocName("");
    setStep(1);
    onClose();
  }

  async function onClickCreateDoc() {
    // const { data: folderRes } = await createFolder({
    //   title: clientFolder,
    // });
    // if (folderRes?.id) {
    //   const { data: docRes } = await createDocument({
    //     document_name: docName,
    //     project_id: folderRes?.id,
    //     template_id: 1,
    //   });
    //   appDispatch(documentAction.setCurrentDocument(docRes));
    //   appDispatch(folderNavigationAction.setBreadCrumbs(slug));
    //   router.push(`/dashboard/doc-edit/${docRes?.id}`);
    //   onClose();
    // }
  }
}

export default CreateNewDocModal;
