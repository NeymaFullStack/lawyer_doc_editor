import { Editor, EditorContent } from "@tiptap/react";

type EditorContentViewProps = {
  editor: Editor | null;
};

export const EditorContentView = ({ editor }: EditorContentViewProps) => {
  // console.log("EditorContentView rendered -> ", editor);
  return <EditorContent editor={editor}></EditorContent>;
};
