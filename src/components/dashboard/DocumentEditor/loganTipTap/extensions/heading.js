import Heading from "@tiptap/extension-heading";

// Extend the Heading node
export const CustomHeading = Heading.extend({
  // Extend the schema to include class and id attributes
  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: null,
        parseHTML: (element) => element.getAttribute("class"),
        renderHTML: (attributes) => {
          if (!attributes.class) {
            return {};
          }
          return {
            class: attributes.class,
          };
        },
      },
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute("id"),
        renderHTML: (attributes) => {
          if (!attributes.id) {
            return {};
          }
          return {
            id: attributes.id,
          };
        },
      },
    };
  },

  // Override the parseHTML method to ensure the attributes are parsed
  parseHTML() {
    return this.options.levels.map((level) => ({
      tag: `h${level}`,
      getAttrs: (element) => ({
        level,
        class: element.getAttribute("class"),
        id: element.getAttribute("id"),
      }),
    }));
  },

  // Override the renderHTML method to ensure the attributes are rendered
  renderHTML({ node, HTMLAttributes }) {
    return [
      `h${node.attrs.level}`,
      {
        ...HTMLAttributes,
        class: node.attrs.class,
        id: node.attrs.id,
      },
      0,
    ];
  },
});
