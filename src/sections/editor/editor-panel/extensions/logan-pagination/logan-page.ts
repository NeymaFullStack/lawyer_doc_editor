import { Node, mergeAttributes } from "@tiptap/core";
import { Node as ProseMirrorNode } from "@tiptap/pm/model";
import {
  NewAddNodeViewParams,
  NewAddNodeViewReturn,
  Max_Page_Height,
} from "./type";

const pageNodeClassName =
  "page h-[297mm] w-[210mm] bg-white p-[25.4mm] border border-logan-primary-200 overflow-hidden relative mb-10 hover:border-logan-blue transition-all hover:shadow-badge-md";
const pageNumberClassName =
  "page-number absolute bottom-3 right-3 text-sm text-logan-black";

const newAddNodeView: (
  params: NewAddNodeViewParams
) => NewAddNodeViewReturn = ({ node, getPos, view }) => {
  const dom = document.createElement("div");
  dom.setAttribute("data-page", "true");
  dom.className = pageNodeClassName;
  const contentDOM = document.createElement("div");
  dom.appendChild(contentDOM);

  const pageNumber = document.createElement("div");
  pageNumber.className = pageNumberClassName;

  const currentHeight = view.dom.getBoundingClientRect().height;
  const pageIndex = Math.floor(currentHeight / Max_Page_Height) + 1;
  pageNumber.textContent = `Page ${node.attrs.pageIndex}`;
  dom.appendChild(pageNumber);

  console.log(node.attrs);

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
  addAttributes() {
    return {
      pageIndex: {
        default: 1,
      },
    };
  },
});
