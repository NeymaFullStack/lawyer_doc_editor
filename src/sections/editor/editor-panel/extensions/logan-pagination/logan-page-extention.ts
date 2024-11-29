import { Extension, Node, mergeAttributes } from "@tiptap/core";
import { keymap } from "@tiptap/pm/keymap";
import { Node as PMNode, Node as ProseMirrorNode } from "@tiptap/pm/model";
import { Plugin, PluginKey, Selection, TextSelection } from "@tiptap/pm/state";
import { EditorView } from "@tiptap/pm/view";
import { NewAddNodeViewParams, NewAddNodeViewReturn } from "./type";

const MIN_PARAGRAPH_HEIGHT = 20;
const pageHeight = ((297 - 25.4 * 2) / 25.4) * 96;
const pageNodeClassName =
  "page h-[297mm] w-[210mm] bg-white p-[25.4mm] border border-logan-primary-200 overflow-hidden relative mb-10 hover:border-logan-blue transition-all";
const pageNumberClassName =
  "page-number absolute bottom-3 right-3 text-sm text-logan-black";

const newAddNodeView: (
  params: NewAddNodeViewParams
) => NewAddNodeViewReturn = ({ node, getPos }) => {
  const dom = document.createElement("div");
  dom.setAttribute("data-page", "true");
  dom.className = pageNodeClassName;
  const contentDOM = document.createElement("div");
  dom.appendChild(contentDOM);

  const pageNumber = document.createElement("div");
  pageNumber.className = pageNumberClassName;
  const pageIndex = getPos() ? Math.floor(getPos() / pageHeight) : 1;
  pageNumber.textContent = `Page ${pageIndex}`;
  console.log(pageIndex);
  dom.appendChild(pageNumber);

  return {
    dom,
    contentDOM,
    update(updatedNode: ProseMirrorNode) {
      return updatedNode.type === node.type;
    },
  };
};

export const PageNode = Node.create({
  name: "page",
  group: "block",
  content: "block*",
  defining: true,

  parseHTML: () => [{ tag: "div[data-page]" }],
  renderHTML: ({ HTMLAttributes }) => [
    "div",
    mergeAttributes(HTMLAttributes, { "data-page": true }),
    0,
  ],
  addNodeView: () => newAddNodeView,
});

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
      }),
      PaginationPlugin,
    ];
  },
});

export const PaginationPlugin = new Plugin({
  key: new PluginKey("pagination"),
  view() {
    let isPaginating = false;

    return {
      update(view: EditorView, prevState) {
        if (isPaginating) return;

        const { state } = view;
        const pageType = state.schema.nodes.page;
        if (!pageType) return;

        const docChanged = !view.state.doc.eq(prevState.doc);
        const initialLoad =
          prevState.doc.content.size === 0 && state.doc.content.size > 0;

        let hasPageNodes = false;
        state.doc.forEach((node) => {
          if (node.type === pageType) hasPageNodes = true;
        });

        if (!docChanged && hasPageNodes && !initialLoad) return;

        isPaginating = true;

        const contentNodes: { node: PMNode; pos: number }[] = [];
        state.doc.forEach((node, offset) => {
          if (node.type === pageType) {
            node.forEach((child, childOffset) => {
              contentNodes.push({ node: child, pos: offset + childOffset + 1 });
            });
          } else {
            contentNodes.push({ node, pos: offset + 1 });
          }
        });

        const nodeHeights = contentNodes.map(({ pos, node }) => {
          const dom = view.nodeDOM(pos);
          if (dom instanceof HTMLElement) {
            let height = dom.getBoundingClientRect().height;
            if (
              height === 0 &&
              (node.type.name === "paragraph" || node.isTextblock)
            ) {
              height = MIN_PARAGRAPH_HEIGHT;
            }
            return height;
          }
          return MIN_PARAGRAPH_HEIGHT;
        });

        const pages: PMNode[] = [];
        let currentPageContent: PMNode[] = [];
        let currentHeight = 0;

        const oldToNewPosMap: { [key: number]: number } = {};
        let cumulativeNewDocPos = 0;

        contentNodes.forEach(({ node, pos: oldPos }, i) => {
          const nodeHeight = nodeHeights[i];

          if (
            currentHeight + nodeHeight > pageHeight &&
            currentPageContent.length > 0
          ) {
            pages.push(pageType.create({}, currentPageContent));
            cumulativeNewDocPos += pages[pages.length - 1].nodeSize;
            currentPageContent = [];
            currentHeight = 0;
          }

          if (currentPageContent.length === 0) cumulativeNewDocPos += 1;

          const nodeStartPosInNewDoc =
            cumulativeNewDocPos +
            currentPageContent.reduce((sum, n) => sum + n.nodeSize, 0);
          oldToNewPosMap[oldPos] = nodeStartPosInNewDoc;

          currentPageContent.push(node);
          currentHeight += Math.max(nodeHeight, MIN_PARAGRAPH_HEIGHT);
        });

        if (currentPageContent.length > 0) {
          pages.push(pageType.create({}, currentPageContent));
        }

        const newDoc = state.schema.topNodeType.create(null, pages);
        if (newDoc.content.eq(state.doc.content)) {
          isPaginating = false;
          return;
        }

        const tr = state.tr.replaceWith(
          0,
          state.doc.content.size,
          newDoc.content
        );
        tr.setMeta("pagination", true);

        let newCursorPos = null;
        for (let i = 0; i < contentNodes.length; i++) {
          const { node, pos: oldNodePos } = contentNodes[i];
          const nodeSize = node.nodeSize;

          if (
            oldNodePos <= state.selection.from &&
            state.selection.from <= oldNodePos + nodeSize
          ) {
            const offsetInNode = state.selection.from - oldNodePos;
            const newNodePos = oldToNewPosMap[oldNodePos];
            newCursorPos = newNodePos + offsetInNode;
            break;
          }
        }

        if (newCursorPos !== null) {
          const $pos = tr.doc.resolve(newCursorPos);
          let selection =
            Selection.near($pos) ||
            Selection.findFrom($pos, 1, true) ||
            Selection.findFrom($pos, -1, true);
          tr.setSelection(
            selection || TextSelection.create(tr.doc, tr.doc.content.size)
          );
        } else {
          tr.setSelection(TextSelection.create(tr.doc, tr.doc.content.size));
        }

        view.dispatch(tr);
        isPaginating = false;
      },
    };
  },
});
