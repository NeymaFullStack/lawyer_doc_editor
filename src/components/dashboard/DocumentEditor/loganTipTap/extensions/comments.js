import { Mark } from "@tiptap/core";
import { Plugin } from "prosemirror-state";
// import { TextStyle } from "@tiptap/extension-text-style";

const CommentHighlight = Mark.create({
  name: "commentHighlight",

  addOptions() {
    return {
      HTMLAttributes: {},
      handleClick: null, // Click handler option passed from React component
    };
  },

  addAttributes() {
    return {
      commentId: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-comment-id"),
        renderHTML: (attributes) => {
          if (!attributes.commentId) {
            return {};
          }

          return {
            "data-comment-id": attributes.commentId,
          };
        },
      },
      color: {
        default: "#FFEB3B", // Default highlight color
        parseHTML: (element) => element.style.backgroundColor,
        renderHTML: (attributes) => {
          return {
            style: `background-color: ${attributes.color}`,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-comment-id]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", HTMLAttributes, 0];
  },

  addCommands() {
    return {
      setCommentHighlight:
        (commentId, color) =>
        ({ commands }) => {
          console.log("In setCommentHighlight");
          return commands.setMark(this.name, { commentId, color });
        },
      toggleCommentHighlight:
        (commentId, color) =>
        ({ commands }) => {
          return commands.toggleMark(this.name, { commentId, color });
        },
      unsetCommentHighlight:
        (commentId) =>
        ({ state, dispatch }) => {
          console.log("In unsetCommentHighlight");
          const { tr } = state;
          state.doc.descendants((node, pos) => {
            if (
              node.marks.some(
                (mark) =>
                  mark.type.name === this.name &&
                  mark.attrs.commentId === commentId,
              )
            ) {
              tr.removeMark(pos, pos + node.nodeSize, this.type);
            }
          });
          if (tr.docChanged) {
            dispatch(tr);
            return true;
          }
          return false;
        },
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleClick: (view, pos, event) => {
            const { handleClick } = this.options;
            if (
              handleClick &&
              event.target instanceof HTMLElement &&
              event.target.hasAttribute("data-comment-id")
            ) {
              handleClick(event); // Call the click handler from options
              return true; // Prevent default behavior if a handler exists
            }
            return false; // Allow default behavior
          },
        },
      }),
    ];
  },

  addKeyboardShortcuts() {
    return {
      "Mod-Shift-c": () => this.editor.commands.toggleCommentHighlight(),
    };
  },
});

export default CommentHighlight;
