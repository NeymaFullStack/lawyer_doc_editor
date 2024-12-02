import { Node as PMNode } from "@tiptap/pm/model";
import { Plugin, PluginKey, Selection, TextSelection } from "@tiptap/pm/state";
import { EditorView } from "@tiptap/pm/view";
import { MIN_PARAGRAPH_HEIGHT, Max_Page_Height } from "./type";

let pageIndex = 0;

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
          pages.push(pageType.create({ pageIndex }, currentPageContent)); // Last page with its index
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

        // Rest of your cursor and selection handling code remains unchanged.
        view.dispatch(tr);
        isPaginating = false;
      },
    };
  },
});
