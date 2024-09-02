"use client";
import { documentActions } from "@/constants/enums";
import React from "react";
import { useSelector } from "react-redux";
import LoganPageEditTool from "./LoganPageEditTool";
import LoganDocPreviewTool from "./LoganDocPreviewTool";
import LoganDocVersionHistoryTool from "./versionTool/LoganDocVersionHistoryTool";
import LoganDraftTool from "./draftTool/LoganDraftTool";
import LoganVariableTool from "./variableTool/LoganVariableTool";
import LoganReferenceTool from "./referenceTool/LoganReferenceTool";
import { cn } from "@/utils/shadcn-utils";

function LoganTools() {
  const { activeDocumentAction, isEditorToolHidden } = useSelector(
    (state) => state.documentReducer,
  );
  return (
    !isEditorToolHidden && (
      <div className={cn("h-full w-[26.5rem] overflow-hidden bg-white")}>
        {switchTool()}
      </div>
    )
  );

  function switchTool() {
    switch (activeDocumentAction) {
      case documentActions.Draft:
        return <LoganDraftTool />;
      case documentActions.VariableTool:
        return <LoganVariableTool />;
      case documentActions.Reference:
        return <LoganReferenceTool />;
      case documentActions.PageEdit:
        return <LoganPageEditTool />;
      case documentActions.VersionHistory:
        return <LoganDocVersionHistoryTool />;
      case documentActions.Preview:
        return <LoganDocPreviewTool />;
    }
  }
}

export default LoganTools;
