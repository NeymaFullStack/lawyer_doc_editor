import RemSizeImage from "@/components/generic/RemSizeImage";
import { documentActions } from "./enums";
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
    {
      value: documentActions.Comments,
      icon:
        activeDocumentAction === documentActions.Comments
          ? "/assets/icons/docaction/comments-active.svg"
          : "/assets/icons/docaction/comments.svg",
    },
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

export const directoryContextMenuList = ({
  isMultipleSelected,
  onClickRename,
  onClickOpen,
  onClickDelete,
  onClickMoveTo,
  onClickDuplicate,
  disableMoveTo = false,
  disableDuplicate = false,
  OnClickDownload,
}) => [
  {
    label: "Open",
    icon: "open-icon.svg",
    iconUrl: isMultipleSelected
      ? "/assets/icons/open-disabled.svg"
      : "/assets/icons/open.svg",
    action: "open",
    class: isMultipleSelected ? "text-primary-gray" : "",
    onClick: isMultipleSelected ? () => {} : onClickOpen,
  },
  {
    label: "Rename",
    icon: "rename-icon.svg",
    iconUrl: isMultipleSelected
      ? "/assets/icons/rename-disabled.svg"
      : "/assets/icons/rename.svg",
    action: "rename",
    class: isMultipleSelected ? "text-primary-gray" : "",
    onClick: isMultipleSelected ? () => {} : onClickRename,
  },
  {
    label: "Move To",
    icon: "move-icon.svg",
    iconUrl: "/assets/icons/move-to.svg",
    action: "moveTo",
    class: disableMoveTo ? "text-primary-gray" : "",
    onClick: disableMoveTo ? () => {} : onClickMoveTo,
  },
  {
    label: "Duplicate",
    icon: "duplicate-icon.svg",
    iconUrl: "/assets/icons/duplicate.svg",
    action: "duplicate",
    class: disableDuplicate ? "text-primary-gray" : "",
    onClick: disableDuplicate ? () => {} : onClickDuplicate,
  },
  {
    label: "Download",
    icon: "download-icon.svg",
    iconUrl: "/assets/icons/download.svg",
    action: "download",
    onClick: OnClickDownload,
  },
  {
    label: "Delete",
    icon: "delete-icon.svg",
    iconUrl: "/assets/icons/delete-outline.svg",
    action: "delete",
    onClick: onClickDelete,
  },
];

export const countryCodeOptions = [
  {
    label: (
      <div className="flex items-center gap-[0.35rem]">
        <RemSizeImage
          imagePath={"/assets/icons/uk.svg"}
          remWidth={1}
          remHeight={1}
          alt={"dropdown"}
        />
        <span>+33</span>
      </div>
    ),
    value: "+33",
  },
  {
    label: (
      <div className="flex items-center gap-[0.35rem]">
        <RemSizeImage
          imagePath={"/assets/icons/uk.svg"}
          remWidth={1}
          remHeight={1}
          alt={"dropdown"}
        />
        <span>+44</span>
      </div>
    ),
    value: "+44",
  },
];

export const countryOptions = [
  {
    label: (
      <div className="flex items-center gap-[0.35rem]">
        <RemSizeImage
          imagePath={"/assets/icons/uk.svg"}
          remWidth={1}
          remHeight={1}
          alt={"dropdown"}
        />
        <span>France</span>
      </div>
    ),
    value: "france",
  },
  {
    label: (
      <div className="flex items-center gap-[0.35rem]">
        <RemSizeImage
          imagePath={"/assets/icons/uk.svg"}
          remWidth={1}
          remHeight={1}
          alt={"dropdown"}
        />
        <span>UK</span>
      </div>
    ),
    value: "uk",
  },
];
