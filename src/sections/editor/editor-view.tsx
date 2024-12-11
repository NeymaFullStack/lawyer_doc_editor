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
import { Separator } from "@/components/ui/separator";
import { EditorTabPreview } from "./editor-tab-group/editor-tab-preview";
import { EditorTabComments } from "./editor-tab-group/editor-tab-comments";

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
  const { isOpen, selected } = useTabContext();

  // Mapped rendering of selected tab
  const renderSelectedTab =
    {
      Preview: <EditorTabPreview />,
      Comment: <EditorTabComments />,
    }[selected as string] || null;

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel
        id="panel-1"
        order={1}
        defaultSize={isOpen ? 60 : 100}
        className="bg-logan-primary-200"
      >
        <EditorPanelView />
      </ResizablePanel>

      {isOpen && <ResizableHandle className="bg-logan-primary-300" />}

      {isOpen && (
        <ResizablePanel
          id="panel-2"
          order={2}
          defaultSize={40}
          maxSize={40}
          className="bg-logan-primary-100"
        >
          {renderSelectedTab}
        </ResizablePanel>
      )}
    </ResizablePanelGroup>
  );
};
