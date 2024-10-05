import { Extension } from "@tiptap/core";

export const FontSize = Extension.create({
  addOptions() {
    return {
      types: ["textStyle"],
    };
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize) =>
        ({ commands }) => {
          return commands.setMark("textStyle", { fontSize });
        },
      unsetFontSize:
        () =>
        ({ commands }) => {
          return commands.unsetMark("textStyle", { fontSize: null });
        },
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: ["paragraph"],
        attributes: {
          class: {},
        },
      },
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            parseHTML: (element) => element.style.fontSize.replace("pt", ""),
            renderHTML: (attributes) => {
              if (!attributes.fontSize) {
                return {};
              }

              return {
                style: `font-size: ${attributes.fontSize}pt`,
              };
            },
          },
        },
      },
    ];
  },
});
