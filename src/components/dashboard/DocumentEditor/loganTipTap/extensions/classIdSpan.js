// extensions/CustomSpan.js
import { Node, mergeAttributes } from "@tiptap/core";
import { Fascinate_Inline } from "next/font/google";

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
  atom: false, // Treat as a single unit for selection and deletion
  selectable: true, // Allow selection
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
        getAttrs: (dom) => ({
          class: dom.getAttribute("class"),
          id: dom.getAttribute("id"),
        }),
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
      const dom = document.createElement("span");
      dom.textContent = node.textContent;
      Object.entries(node.attrs).forEach(([key, value]) => {
        if (value) {
          dom.setAttribute(key, value);
        }
      });

      // Handle click event
      dom.addEventListener("click", () => {
        const { state, dispatch } = editor.view;
        const transaction = state.tr.setSelection(
          NodeSelection.create(state.doc, getPos()),
        );
        dispatch(transaction);
      });

      if (node.textContent === "") {
        const { state, dispatch } = editor.view;
        const transaction = state.tr.delete(getPos(), getPos() + node.nodeSize);
        dispatch(transaction);
        return null;
      }

      return {
        dom,
        // update: (updatedNode) => {
        //   if (updatedNode.type !== node.type) {
        //     return false;
        //   }

        //   Object.entries(updatedNode.attrs).forEach(([key, value]) => {
        //     if (value) {
        //       dom.setAttribute(key, value);
        //     }
        //   });
        //   return true;
        // },
        selectNode: () => {
          dom.classList.add("is-selected");
        },
        deselectNode: () => {
          dom.classList.remove("is-selected");
        },
      };
    };
  },
  // addCommands() {
  //   return {
  //     replaceTextInNodeWithClassAndValue:
  //       (className, prevText, newText) =>
  //       ({ state, dispatch }) => {
  //         let allowChange = false;
  //         const { doc, schema } = state;
  //         const tr = state.tr;
  //         // console.log("2");
  //         doc.descendants((node, pos) => {
  //           if (allowChange) {
  //             // const nodeType = schema.nodes.classIdSpan;
  //             // const newAttrs = { ...node.attrs };
  //             // const newNode = nodeType.create(newAttrs, schema.text(newText));
  //             // console.log("pos", pos);
  //             // console.log("textContent", node.textContent.length);
  //             // console.log("nodesize", node.nodeSize);

  //             tr.replaceText(pos, pos + node.nodeSize, newText);
  //             allowChange = false;
  //           }
  //           if (
  //             node.type.name === "classIdSpan" &&
  //             node.attrs.class === className &&
  //             node.textContent === prevText
  //           ) {
  //             allowChange = true;
  //           }
  //         });

  //         if (tr.docChanged) {
  //           dispatch(tr);
  //           return true;
  //         }
  //         return false;
  //       },
  //   };
  // },
});

export default classIdSpan;
