import Image from "next/image";
import { documentActions, documentStatus } from "./enums";
import { modalType } from "@/components/dashboard/Navigation/FolderDocCreation";

export const sideBarDropDownMenu = [
  {
    label: "New Document",
    key: "createDocument",
    type: "action",
    icon: "/assets/icons/new-doc.svg",
  },
  // {
  //   label: "Import a Document",
  //   key: "importDoc",
  //   type: "action",
  //   icon: "/assets/icons/import-doc.svg",
  // },
  { label: "", key: "", type: "divider" },
  {
    label: "New Client",
    key: modalType.New_CLIENT,
    type: "action",
    icon: "/assets/icons/new-client.svg",
  },
  { label: "", key: "", type: "divider" },
  // { label: "New Project", key: "newProj", type: "action" },
  // { label: "", key: "", type: "divider" },
  {
    label: "New Tempelate",
    key: "newTempelate",
    type: "action",
    icon: "/assets/icons/new-tempelate.svg",
  },
  // {
  //   label: "Import a Tempelate",
  //   key: "importTempelate",
  //   type: "action",
  //   icon: "/assets/icons/import-tempelate.svg",
  // },
];

export const documentActionsDraft = (activeDocumentAction) => {
  return [
    {
      value: documentActions.Draft,
      icon:
        activeDocumentAction === documentActions.Draft
          ? "/assets/icons/docaction/draft-active.svg"
          : "/assets/icons/docaction/draft.svg",
    },
    {
      value: documentActions.VariableTool,
      icon:
        activeDocumentAction === documentActions.VariableTool
          ? "/assets/icons/docaction/variable-tool-active.svg"
          : "/assets/icons/docaction/variable-tool.svg",
    },
    {
      value: documentActions.Reference,
      icon:
        activeDocumentAction === documentActions.Reference
          ? "/assets/icons/docaction/reference-tool-active.svg"
          : "/assets/icons/docaction/reference-tool.svg",
    },
    // {
    //   value: documentActions.PageEdit,
    //   icon:
    //     activeDocumentAction === documentActions.PageEdit
    //       ? "/assets/icons/docaction/page-edit-active.svg"
    //       : "/assets/icons/docaction/page-edit.svg",
    // },
    {
      value: documentActions.VersionHistory,
      icon:
        activeDocumentAction === documentActions.VersionHistory
          ? "/assets/icons/docaction/version-history-active.svg"
          : "/assets/icons/docaction/version-history.svg",
    },
    // {
    //   value: documentActions.Preview,
    //   icon:
    //     activeDocumentAction === documentActions.Preview
    //       ? "/assets/icons/docaction/preview-doc-active.svg"
    //       : "/assets/icons/docaction/preview-doc.svg",
    // },
  ];
};

export const documentActionsFinalized = (draftAction, activeDocumentAction) => {
  return [
    {
      value: documentActions.VersionHistory,
      icon:
        activeDocumentAction === documentActions.VersionHistory
          ? "/assets/icons/docaction/version-history-active.svg"
          : "/assets/icons/docaction/version-history.svg",
    },
  ];
};
