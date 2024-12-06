import { useCallback, useEffect, useState } from "react";
import axios, { endpoints } from "@/lib/axios";
import { useEditor } from "@tiptap/react";
import { Separator } from "@/components/ui/separator";
import { EditorContentView } from "./editor-content-view";
import { EditorToolbarView } from "./editor-toolbar-view";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDocumentContext } from "@/layouts/document";
import { LoganKit } from "./extensions/logan-kit";
import { useTabContext } from "../editor-tab-group/use-tab-context";
import { PaginationExtension } from "./extensions/logan-pagination/logan-page-extention";
import { PageCover } from "../template/page-cover";
import { PageTableContents } from "../template/page-table-contents";

export const EditorPanelView = () => {
  const { document: documents } = useDocumentContext();
  const [isClient, setIsClient] = useState(false);
  const { showPreview } = useTabContext();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const editor = useEditor({
    extensions: [LoganKit],
    content: "",
    editorProps: {
      attributes: {
        class:
          "tiptap-editor !bg-white p-20 border border-logan-primary-200 hover:border-logan-blue transition-all hover:shadow-badge-md",
      },
    },
    immediatelyRender: false,
  });

  const previewEditor = useEditor({
    extensions: [LoganKit, PaginationExtension],
    content: "",
    editorProps: {
      attributes: {
        class: "tiptap-editor",
      },
    },
    editable: false,
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

  useEffect(() => {
    previewEditor?.commands.setContent(editor?.getHTML() || "");
    console.log("html: ", editor?.getHTML());
    setTimeout(() => {
      previewEditor?.commands.insertContentAt(
        previewEditor?.state.doc.content.size,
        " "
      );
    }, 1000);
  }, [showPreview]);

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
            {showPreview && (
              <>
                <PageCover />
                <PageTableContents />
              </>
            )}
            <EditorContentView editor={showPreview ? previewEditor : editor} />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
