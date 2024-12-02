import { icons } from "@/components/icons";

type TabType = {
  label: string;
  icon: keyof typeof icons;
};

export const TAB_ITEMS: TabType[] = [
  { label: "chatai", icon: "brain" },
  { label: "variables", icon: "variable" },
  { label: "indexing", icon: "indexing" },
  { label: "versioning", icon: "version" },
  { label: "comment", icon: "comment" },
  { label: "preview", icon: "preview" },
];
