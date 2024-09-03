import Paragraph from "@tiptap/extension-paragraph";

export const customParagraph = Paragraph.extend({
  content: "inline*",

  renderHTML({ HTMLAttributes }) {
    // Handle the style attribute and avoid duplicating text-align
    if (HTMLAttributes.class === "appendix-seprator") {
      return ["p", { ...HTMLAttributes, contenteditable: "false" }, 0];
    }

    return ["p", { ...HTMLAttributes }, 0];
  },
});
