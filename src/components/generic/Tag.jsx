"use client";
import React from "react";

function Tag({
  textColor = "text-primary-blue",
  bgColor = "bg-secondary-blue",
  children,
  className = "",
}) {
  return (
    <div
      className={`flex w-fit items-center gap-1 rounded-md p-1 px-2 text-xs font-semibold ${bgColor} ${textColor} ${className}`}
    >
      {children}
    </div>
  );
}

export default Tag;
