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
};

export const AGREEMENT_ITEMS: SelectContentType[] = [
  { label: "Annex 01 - Franchise Territory and Market Area " },
  { label: "Annex 02 - Marketing and Advertising Guidelines" },
  { label: "Annex 03 - Approved Suppliers and Vendors List" },
  { label: "Annex 04 - Franchisee’s Training Program Outline" },
];
