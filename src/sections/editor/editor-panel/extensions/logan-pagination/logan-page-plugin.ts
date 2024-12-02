import { Node as PMNode } from "@tiptap/pm/model";
import { Plugin, PluginKey, Selection, TextSelection } from "@tiptap/pm/state";
import { EditorView } from "@tiptap/pm/view";
import { MIN_PARAGRAPH_HEIGHT, Max_Page_Height } from "./type";

let pageIndex = 1;

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

        const nodeHeights = contentNodes.map(({ node, pos }) => {
          const dom = view.nodeDOM(pos);
          if (dom instanceof HTMLElement) {
            let height = dom.getBoundingClientRect().height;
            return height === 0 ? MIN_PARAGRAPH_HEIGHT : height;
          }
          return MIN_PARAGRAPH_HEIGHT;
        });

        const pages: PMNode[] = [];
        let currentPageContent: PMNode[] = [];
        let currentHeight = 0;

        pageIndex = 1;
        const oldToNewPosMap: { [key: number]: number } = {};
        let cumulativeNewDocPos = 0;

        contentNodes.forEach(({ node, pos: oldPos }, i) => {
          const nodeHeight = nodeHeights[i];

          if (
            currentHeight + nodeHeight > Max_Page_Height &&
            currentPageContent.length > 0
          ) {
            pages.push(pageType.create({ pageIndex }, currentPageContent));
            cumulativeNewDocPos += pages[pages.length - 1].nodeSize;
            currentPageContent = [];
            currentHeight = 0;
            pageIndex++;
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
          pages.push(pageType.create({ pageIndex }, currentPageContent));
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
