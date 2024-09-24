import React from "react";
import RemSizeImage from "@/components/generic/RemSizeImage";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/shadcn-components/ui/context-menu";

function LoganContextMenu({ children, onOpenChange, contextMenuItems }) {
  return (
    <ContextMenu onOpenChange={onOpenChange}>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-[6.313rem] min-w-[6.313rem] shadow-sm">
        {contextMenuItems?.map((item) => {
          return (
            <ContextMenuItem
              className="flex cursor-pointer items-center gap-2 text-xs"
              key={item?.label}
              onClick={() => item?.onClick()}
            >
              <RemSizeImage
                imagePath={item.iconUrl}
                remWidth={1}
                remHeight={1}
                alt={item.icon}
              />
              <span>{item.label}</span>
            </ContextMenuItem>
          );
        })}
      </ContextMenuContent>
    </ContextMenu>
  );
}

export default LoganContextMenu;
