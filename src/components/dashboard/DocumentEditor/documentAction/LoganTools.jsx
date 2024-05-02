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

function LoganTools({ docDetails }) {
  const activeDocumentAction = useSelector(
    (state) => state.documentReducer.activeDocumentAction,
  );
  return <>{switchTool()}</>;

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
        return <LoganDocPreviewTool docDetails={docDetails} />;
    }
  }
}

export default LoganTools;
