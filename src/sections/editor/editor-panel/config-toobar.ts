import { icons } from "@/components/icons";

type ToolBarType = {
  label: string;
  icon: keyof typeof icons;
  dropdown?: boolean;
  divider?: boolean;
};

export const ToolBar_ITEMS: ToolBarType[] = [
  { label: "search", icon: "search", dropdown: true },
  { label: "chatai", icon: "chatai" },
  { label: "commentplus", icon: "commentplus", divider: true },
  { label: "previous", icon: "previous" },
  { label: "next", icon: "next", divider: true },
  { label: "bold", icon: "bold" },
  { label: "italic", icon: "italic" },
  { label: "underline", icon: "underline" },
  { label: "highlight", icon: "highlight", dropdown: true },
  { label: "color", icon: "color", dropdown: true },
  { label: "hyperlink", icon: "hyperlink", divider: true },
  { label: "bullets", icon: "bullets" },
  { label: "ordered", icon: "ordered", divider: true },
  { label: "footnotes", icon: "footnotes" },
  { label: "image", icon: "image" },
];

export const alignInfo = ["left", "center", "right", "justify"];

export const colors = [
  "#000000",
  "#434343",
  "#666666",
  "#b7b7b7",
  "#cccccc",
  "#d9d9d9",
  "#efefef",
  "#f3f3f3",
  "#f3f3f3",
  "#ffffff",
  "#980000",
  "#ff0000",
  "#ff9903",
  "#ffff05",
  "#03ff00",
  "#03ffff",
  "#4b86e8",
  "#0000ff",
  "#9900ff",
  "#ff00ff",
  "#e6b8af",
  "#f4cccc",
  "#fce5cd",
  "#fff3cc",
  "#d9ebd3",
  "#d0e0e3",
  "#c9dbf8",
  "#cfe3f3",
  "#d9d2e9",
  "#ead1dd",
  "#dd7e6b",
  "#eb9999",
  "#f9cb9c",
  "#ffe59a",
  "#b7d7a8",
  "#a2c4c9",
  "#a4c2f4",
  "#9fc5e8",
  "#b4a8d6",
  "#d5a6bd",
  "#cc4224",
  "#e06666",
  "#f6b26b",
  "#ffda66",
  "#93c47d",
  "#76a5af",
  "#6d9eeb",
  "#6fa8dd",
  "#8e7cc3",
  "#c27ba1",
  "#a71c00",
  "#cc0100",
  "#e69138",
  "#f1c233",
  "#6aa94f",
  "#45818e",
  "#3c78d8",
  "#3d86c6",
  "#674ea7",
  "#a64d7a",
  "#85210c",
  "#85210c",
  "#b46005",
  "#bf9001",
  "#38761d",
  "#134f5d",
  "#1255cc",
  "#0c5395",
  "#361c76",
  "#741c47",
  "#5b0f00",
  "#660000",
  "#793f04",
  "#7f6001",
  "#284e13",
  "#0c343d",
  "#1c4587",
  "#073763",
  "#20114d",
  "#4d1030",
];

export interface IconConfig {
  iconName: keyof typeof icons;
  onClick: () => void;
  className: string;
  rotate?: boolean;
}
