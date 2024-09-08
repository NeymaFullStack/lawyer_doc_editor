// extensions/CustomSpan.js
import { Node, mergeAttributes } from "@tiptap/core";
import { Fragment, Slice } from "@tiptap/pm/model";
import { Plugin } from "@tiptap/pm/state";
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
      ...this.parent?.(),
      class: {
        default: null,
      },
      id: {
        default: null,
      },
      style: {
        default: null,
      },
      "data-key": {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span",
        getAttrs: (dom) => ({
          class: dom.getAttribute("class"),
          id: dom.getAttribute("id"),
          style: dom.getAttribute("style"),
          "data-key": dom.getAttribute("data-key"),
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    if (HTMLAttributes?.class !== null) {
      HTMLAttributes.contenteditable = "false";
    } else {
      HTMLAttributes.contenteditable = "true";
    }

    return ["span", mergeAttributes(HTMLAttributes), 0];
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      const dom = document.createElement("span");
      if (
        node.attrs.class === null ||
        node.attrs.class === "doc-article-title"
      ) {
        return;
      }
      // Apply all attributes to the DOM element
      Object.entries(node.attrs).forEach(([key, value]) => {
        if (value !== null) {
          dom.setAttribute(key, value);
        }
      });

      // Set the contenteditable attribute based on class presence
      dom.setAttribute(
        "contenteditable",
        node.attrs.class !== null ? "false" : "true",
      );

      // Set the text content of the span
      dom.textContent = node.textContent;

      // Handle click event to add/remove 'is-selected' class
      dom.addEventListener("click", () => {
        if (
          node.attrs.class?.includes("doc-variable") ||
          node.attrs.class?.includes("doc-article-tag")
        ) {
          dom.classList.add("is-selected");

          const { state, dispatch } = editor.view;
          const transaction = state.tr.setSelection(
            NodeSelection.create(state.doc, getPos()),
          );
          dispatch(transaction);
        } else {
          dom.classList.remove("is-selected");
        }
      });

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
      ...this.parent?.(),
      replaceTextInNodeWithClassAndValue:
        (prevText, newText) =>
        ({ state, dispatch, commands }) => {
          if (prevText === newText) {
            return false;
          }
          const { schema, tr, doc } = state;
          const customNodeType = schema.nodes.classIdSpan;
          let trMapping = tr.mapping;
          doc.descendants((node, pos) => {
            if (
              node.type.name === "classIdSpan" &&
              node.attrs.class === "doc-variable" &&
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
                // Assume `this.options.openModal` is defined elsewhere in your code
                this.options.openModal(selectedNode);
                return true;
              } else if (prevNode?.attrs?.class === "doc-article-title") {
                event.preventDefault();
                // Assume `this.options.openModal` is defined elsewhere in your code
                this.options.openModal(prevNode);
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
