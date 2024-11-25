import { Node } from "@tiptap/core";
import { NODE_NAMES } from "./logan-editor-config";

export type DocumentOptions = {};

export const LoganDocument = Node.create<DocumentOptions>({
  name: "doc",
  topNode: true,
  content: `block+`,
});
