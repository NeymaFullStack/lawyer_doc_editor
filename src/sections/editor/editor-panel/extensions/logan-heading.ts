import { Heading } from "@tiptap/extension-heading";
import { mergeAttributes } from "@tiptap/react";

export const LoganHeading = Heading.extend({
  group: "block",
  content: "inline*",
  addAttributes() {
    return { ...this.parent?.() };
  },
  renderHTML({ node, HTMLAttributes }) {
    // @ts-ignore
    if (HTMLAttributes.id) node.attrs.id = HTMLAttributes.id;

    const hasLevel = this.options.levels?.includes(node.attrs.level);
    const level = hasLevel ? node.attrs.level : this.options.levels?.at(0);

    return [
      `h${level}`,
      mergeAttributes(this.options.HTMLAttributes ?? {}, HTMLAttributes),
      0,
    ];
  },
});
