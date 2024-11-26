import { Node, RawCommands, mergeAttributes } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { Node as ProsemirrorNode } from "@tiptap/pm/model";
import { Transaction } from "@tiptap/pm/state";

export interface PaginationOptions {
  pageHeight: number;
  pageWidth: number;
  pageMargin: number;
}

export const PageExtension = Node.create<PaginationOptions>({
  name: "pagination",

  group: "block",

  content: "block+",

  addOptions() {
    return {
      pageHeight: 1123, // Default page height (in pixels)
      pageWidth: 794, // Default page width (in pixels)
      pageMargin: 96, // Default margin around the page (in pixels)
    };
  },

  parseHTML() {
    return [{ tag: "div[data-pagination]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-pagination": "" }),
      0,
    ];
  },

  addNodeView() {
    return ({ node, view, getPos }) => {
      const dom = document.createElement("div");
      const { pageHeight, pageWidth, pageMargin } = this.options;

      // Applying styles to the pagination container
      dom.classList.add(
        "w-[794px]",
        "h-[1123px]",
        "p-[96px]",
        "border",
        "border-gray-300",
        "box-border",
        "bg-white"
      );
      dom.dataset.pagination = "";

      return {
        dom,
        contentDOM: dom,
        update: (updatedNode) => {
          return true;
        },
      };
    };
  },

  addCommands() {
    return {
      setPaginationOptions:
        (options: Partial<PaginationOptions>) =>
        ({
          tr,
          dispatch,
        }: {
          tr: Transaction;
          dispatch?: (tr: Transaction) => void;
        }) => {
          if (dispatch) {
            tr.setMeta("paginationOptions", options);
            dispatch(tr);
          }
          return true;
        },

      addPage:
        () =>
        ({
          tr,
          dispatch,
        }: {
          tr: Transaction;
          dispatch?: (tr: Transaction) => void;
        }) => {
          const { schema } = this.editor;

          const pageNode = schema.nodes.pagination.createAndFill();
          if (!pageNode) {
            console.error("Failed to create a new pagination node.");
            return false;
          }

          if (dispatch) {
            tr.insert(tr.doc.content.size, pageNode);
            dispatch(tr);
          }

          return true;
        },
    } as Partial<RawCommands>;
  },

  addProseMirrorPlugins() {
    const pluginKey = new PluginKey("pagination");

    return [
      new Plugin({
        key: pluginKey,
        state: {
          init: () => ({ ...this.options }),
          apply: (tr, value) => {
            const newOptions = tr.getMeta("paginationOptions");
            if (newOptions) {
              return { ...value, ...newOptions };
            }
            return value;
          },
        },
        props: {
          decorations: (state) => {
            const { doc } = state;
            const decorations: Decoration[] = [];
            let currentHeight = 0;
            let pageNumber = 1;

            const options = pluginKey.getState(state);

            doc.descendants((node: ProsemirrorNode, pos: number) => {
              const { pageHeight, pageMargin } = options!;
              const nodeDOM = this.editor.view.nodeDOM(pos) as HTMLElement;

              const nodeHeight =
                node.isBlock && nodeDOM ? nodeDOM.offsetHeight : 0;

              // If the current node height exceeds the remaining space, insert a page break
              if (currentHeight + nodeHeight > pageHeight - 2 * pageMargin) {
                // Add page number decoration
                decorations.push(
                  Decoration.widget(pos, () => {
                    const pageIndex = document.createElement("div");
                    pageIndex.className = "text-center font-bold mt-2";
                    pageIndex.innerText = `${pageNumber}`;
                    pageNumber += 1;
                    return pageIndex;
                  })
                );

                // Add page break decoration
                decorations.push(
                  Decoration.widget(pos, () => {
                    const pageBreak = document.createElement("div");
                    pageBreak.className = "border-t-2 border-gray-300 my-5";
                    return pageBreak;
                  })
                );

                currentHeight = 0;
              }
              currentHeight += nodeHeight;
            });

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});
