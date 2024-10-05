import { Node } from "@tiptap/core";
import { Fragment, Slice } from "@tiptap/pm/model";
import { Plugin } from "@tiptap/pm/state";
import { NodeSelection } from "prosemirror-state";
const nodeViewClasses = [
  "doc-variable",
  "doc-article-title",
  "doc-article-tag",
  "doc-appendix-tag",
];
export const classIdSpan = Node.create({
  name: "classIdSpan",
  content: "inline*",
  group: "inline",
  inline: true,
  selectable: true,
  draggable: false,
  marks: "_",

  addAttributes() {
    return {
      class: { default: null },
      id: { default: null },
      style: { default: null },
      "data-key": { default: null },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span",
        getAttrs: (dom) => {
          const attrs = {};
          Array.from(dom.attributes).forEach((attr) => {
            attrs[attr.name] = attr.value;
          });
          return attrs;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", HTMLAttributes, 0];
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      const { class: className } = node.attrs;
      if (!nodeViewClasses.includes(className)) {
        return;
      }
      const dom = document.createElement("span");

      Object.entries(node.attrs).forEach(([key, value]) => {
        if (value) dom.setAttribute(key, value);
      });

      // Set contenteditable if 'class' attribute is present to make the node a single unit
      dom.setAttribute("contenteditable", className ? "false" : "true");
      dom.textContent = node.textContent;

      // Add event listeners and class handling logic
      dom.addEventListener("click", () => {
        if (
          className?.includes("doc-variable") ||
          className?.includes("doc-article-tag")
        ) {
          // dom.classList.add("is-selected");
          const { state, dispatch } = editor.view;
          dispatch(
            state.tr.setSelection(NodeSelection.create(state.doc, getPos())),
          );
        } else {
          // dom.classList.remove("is-selected");
        }
      });

      return {
        dom,
        selectNode: () => dom.classList.add("is-selected"),
        deselectNode: () => dom.classList.remove("is-selected"),
      };
    };
  },

  addCommands() {
    return {
      replaceTextInNodeWithClassAndValue:
        (prevText, newText) =>
        ({ state, dispatch }) => {
          if (prevText === newText) return false;

          const { schema, tr, doc } = state;
          const customNodeType = schema.nodes.classIdSpan;
          doc.descendants((node, pos) => {
            if (
              node.type.name === "classIdSpan" &&
              node.attrs.class === "doc-variable" &&
              node.textContent === prevText
            ) {
              const mappedPos = tr.mapping.map(pos);
              const newTextNode = newText ? schema.text(newText) : null;
              const newNode = customNodeType.create(
                node.attrs,
                newTextNode ? newTextNode : null,
              );

              const slice = new Slice(Fragment.from(newNode), 0, 0);
              tr.replace(mappedPos, mappedPos + node.nodeSize, slice);
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

              if (selectedNode?.attrs?.class === "doc-article-title") {
                event.preventDefault();
                this.options.openModal(selectedNode);
                return true;
              } else if (prevNode?.attrs?.class === "doc-article-title") {
                event.preventDefault();
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
