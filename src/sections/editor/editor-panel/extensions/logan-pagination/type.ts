import { Node as ProseMirrorNode } from "@tiptap/pm/model";

export type NewAddNodeViewParams = {
  node: ProseMirrorNode;
  getPos: () => number;
};

export type NewAddNodeViewReturn = {
  dom: HTMLElement;
  contentDOM: HTMLElement;
  update(updatedNode: ProseMirrorNode): boolean;
};
