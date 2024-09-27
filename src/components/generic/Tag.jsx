"use client";
import { cn } from "@/utils/shadcn-utils";
import React from "react";

function Tag({
  textColor = "text-primary-blue",
  bgColor = "bg-secondary-blue",
  children,
  className = "",
}) {
  return (
    <div
      className={cn(
        "w-fit gap-1 rounded-md p-1 px-2 text-xs font-semibold",
        bgColor,
        textColor,
        className,
      )}
    >
      {children}
    </div>
  );
}

export default Tag;
