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
  renderHTML({ HTMLAttributes }) {
    // Extract the class attribute and any other attributes
    const { class: className, ...restAttributes } = HTMLAttributes;
    // Check if the class name is "appendix-seprator" and apply contenteditable attribute
    if (className === "appendix-seprator") {
      debugger;

      return [
        "p",
        { class: className, contenteditable: "false", ...restAttributes },
        0,
      ];
    }

    // Return with all attributes, including the class name
    return ["p", { class: className, ...restAttributes }, 0];
  },
});
