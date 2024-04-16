"use client";
import React from "react";

function Tags({ textColor = "", bgColor, children, className = "" }) {
  return (
    <span
      className={`p-1 px-2 text-xs font-semibold rounded-md ${bgColor} ${textColor} ${className}`}
    >
      {children}
    </span>
  );
}

export default Tags;
