"use client";
import React from "react";
import LoadingIcon from "./LoadingIcon";
import { cn } from "@/utils/shadcn-utils";

function Loader({ className, height, width }) {
  return (
    <div
      className={cn(
        "bg-[rgb(90 86 86 / 80%)]  flex h-full w-full items-center justify-center",
        className,
      )}
    >
      <LoadingIcon height={height} width={width} />
    </div>
  );
}

export default Loader;
