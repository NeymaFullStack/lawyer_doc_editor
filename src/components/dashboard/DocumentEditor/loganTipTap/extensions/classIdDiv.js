// extensions/CustomSpan.js
import { findNodePosFromNode } from "@/utils/dashboard/editor-utils";
import { Node, mergeAttributes } from "@tiptap/core";
import { Fragment, Slice } from "@tiptap/pm/model";
import { Plugin } from "@tiptap/pm/state";

import { NodeSelection } from "prosemirror-state";

export const classIdDiv = Node.create({
  name: "classIdDiv",
  content: "block*",
  group: "block",
  inline: false,
  selectable: true, // Allow selection
  draggable: false,
  canMerge: false,
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
        tag: "div",
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
    return ["div", HTMLAttributes, 0];
  },
  //   addNodeView() {
  //     return ({ node, getPos, editor }) => {
  //       if (node.attrs.class === "doc-article") {
  //         // if (node.textContent === "") {
  //         //   debugger;
  //         //   const { state, dispatch } = editor.view;
  //         //   const transaction = state.tr.delete(
  //         //     getPos(),
  //         //     getPos() + node.nodeSize,
  //         //   );
  //         //   dispatch(transaction);
  //         //   return null;
  //         // }
  //         return;
  //       }
  //       const dom = document.createElement("span");
  //       dom.textContent = node.textContent;
  //       Object.entries(node.attrs).forEach(([key, value]) => {
  //         if (value) {
  //           dom.setAttribute(key, value);
  //         }
  //       });

  //       // Handle click event
  //       dom.addEventListener("click", () => {
  //         const { state, dispatch } = editor.view;
  //         const transaction = state.tr.setSelection(
  //           NodeSelection.create(state.doc, getPos()),
  //         );
  //         dispatch(transaction);
  //       });

  //       // if (node.textContent === "") {
  //       //   debugger;
  //       //   const { state, dispatch } = editor.view;
  //       //   const transaction = state.tr.delete(getPos(), getPos() + node.nodeSize);
  //       //   dispatch(transaction);
  //       //   return null;
  //       // }

  //       return {
  //         dom,
  //         selectNode: () => {
  //           dom.classList.add("is-selected");
  //         },
  //         deselectNode: () => {
  //           dom.classList.remove("is-selected");
  //         },
  //       };
  //     };
  //   },
  //   addCommands() {
  //     return {
  //       replaceTextInNodeWithClassAndValue:
  //         (prevText, newText) =>
  //         ({ state, dispatch }) => {
  //           if (prevText === newText) {
  //             return false;
  //           }
  //           const { schema, tr, doc } = state;
  //           const customNodeType = schema.nodes.classIdSpan;
  //           let trMapping = tr.mapping;
  //           doc.descendants((node, pos) => {
  //             // debugger;
  //             if (
  //               node.type.name === "classIdSpan" &&
  //               node?.textContent === prevText
  //             ) {
  //               const newTextNode = schema.text(newText);
  //               const newCustomNode = customNodeType.create(
  //                 node.attrs,
  //                 newTextNode,
  //               );
  //               const slice = new Slice(Fragment.from(newCustomNode), 0, 0);

  //               const mappedPos = trMapping.map(pos);
  //               tr.replace(mappedPos, mappedPos + node.nodeSize, slice);
  //             }
  //           });
  //           if (tr.docChanged) {
  //             dispatch(tr);
  //             return true;
  //           }
  //           return false;
  //         },
  //     };
  //   },
});

export default classIdDiv;
