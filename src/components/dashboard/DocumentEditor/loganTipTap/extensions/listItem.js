import { Node, mergeAttributes } from "@tiptap/core";
import { Schema } from "@tiptap/pm/model";
import { NodeSelection, Plugin, TextSelection } from "@tiptap/pm/state";

const CustomListItem = Node.create({
  name: "listItem",

  group: "block",

  content: "block*",

  defining: true,

  addAttributes() {
    return {
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
      "data-index": {
        default: null,
        parseHTML: (element) => element.getAttribute("data-index"),
        renderHTML: (attributes) => {
          if (!attributes["data-index"]) {
            return {};
          }

          return {
            "data-index": attributes["data-index"],
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "li",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "li",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },
  // addProseMirrorPlugins() {
  //   return [
  //     new Plugin({
  //       props: {
  //         handleKeyDown: (view, event) => {
  //           if (event.key === "Enter") {
  //             const { state, dispatch } = view;
  //             const { selection } = state;
  //             const { $from, $to, from } = selection;
  //             const currentNode = $from.node();
  //             const parentNode = $from.node($from.depth - 1);
  //             const grandParentNode = $from.node($from.depth - 2);
  //             if (
  //               currentNode.type.name === "paragraph" &&
  //               parentNode.type.name === "listItem" &&
  //               grandParentNode.type.name === "bulletList" &&
  //               currentNode.textContent !== ""
  //             ) {
  //               event.preventDefault();
  //               // Get the position to insert the new list item
  //               const pos = $from.after($to.depth - 1);
  //               const textInRange = state.doc.textBetween(from, pos - 1);
  //               // Create the new list item node
  //               let newListItem;
  //               if (textInRange) {
  //                 newListItem = state.schema.nodes.listItem.create(
  //                   {
  //                     id: nanoid(),
  //                   },
  //                   state.schema.nodes.paragraph.create(
  //                     {},
  //                     state.schema.text(textInRange),
  //                   ),
  //                 );
  //               } else {
  //                 newListItem = state.schema.nodes.listItem.create(
  //                   {
  //                     id: nanoid(),
  //                   },
  //                   state.schema.nodes.paragraph.create({}),
  //                 );
  //               }

  //               // Create the transaction to insert the new list item
  //               const tr = state.tr.insert(pos, newListItem);
  //               tr.deleteRange(from, pos - 1);
  //               // Dispatch the transaction
  //               // dispatch(tr);

  //               // Set the selection inside the new paragraph
  //               dispatch(
  //                 tr.setSelection(NodeSelection.near(tr.doc.resolve(pos + 2))),
  //               );

  //               return true;
  //             }
  //           }
  //           return false;
  //         },
  //       },
  //     }),
  //   ];
  // },
});

export default CustomListItem;
