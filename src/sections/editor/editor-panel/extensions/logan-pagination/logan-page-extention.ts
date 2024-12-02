import { Extension } from "@tiptap/core";
import { keymap } from "@tiptap/pm/keymap";
import { Selection } from "@tiptap/pm/state";
import { PaginationPlugin } from "./logan-page-plugin";

export const PaginationExtension = Extension.create({
  name: "pagination",
  addProseMirrorPlugins() {
    return [
      keymap({
        Enter: (state, dispatch) => {
          const { from, to } = state.selection;
          if (dispatch && from === to) {
            const tr = state.tr;
            const $pos = state.doc.resolve(from);

            if ($pos.parent.type.name === "paragraph") {
              const paragraph = state.schema.nodes.paragraph.create();
              tr.insert(from, paragraph);
              tr.setSelection(Selection.near(tr.doc.resolve(from + 1), 1));
              dispatch(tr);
              return true;
            }
          }
          return false;
        },
        // Backspace: (state, dispatch) => {
        //   const { from, to } = state.selection;
        //   if (from === to && (from === 2 || from === 1)) {
        //     return false;
        //   }
        //   return false;
        // },
        // Delete: (state, dispatch) => {
        //   const { from, to } = state.selection;
        //   const lastIndex = state.doc.content.size - 2;
        //   if (from === to && from === lastIndex) {
        //     return false;
        //   }
        //   return false;
        // },
      }),
      PaginationPlugin,
    ];
  },
});
