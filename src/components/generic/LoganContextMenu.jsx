import React, { useEffect, useState } from "react";
import RemSizeImage from "@/components/generic/RemSizeImage";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { cn } from "@/utils/shadcn-utils";

function LoganContextMenu({ children, onOpenChange, contextMenuItems }) {
  return (
    <ContextMenu onOpenChange={onOpenChange}>
      <ContextMenuTrigger className="w-full">{children}</ContextMenuTrigger>
      <ContextMenuContent
        onClick={(e) => e.stopPropagation()}
        className="w-[7rem] min-w-[6.313rem] shadow-sm"
      >
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
              <span className={cn("", item?.class)}>{item.label}</span>
            </ContextMenuItem>
          );
        })}
      </ContextMenuContent>
    </ContextMenu>
  );
}

export default LoganContextMenu;
