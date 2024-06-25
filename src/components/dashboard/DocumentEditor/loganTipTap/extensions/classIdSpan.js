// extensions/CustomSpan.js
import { Node, mergeAttributes } from "@tiptap/core";
import { Fragment, Slice } from "@tiptap/pm/model";
import { Plugin, PluginKey } from "@tiptap/pm/state";

// export const classIdSpan = Node.create({
//   name: "classIdSpan",
//   content: "inline*",
//   group: "inline",

//   inline: true,
//   draggable: false,
//   selectable: true,
//   atom: true,
//   addAttributes() {
//     return {
//       class: {
//         default: null,
//       },
//       id: {
//         default: null,
//       },
//     };
//   },

//   parseHTML() {
//     return [
//       {
//         preserveWhitespace: true,
//         tag: "span",
//         getAttrs: (dom) => ({
//           class: dom.getAttribute("class"),
//           id: dom.getAttribute("id"),
//         }),
//       },
//     ];
//   },

//   renderHTML({ HTMLAttributes }) {
//     return [
//       "span",
//       mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
//         contenteditable: false,
//         draggable: false,
//       }),
//       0,
//     ];
//   },

//   addCommands() {
//     return {
//       setclassIdSpan:
//         (attributes) =>
//         ({ commands }) => {
//           return commands.setNode(this.name, attributes);
//         },
//       toggleclassIdSpan:
//         (attributes) =>
//         ({ commands }) => {
//           return commands.toggleNode(this.name, "paragraph", attributes);
//         },
//     };
//   },
// });

import { NodeSelection } from "prosemirror-state";

export const classIdSpan = Node.create({
  name: "classIdSpan",
  content: "inline*",
  group: "inline",
  inline: true,
  selectable: true, // Allow selection
  draggable: false,
  addAttributes() {
    return {
      class: {
        default: null,
      },
      id: {
        default: null,
      },
    };
  },
  parseHTML() {
    return [
      {
        preserveWhitespace: true,
        tag: "span",
        getAttrs: (dom) => {
          return {
            class: dom.getAttribute("class"),
            id: dom.getAttribute("id"),
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    return [
      "span",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        contenteditable: false,
      }),
      0,
    ];
  },
  addNodeView() {
    return ({ node, getPos, editor }) => {
      if (
        node.attrs.class === "doc-article" &&
        node.attrs.class !== "doc-variable"
      ) {
        // if (node.textContent === "") {
        //   debugger;
        //   const { state, dispatch } = editor.view;
        //   const transaction = state.tr.delete(
        //     getPos(),
        //     getPos() + node.nodeSize,
        //   );
        //   dispatch(transaction);
        //   return null;
        // }
        return;
      }
      const dom = document.createElement("span");
      dom.textContent = node.textContent;
      Object.entries(node.attrs).forEach(([key, value]) => {
        if (value) {
          dom.setAttribute(key, value);
        }
      });

      // Handle click event
      node.attrs.class === "doc-variable" ||
        (node.attrs.class === "doc-article-title" &&
          dom.addEventListener("click", () => {
            const { state, dispatch } = editor.view;
            const transaction = state.tr.setSelection(
              NodeSelection.create(state.doc, getPos()),
            );
            dispatch(transaction);
          }));

      // if (node.textContent === "") {
      //   debugger;
      //   const { state, dispatch } = editor.view;
      //   const transaction = state.tr.delete(getPos(), getPos() + node.nodeSize);
      //   dispatch(transaction);
      //   return null;
      // }

      return {
        dom,
        selectNode: () => {
          dom.classList.add("is-selected");
        },
        deselectNode: () => {
          dom.classList.remove("is-selected");
        },
      };
    };
  },
  addCommands() {
    return {
      replaceTextInNodeWithClassAndValue:
        (prevText, newText) =>
        ({ state, dispatch }) => {
          if (prevText === newText) {
            return false;
          }
          const { schema, tr, doc } = state;
          const customNodeType = schema.nodes.classIdSpan;
          let trMapping = tr.mapping;
          doc.descendants((node, pos) => {
            // debugger;
            if (
              node.type.name === "classIdSpan" &&
              node?.textContent === prevText
            ) {
              const mappedPos = trMapping.map(pos);

              if (newText === "") {
                tr.delete(mappedPos, mappedPos + node.nodeSize);
              } else {
                const newTextNode = schema.text(newText);
                const newCustomNode = customNodeType.create(
                  node.attrs,
                  newTextNode,
                );
                const slice = new Slice(Fragment.from(newCustomNode), 0, 0);

                tr.replace(mappedPos, mappedPos + node.nodeSize, slice);
              }
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
          handleKeyDown: (view, event) => {
            if (event.key === "Backspace") {
              const { state } = view;
              const { selection } = state;
              const { $from, node: selectedNode } = selection;
              const prevNode = $from.nodeBefore;
              const nextNode = $from.nodeAfter;
              if (selectedNode?.attrs?.class === "doc-article-title") {
                event.preventDefault();
                this.options.openModal(selectedNode);
                return true;
              } else if (prevNode?.attrs?.class === "doc-article-title") {
                event.preventDefault();
                this.options.openModal(selectedNode);
                return true;
              }
            }
            return false;
          },
        },
      }),
    ];
  },
});

export default classIdSpan;
