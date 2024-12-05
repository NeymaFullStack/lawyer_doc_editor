import { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { EditorView } from "@tiptap/pm/view";

export const Max_Page_Height: number = ((297 - 25.4 * 2) / 25.4) * 96;
export const MIN_PARAGRAPH_HEIGHT = 20;

export type NewAddNodeViewParams = {
  node: ProseMirrorNode;
  getPos: () => number;
  view: EditorView;
};

export type NewAddNodeViewReturn = {
  dom: HTMLElement;
  contentDOM: HTMLElement;
  update(updatedNode: ProseMirrorNode): boolean;
};
