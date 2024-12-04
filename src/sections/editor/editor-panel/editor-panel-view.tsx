import { useCallback, useEffect, useState } from "react";
import axios, { endpoints } from "@/lib/axios";
import { useEditor } from "@tiptap/react";
import DOMPurify from "dompurify";
import { Separator } from "@/components/ui/separator";
import { EditorContentView } from "./editor-content-view";
import { EditorToolbarView } from "./editor-toolbar-view";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDocumentContext } from "@/layouts/document";
import { LoganKit } from "./extensions/logan-kit";
import { useTabContext } from "../editor-tab-group/use-tab-context";

export const EditorPanelView = () => {
  const { document: documents } = useDocumentContext();
  const {showPreview} = useTabContext();
  const [isClient, setIsClient] = useState(false);
  const [content, setContent] = useState<string>("");

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
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
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
          setTimeout(() => {
            editor.commands.insertContentAt(editor.state.doc.content.size, " ");
          }, 100);
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
          <div className="max-w-[794px] w-full h-380 bg-white">
            {!showPreview ? (
              <EditorContentView editor={editor} />
            ) : (
              <div
                className="tiptap-editor-preview"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(content),
                }}
              />
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
