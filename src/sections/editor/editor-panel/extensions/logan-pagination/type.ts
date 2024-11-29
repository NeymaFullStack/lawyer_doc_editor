import { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { NodeView, EditorView } from "@tiptap/pm/view";

export type NodeViewCreator = (
  node: ProseMirrorNode,
  view: EditorView,
  getPos: () => number
) => NodeView;
