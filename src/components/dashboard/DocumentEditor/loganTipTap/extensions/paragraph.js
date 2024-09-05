import Paragraph from "@tiptap/extension-paragraph";
import { findParentNode } from "prosemirror-utils";

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
  addKeyboardShortcuts() {
    return {
      Backspace: ({ editor }) => {
        const { $from, $to } = editor.state.selection;
        // Check if the paragraph is empty
        const isEmptyParagraph = $from.parent.content.size === 0;

        const prevNodePos = $from.before();
        const prevResolvedPos = editor.state.doc.resolve(prevNodePos);

        const nextNodePos = $to.after();

        // Find the nodes at those positions
        const prevNode = prevResolvedPos.nodeBefore;
        const nextNode = editor.state.doc.nodeAt(nextNodePos);
        const isBetweenDocArticles =
          prevNode &&
          nextNode &&
          prevNode.type.name === "classIdDiv" &&
          nextNode.type.name === "classIdDiv";

        if (isEmptyParagraph && isBetweenDocArticles) {
          const tr = editor.state.tr;

          // Delete the empty paragraph without merging surrounding content
          tr.delete($from.before(), $to.after());

          // Reset selection to avoid merging nodes
          const newSelection = editor.state.selection.constructor.near(
            tr.doc.resolve($from.before()),
          );
          tr.setSelection(newSelection);

          editor.view.dispatch(tr);
          return true;
        }

        return false;
      },

      Enter: ({ editor }) => {
        const { state, commands } = editor;
        const { selection } = state;
        const { $from, from, to, $cursor } = selection;

        let parentNode = $cursor.node(-1);
        let currentNode = $cursor.node();
        let startingPos = $cursor.before();
        let endingPos = $cursor.after();
        if (currentNode && currentNode.attrs.class === "article-heading") {
          // Insert a new paragraph without inheriting the class
          if ($cursor.pos - 1 === startingPos) {
            commands.insertContentAt($from.before(-1), {
              type: "paragraph",
              attrs: {},
            });
          } else if ($cursor.pos + 1 === endingPos) {
            commands.insertContentAt($from.after(), {
              type: "paragraph",
              attrs: {},
            });
          }

          return true;
        }
        const isEmptyParagraph = currentNode.textContent.length === 0;

        if (
          isEmptyParagraph &&
          parentNode.type.name === "classIdDiv" &&
          parentNode.attrs.class === "doc-article" &&
          parentNode.lastChild !== $from.node()
        ) {
          commands.insertContentAt($from.after(), {
            type: "paragraph",
            attrs: {},
          });
          return true;
        }
        return false; // Fall back to default behavior
      },
    };
  },
});
