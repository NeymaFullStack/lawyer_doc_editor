import React from "react";
import LoganDocumentBase from "./LoganDocumentBase";
import LoganChatBox from "./LoganChatBox";

function LoganDraftTool() {
  return (
    <div className="flex flex-col w-[26.5rem] h-full overflow-hidden">
      <LoganChatBox />
      <LoganDocumentBase />
    </div>
  );
}

export default LoganDraftTool;
