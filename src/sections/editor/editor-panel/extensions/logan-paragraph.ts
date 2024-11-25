import { Paragraph } from "@tiptap/extension-paragraph";
import { mergeAttributes } from "@tiptap/core";

export const LoganParagraph = Paragraph.extend({
  addOptions() {
    return { HTMLAttributes: {} };
  },

  group: "block",
  content: "inline*",
  renderHTML({ node, HTMLAttributes }) {
    // @ts-ignore
    if (HTMLAttributes.id) node.attrs.id = HTMLAttributes.id;
    return [
      "p",
      mergeAttributes(this.options.HTMLAttributes ?? {}, HTMLAttributes),
      0,
    ];
  },
});
