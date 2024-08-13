import LoganModal from "@/components/generic/LoganModal";
import RemSizeImage from "@/components/generic/RemSizeImage";
import useSpeechHook from "@/hooks/useSpeechHook";
import { Button, Form, Input, Select } from "antd";
import React, { useEffect } from "react";
import { modalType } from "./FolderDocCreation";
import { useDispatch } from "react-redux";
import { folderNavigationAction } from "@/redux/folderNavigationSlice";
import { useSelector } from "react-redux";
const { TextArea } = Input;

let recognition;
if (typeof window !== "undefined") {
  recognition = new (window.webkitSpeechRecognition ||
    window.SpeechRecognition)();
  recognition.lang = "en-US";
}
const languageOptions = [
  {
    label: "English",
    value: "en",
  },
  {
    label: "French",
    value: "fr",
  },
];
const countryOptions = [
  {
    label: "France",
    value: "FR",
  },
  {
    label: "United States",
    value: "US",
  },
];
function CreateDocModal({
  open,
  onClose,
  saveDocFolderFieldValues,
  formValues,
  onApply,
}) {
  const appDispatch = useDispatch();

  const [startListening, stopListening, listening, transcript] =
    useSpeechHook(recognition);
  const { newAppendixState } = useSelector(
    (state) => state.documentIndexingReducer,
  );
  useEffect(() => {
    transcript && setFormFields({ description: transcript });
  }, [transcript]);

  useEffect(() => {
    setFormFields({
      description: "",
      documentTopic: "",
      language: { label: "English", value: "en" },
      legalPlayground: { label: "United States", value: "US" },
      ...formValues,
    });
  }, []);

  console.log("ANT", formValues);

  return (
    <LoganModal
      modalOpen={open}
      width={"43.188rem"}
      onClickCancel={() => onClose()}
      footer
      hideCloseicon={true}
      className={"relative"}
      customFooter={
        <div className="absolute -bottom-[3.5rem] right-0 flex items-center justify-end gap-3">
          <Button
            onClick={() => {
              appDispatch(
                folderNavigationAction.setOpenModalType(
                  modalType.DOCUMENT_TEMPLATE_TYPE_SELECTION,
                ),
              );
              onClose(true, {
                description: "",
                documentTopic: "",
                language: { label: "English", value: "en" },
                legalPlayground: { label: "United States", value: "US" },
              });
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
            Back
          </Button>
          <Button
            disabled={formValues?.documentTopic?.length < 1}
            icon={
              <RemSizeImage
                imagePath={"/assets/icons/arrow-right-white.svg"}
                remWidth={1}
                remHeight={1}
                alt={"back"}
              />
            }
            onClick={() => {
              appDispatch(
                folderNavigationAction.setOpenModalType(modalType.PROGRESS),
              );
              onApply(formValues);
            }}
            className={`btn btn--primary flex-row-reverse`}
          >
            Create Document
          </Button>
        </div>
      }
    >
      <div className="flex items-center justify-between ">
        <h2 className="text-2xl font-bold text-black">
          {newAppendixState?.id ? "Create Your " : "Choose"}
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
        Describe the document you would like to generate. Try to be as accurate
        as possible.
      </p>
      <div className="mt-4">
        <Form
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          validateTrigger={[]}
          className={"space-y-3"}
        >
          <div className="columns-2">
            <Form.Item
              label="Pick Your Language"
              name="language"
              className="mb-2 flex-1"
              initialValue={{ label: "English", value: "en" }}
            >
              <Select
                options={languageOptions}
                value={formValues?.language || ""}
                suffixIcon={
                  <RemSizeImage
                    imagePath={"/assets/icons/dropdown-arrow.svg"}
                    remWidth={1.2}
                    remHeight={1.2}
                    alt={"AI"}
                  />
                }
                onChange={(value, option) => {
                  setFormFields({ language: option });
                }}
              />
            </Form.Item>
            <Form.Item
              className="mb-2"
              label="Choose Your Legal Playground"
              name="playground"
              initialValue={{ label: "United States", value: "US" }}
            >
              <Select
                onChange={(value, option) => {
                  setFormFields({ legalPlayground: option });
                }}
                options={countryOptions}
                suffixIcon={
                  <RemSizeImage
                    imagePath={"/assets/icons/dropdown-arrow.svg"}
                    remWidth={1.2}
                    remHeight={1.2}
                    alt={"AI"}
                  />
                }
                value={formValues?.legalPlayground || ""}
              />
            </Form.Item>
          </div>
          <div className="columns-1">
            <Form.Item
              label="What are we drafting today?"
              name="documentTopic"
              className="mb-2 flex-1"
              initialValue={formValues?.documentTopic}
            >
              <Input
                autoComplete="off"
                value={formValues?.documentTopic}
                onChange={(e) =>
                  setFormFields({ documentTopic: e.target.value })
                }
                placeholder="Describe the type of document you want to create. Ex: NDA"
              />
            </Form.Item>
          </div>
          <div className="columns-1">
            <Form.Item
              label="Spice it up with some context (optional)"
              name="description"
              className="mb-2 flex-1"
              initialValue={formValues?.description}
            >
              <div className="relative">
                <TextArea
                  autoSize={false}
                  rows={4}
                  autoComplete="off"
                  className="!resize-none pr-10 "
                  value={formValues?.description}
                  onChange={(e) =>
                    setFormFields({ description: e.target.value })
                  }
                  placeholder={
                    "Feel free to tell us, either in writing or via voice command, what you'd like included in the document or any details that will guide our AI in crafting your document precisely."
                  }
                />
                <button
                  className=" absolute right-1 top-1"
                  onClick={listening ? stopListening : startListening}
                >
                  <RemSizeImage
                    imagePath={"/assets/icons/mike-icon.svg"}
                    remWidth={1.5}
                    remHeight={1.5}
                    alt={"Mike"}
                  />
                </button>
              </div>
            </Form.Item>
          </div>
        </Form>
      </div>
    </LoganModal>
  );

  function setFormFields(formField) {
    saveDocFolderFieldValues(formField);
  }
}

export default CreateDocModal;
