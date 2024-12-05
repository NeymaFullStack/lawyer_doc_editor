import { Editor, EditorContent } from "@tiptap/react";

type EditorContentViewProps = {
  editor: Editor | null;
};

export const EditorContentView = ({ editor }: EditorContentViewProps) => {
  return <EditorContent editor={editor}></EditorContent>;
};
