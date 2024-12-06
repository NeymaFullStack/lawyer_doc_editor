import { Mark } from "@tiptap/core";

const LoganComment = Mark.create({
  name: "LoganComment",

  defaultOptions: {
    HTMLAttributes: {
      class: "logan-comment",
    },
  },

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: (element) => ({
          id: element.getAttribute("id"),
        }),
        renderHTML: (attributes) => ({
          id: attributes.id ? `id="${attributes.id}"` : "",
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: "span.logan-comment" }];
  },
});
