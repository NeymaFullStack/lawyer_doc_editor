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
          className="bg-logan-primary-100 "
        >
          <div>
            <div className="px-5 py-2 h-11 leading-7 font-semibold text-logan-black-foreground text-sm">
              {selected}
            </div>
            <Separator className="bg-logan-primary-300" />
            {selected === "Preview" && <EditorTabPreview />}
          </div>
        </ResizablePanel>
      )}
    </ResizablePanelGroup>
  );
};
