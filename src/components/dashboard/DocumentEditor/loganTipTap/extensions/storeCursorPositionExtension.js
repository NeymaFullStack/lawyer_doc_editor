import { Extension } from "@tiptap/core";
import { Plugin } from "@tiptap/pm/state";

const StoreCursorPositionExtension = Extension.create({
  name: "storeCursorPosition",

  addStorage() {
    return {
      lastCursorPosition: null,
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleDOMEvents: {
            blur: (view, event) => {
              // Store the current cursor position before blur
              this.editor.storage.storeCursorPosition.lastCursorPosition =
                view.state.selection;
              return false;
            },
          },
        },
      }),
    ];
  },
});

export default StoreCursorPositionExtension;
