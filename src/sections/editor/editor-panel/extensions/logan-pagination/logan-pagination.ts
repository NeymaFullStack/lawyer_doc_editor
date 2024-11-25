import { Node, RawCommands, mergeAttributes } from "@tiptap/core";
import { Transaction } from "@tiptap/pm/state";

export interface PageExtensionOptions {
  bodyWidth: number; // Width of the page in pixels
  bodyHeight: number; // Height of the page in pixels
  bodyPadding: number; // Padding within the page
}

export const PageExtension = Node.create<PageExtensionOptions>({
  name: "page",

  group: "page", // This makes it a block-level node

  content: "block+",

  addOptions() {
    return {
      bodyWidth: 800, // Default width
      bodyHeight: 1120, // Default height
      bodyPadding: 20, // Default padding
    };
  },

  parseHTML() {
    return [{ tag: "div[data-page]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-page": "" }), 0];
  },

  addNodeView() {
    return ({ node, view, getPos }) => {
      const dom = document.createElement("div");
      dom.style.width = `${this.options.bodyWidth}px`;
      dom.style.minHeight = `${this.options.bodyHeight}px`;
      dom.style.maxHeight = `${this.options.bodyHeight}px`;
      dom.style.overflow = "hidden";
      dom.style.padding = `${this.options.bodyPadding}px`;
      dom.style.border = "1px solid #ddd";
      dom.style.boxSizing = "border-box";
      dom.dataset.page = "";

      return {
        dom,
        contentDOM: dom,
        update: (updatedNode) => {
          // Handle node updates here if necessary
          return true;
        },
      };
    };
  },

  addCommands() {
    return {
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

          // Create a new page node
          const pageNode = schema.nodes.page.createAndFill();

          if (!pageNode) {
            console.error("Failed to create a new page node.");
            return false;
          }

          if (dispatch) {
            // Insert the page node at the end of the document
            tr.insert(tr.doc.content.size, pageNode);
            dispatch(tr);
          }

          return true;
        },
    } as Partial<RawCommands>;
  },
});
