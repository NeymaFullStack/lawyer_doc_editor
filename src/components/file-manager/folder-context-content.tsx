import {
  Trash2,
  CopyPlus,
  Download,
  ExternalLink,
  FolderSymlink,
  NotebookPen,
} from "lucide-react";
import { iconColors } from "../../../tailwind.config";
import { ContextMenuContent, ContextMenuItem } from "../ui/context-menu";

const CONTEXT_MENU_ITEMS = [
  { label: "Open", icon: ExternalLink },
  { label: "Rename", icon: NotebookPen },
  { label: "Duplicate", icon: CopyPlus },
  { label: "Download", icon: Download },
  { label: "Move to", icon: FolderSymlink },
  { label: "Delete", icon: Trash2 },
];

export const FolderContextContent = () => {
  return (
    <ContextMenuContent className="w-36 rounded-xl gap-2">
      {CONTEXT_MENU_ITEMS.map(({ label, icon: IconComponent }, index) => (
        <ContextMenuItem
          key={label} // Use label as the unique key
          className="flex items-center gap-2 rounded-lg p-2"
        >
          <IconComponent size={16} color={iconColors.gray} />
          <span className="text-sm font-medium text-logan-black">{label}</span>
        </ContextMenuItem>
      ))}
    </ContextMenuContent>
  );
};
