import Image from "next/image";
import { documentActions, documentStatus } from "./enums";
import { modalType } from "@/components/dashboard/Navigation/FolderDocCreation";

export const sideBarDropDownMenu = (params) => [
  {
    label: "New Document",
    key: params.folderId
      ? modalType.DOCUMENT_TEMPLATE_TYPE_SELECTION
      : modalType.EMPLACEMENT,
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

export const documentActionsList = (activeDocumentAction) => {
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

export const vesionFilterMenuList = (filters) => {
  return [
    {
      key: "all",
      label: (
        <div
          className={`${filters.value == "all" ? " text-primary-blue" : ""}`}
        >
          {"All Versions (Default)"}{" "}
          {filters.value == "all" && <span className="ml-1 text-lg">•</span>}
        </div>
      ),
    },
    {
      key: "autoSaved",
      label: (
        <div
          className={`${filters.value == "autoSaved" ? " text-primary-blue" : ""}`}
        >
          {"Auto Saved Versions"}{" "}
          {filters.value == "autoSaved" && (
            <span className="ml-1 text-lg">•</span>
          )}
        </div>
      ),
    },
    {
      key: "manualSaved",
      label: (
        <div
          className={`${filters.value == "manualSaved" ? " text-primary-blue" : ""}`}
        >
          {"Manual Saved Versions"}{" "}
          {filters.value == "manualSaved" && (
            <span className="ml-1 text-lg">•</span>
          )}
        </div>
      ),
    },
  ];
};

export const directoryContextMenuList = (router, item, setOpenRenameModal) => [
  {
    label: "Open",
    icon: "open-icon.svg",
    iconUrl: "/assets/icons/open.svg",
    action: "open",
    onClick: () => {
      router.push(`/dashboard/${item.id}`);
    },
  },
  {
    label: "Rename",
    icon: "rename-icon.svg",
    iconUrl: "/assets/icons/rename.svg",
    action: "rename",
    onClick: () => {
      setOpenRenameModal();
    },
  },
  {
    label: "Move To",
    icon: "move-icon.svg",
    iconUrl: "/assets/icons/move-to.svg",
    action: "moveTo",
    onClick: () => {
      router.push(`/dashboard/${item.id}`);
    },
  },
  {
    label: "Duplicate",
    icon: "duplicate-icon.svg",
    iconUrl: "/assets/icons/duplicate.svg",
    action: "duplicate",
    onClick: () => {
      router.push(`/dashboard/${item.id}`);
    },
  },
  {
    label: "Download",
    icon: "download-icon.svg",
    iconUrl: "/assets/icons/download.svg",
    action: "download",
    onClick: () => {
      router.push(`/dashboard/${item.id}`);
    },
  },
  {
    label: "Delete",
    icon: "delete-icon.svg",
    iconUrl: "/assets/icons/delete-outline.svg",
    action: "delete",
    onClick: () => {
      router.push(`/dashboard/${item.id}`);
    },
  },
];
