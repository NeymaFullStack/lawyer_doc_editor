"use client";
import { documentActions } from "@/constants/enums";
import { useSelector } from "react-redux";
import LoganPageEditTool from "./LoganPageEditTool";
import LoganDocPreviewTool from "./LoganDocPreviewTool";
import LoganDocVersionHistoryTool from "./versionTool/LoganDocVersionHistoryTool";
import LoganDraftTool from "./draftTool/LoganDraftTool";
import LoganVariableTool from "./variableTool/LoganVariableTool";
import LoganReferenceTool from "./referenceTool/LoganReferenceTool";
import Comments from "../commentTool/commnets";
import { cn } from "@/utils/shadcn-utils";

function LoganTools() {
  const { activeDocumentAction, isEditorToolHidden } = useSelector(
    (state) => state.documentReducer,
  );

  return (
    <div
      className={cn(
        "h-full overflow-hidden transition-all  ease-in-out",
        isEditorToolHidden
          ? "w-0 translate-x-full opacity-0 duration-300"
          : "w-[26.5rem] translate-x-0 opacity-100 duration-300",
      )}
    >
      {!isEditorToolHidden && (
        <div className="h-full w-full">{switchTool()}</div>
      )}
    </div>
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
      case documentActions.Comments:
        return <Comments />;
      default:
        return null;
    }
  }
}

export default LoganTools;
