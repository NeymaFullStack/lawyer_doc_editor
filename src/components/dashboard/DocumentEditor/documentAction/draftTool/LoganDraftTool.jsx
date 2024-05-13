"use client";
import React from "react";
import LoganDocumentBase from "./LoganDocumentBase";
import LoganChatBox from "./LoganChatBox";

function LoganDraftTool() {
  return (
    <div className="flex h-full w-[26.5rem] flex-col overflow-hidden">
      <LoganChatBox />
      {/* <LoganDocumentBase /> */}
    </div>
  );
}

export default LoganDraftTool;
