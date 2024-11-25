import { Separator } from "@/components/ui/separator";
import { EditorContentView } from "./editor-content-view";
import { EditorToolbarView } from "./editor-toolbar-view";
import { useEditor } from "@tiptap/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDocumentContext } from "@/layouts/document";
import axios, { endpoints } from "@/lib/axios";
import { useCallback, useEffect, useState } from "react";
import { LoganKit } from "./extensions/logan-kit";

export const EditorPanelView = () => {
  const { document: documents } = useDocumentContext();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const editor = useEditor({
    extensions: [LoganKit],
    content: "",
    editorProps: {
      attributes: {
        class: "tiptap-editor",
      },
    },
    immediatelyRender: false,
  });

  const fetchCurrentVersion = useCallback(
    async (documentId: string, versionId: string) => {
      if (!versionId || !documentId) return;

      try {
        const res = await axios.get(
          endpoints.document.currentVersion(documentId, versionId)
        );
        const docContent = res.data.content_details.content;
        if (editor) {
          editor.commands.setContent(docContent);
        }
      } catch (error) {
        console.error("Failed to fetch current version:", error);
      }
    },
    [editor]
  );

  useEffect(() => {
    if (documents?.id && documents?.current_version)
      fetchCurrentVersion(documents?.id, documents?.current_version.version_id);
  }, [documents?.id, documents?.current_version, fetchCurrentVersion]);

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex flex-col gap-0">
      <EditorToolbarView editor={editor} />
      <Separator className="bg-logan-primary-300" />
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="flex justify-center p-10">
          <div className="max-w-[800px] w-full bg-white">
            <EditorContentView editor={editor} />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
