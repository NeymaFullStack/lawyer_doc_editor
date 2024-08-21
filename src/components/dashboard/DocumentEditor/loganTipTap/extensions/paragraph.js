import Paragraph from "@tiptap/extension-paragraph";

export const customParagraph = Paragraph.extend({
  content: "inline*",
  addAttributes() {
    return {
      class: {
        default: null,
      },
      id: {
        default: null,
      },
      style: {
        default: null,
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "p",
        getAttrs: (dom) => {
          return {
            class: dom.getAttribute("class"),
            id: dom.getAttribute("id"),
            style: dom.getAttribute("style"),
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    if (HTMLAttributes.class === "appendix-seprator") {
      return ["p", { ...HTMLAttributes, contenteditable: false }, 0];
    }
    return ["p", { ...HTMLAttributes }, 0];
  },
});
