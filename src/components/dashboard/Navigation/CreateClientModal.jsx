import LoganModal from "@/components/generic/LoganModal";
import RemSizeImage from "@/components/generic/RemSizeImage";
import { Button, Form, Input } from "antd";
import React, { useRef, useState } from "react";
import { createClient } from "@/api/clientSideServiceActions/dashboardServiceActions";
import { useDispatch } from "react-redux";
import { folderNavigationAction } from "@/redux/folderNavigationSlice";
import { modalType } from "./FolderDocCreation";
import CompanyInformationForm from "../clientPage/ClientPageBody";
import { optional } from "zod";

function CreateClientModal({
  open,
  onClose,
  saveDocFolderFieldValues,
  formValues: { clientName = "" },
}) {
  const appDispatch = useDispatch();
  const [showClientDetails, setShowClientDetails] = useState(false);
  const formRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <LoganModal
        onClickCancel={() => onClose()}
        modalOpen={open}
        width={"43.188rem"}
        footer
        className={"overflow-hidden"}
        customFooter={
          <>
            {showClientDetails ? (
              <div className="mt-4 flex items-center gap-3 ">
                <Button
                  onClick={() => {
                    formRef?.current?.onClickDocCreation();
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
                      : "!bg-secondary-blue  text-disable-blu hover:!text-disable-blu"
                  } `}
                >
                  Create Your Client First Document
                </Button>
                <span>or</span>
                <Button
                  loading={isLoading}
                  type="submit"
                  onClick={() => {
                    formRef?.current?.saveAndClose();
                  }}
                  className={`btn btn--primary-trans ${
                    clientName.length < 1 && "cursor-default opacity-30"
                  }`}
                >
                  Save and Close
                </Button>
              </div>
            ) : (
              <Button
                disabled={clientName?.length < 1}
                onClick={() => {
                  clientName?.length > 0 && setShowClientDetails(true);
                }}
                className={`btn btn--primary`}
              >
                Continue
              </Button>
            )}
          </>
        }
      >
        <h2 className="text-2xl font-bold text-black">
          {showClientDetails ? (
            <>
              <span>Want to</span>
              <span className="text-primary-blue">{" add more "}</span>
              <span>about your client?</span>
              <span className="font-medium">{`(Optional)`}</span>
            </>
          ) : (
            <>
              <span>New</span> <span className="text-primary-blue">Client</span>
            </>
          )}
        </h2>
        {showClientDetails && (
          <p className="mt-3 text-xs">
            You can always add or update these details later from the Client
            Page.
          </p>
        )}
        <div className="no-scrollbar mb-4 mt-1  max-h-[70vh] overflow-y-scroll">
          {showClientDetails ? (
            <div className="mx-3 my-8">
              <CompanyInformationForm
                renderInModal={true}
                ref={formRef}
                onSaveChanges={(data) => {
                  onClickSaveClose(data);
                }}
                onContinueDocCreation={(data) => {
                  onClickCreateDoc(data);
                }}
              />
            </div>
          ) : (
            <Form
              labelCol={{ span: 24 }} // Adjust label column span as needed
              wrapperCol={{ span: 24 }} // Adjust wrapper column span as needed
              validateTrigger={[]}
              className="h-[5rem]"
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
          )}
        </div>
      </LoganModal>
    </>
  );

  async function onClickSaveClose(formParams) {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", clientName);
    for (let key in formParams) {
      formData.append(key, formParams[key]);
    }
    const res = await createClient(formData);
    if (res) {
      onClose();
      appDispatch(folderNavigationAction.toggleRefreshDirectory());
    }
    setIsLoading(false);
  }
  function onClickCreateDoc(formParams) {
    appDispatch(
      folderNavigationAction.setOpenModalType(
        modalType.DOCUMENT_TEMPLATE_TYPE_SELECTION,
      ),
    );
    onClose(true, {
      clientCreation: true,
      clientName: clientName,
      optionalClientDetails: formParams,
    });
  }
}

export default CreateClientModal;
