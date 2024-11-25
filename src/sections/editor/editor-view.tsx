"use client";

import { useDocumentContext } from "@/layouts/document";
import { EditorTabGroupView } from "./editor-tab-group/editor-tab-group-view";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { TabProvider, useTabContext } from "./editor-tab-group/use-tab-context";
import { EditorPanelView } from "./editor-panel/editor-panel-view";

export const EditorView = () => {
  return (
    <TabProvider>
      <div className="flex gap-5 items-stretch justify-between h-full w-full">
        <div className="flex-grow rounded-t-xl border-t border-l border-r border-logan-primary-300 overflow-hidden">
          <EditorPanelGroup />
        </div>
        <EditorTabGroupView />
      </div>
    </TabProvider>
  );
};

export const EditorPanelGroup = () => {
  const { isOpen } = useTabContext();
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel
        defaultSize={isOpen ? 60 : 100}
        className="bg-logan-primary-200"
      >
        <EditorPanelView />
      </ResizablePanel>

      {isOpen && <ResizableHandle className="bg-logan-primary-300" />}
      {isOpen && (
        <ResizablePanel
          defaultSize={40}
          maxSize={40}
          className="bg-gradient bg-gradient-to-tr from-logan-primary-200 to-white"
        >
          This is the tab panel of editor
        </ResizablePanel>
      )}
    </ResizablePanelGroup>
  );
};
