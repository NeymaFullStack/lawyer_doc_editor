import { icons } from "@/components/icons";

type TabType = {
  label: string;
  icon: keyof typeof icons;
};

export const TAB_ITEMS: TabType[] = [
  { label: "Chatai", icon: "brain" },
  { label: "Variables", icon: "variable" },
  { label: "Indexing", icon: "indexing" },
  { label: "Versioning", icon: "version" },
  { label: "Comment", icon: "comment" },
  { label: "Preview", icon: "preview" },
];

type SelectContentType = {
  label: string;
  names?: string[];
  checked?: boolean[];
};

export const AGREEMENT_ITEMS: SelectContentType[] = [
  { label: "Annex 01 - Franchise Territory and Market Area " },
  { label: "Annex 02 - Marketing and Advertising Guidelines" },
  { label: "Annex 03 - Approved Suppliers and Vendors List" },
  { label: "Annex 04 - Franchisee’s Training Program Outline" },
];

export const PREVIEW_MAIN_TAP_ITEMS: SelectContentType[] = [
  {
    label: "Add a Cover",
    names: [
      "Logo",
      "Document Title",
      "Presenter's Info",
      "Add Assistant Info",
      "Company Details",
      "Client Name",
      "Document Status",
      "Confidentiality Notice",
      "Last Revision Date",
    ],
    checked: [true, true, true, false, false, false, false, false, false],
  },
  {
    label: "Add a Table of Contents",
    names: [
      "Show articles (1)",
      "Show sub-articles (1.1)",
      "Show sub-articles (1.1.1)",
      "Show sub-articles (1.1.1.1)",
    ],
    checked: [false, false, false, false],
  },
  {
    label: "Add Header",
    names: [
      "Logo",
      "Page Numbering",
      "Custom Text",
      "Last Revision Date",
      "Client Name",
    ],
    checked: [false, false, false, false, false],
  },
  {
    label: "Add Footer",
    names: [
      "Logo",
      "Page Numbering",
      "Custom Text",
      "Last Revision Date",
      "Client Name",
    ],
    checked: [false, false, false, false, false],
  },
];
