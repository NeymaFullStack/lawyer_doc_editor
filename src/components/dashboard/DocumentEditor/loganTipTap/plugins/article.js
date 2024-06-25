import { findNodePos } from "@/utils/dashboard/editor-utils";
import { Extension } from "@tiptap/core";
import { Fragment, Slice } from "@tiptap/pm/model";
import { Plugin, TextSelection } from "@tiptap/pm/state";
import { nanoid } from "nanoid";

const ArticleExtention = Extension.create({
  name: "article",
  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleKeyDown: (view, event) => {
            if (event.key === "Enter") {
              const { state, dispatch } = view;
              const { selection, tr } = state;
              const { $from, $to } = selection;

              // Check if the selection is within your classIdDiv wrapper
              // const parentNode = $from.node(-1); // -1 to get the parent node
              const currentNode = $from.node();
              const parentNode = $from.node($from.depth - 1);
              const grandParentNode = $from.node($from.depth - 2);
              const greatGrandParentNode = $from.node($from.depth - 3);
              if (
                currentNode.type.name === "paragraph" &&
                currentNode.content.size === 0 &&
                parentNode.type.name === "listItem" &&
                grandParentNode.type.name === "bulletList" &&
                greatGrandParentNode.type.name === "classIdDiv"
              ) {
                const greatGrandParentNodePos = $from.after($from.depth - 3);
                const newParagraphNode = state.schema.nodes.paragraph.create();
                // Create a transaction to insert the new paragraph
                let tr = state.tr;
                const listItemPos = $from.before($from.depth - 1);
                tr = tr.delete(listItemPos, listItemPos + parentNode.nodeSize);

                tr = tr.insert(
                  greatGrandParentNodePos - parentNode.nodeSize,
                  newParagraphNode,
                );

                // Dispatch the transaction
                dispatch(
                  tr.setSelection(
                    TextSelection.near(
                      tr.doc.resolve(
                        greatGrandParentNodePos - parentNode.nodeSize,
                      ),
                    ),
                  ),
                );
                return true;
              } else if (parentNode.type.name === "classIdDiv") {
                // Prevent the default behavior of splitting the node
                event.preventDefault();

                // Create a new paragraph node below the custom div wrapper
                const newPos = $to.after($to.depth);
                const newParagraph = state.schema.nodes.paragraph.create();
                const newTr = tr.insert(newPos, newParagraph);

                // Set the selection to the new paragraph
                dispatch(
                  newTr.setSelection(
                    TextSelection.near(newTr.doc.resolve(newPos)),
                  ),
                );

                return true;
              }
              return false;
            }
          },
        },
        view(view) {
          return {
            update(view, prevState) {
              const { state, dispatch } = view;
              if (state.doc.eq(prevState.doc)) {
                return;
              }
              let articleOccurance = 1;
              let tr = state.tr;
              let trMapping = tr.mapping;
              let articleIndex = 1;

              const setIndexForListItems = (listNode, parentIndex = []) => {
                let index = 1;
                listNode.forEach((child, offset) => {
                  if (child.type.name === "listItem") {
                    let uniqueId = child.attrs["id"] || crypto.randomUUID();
                    const dataIndex = [...parentIndex, index].join(".");
                    const pos = findNodePos(tr.doc, child);
                    tr = tr.setNodeMarkup(pos, undefined, {
                      ...child.attrs,
                      "data-index": dataIndex,
                      id: uniqueId,
                    });

                    child.forEach((grandChild) => {
                      if (
                        grandChild.type.name === "bulletList" ||
                        grandChild.type.name === "orderedList"
                      ) {
                        setIndexForListItems(grandChild, [
                          ...parentIndex,
                          index,
                        ]);
                      }
                    });
                    index++;
                  }
                });
              };

              tr.doc.forEach((node, offset, index) => {
                let pos = offset;
                const mappedPos = trMapping.map(pos);
                // debugger;
                if (
                  node.type.name === "classIdDiv" &&
                  node.attrs.class === "doc-article"
                ) {
                  const newNode = state.schema.nodes.classIdSpan.create(
                    { class: `doc-article-title` },
                    state.schema.text(`Article ${articleOccurance}: `),
                  );
                  const h2Node = node?.firstChild;
                  const h2Pos = mappedPos + 1;
                  let hasCustomNode = false;
                  let customNodePos;

                  h2Node?.type?.name === "heading" &&
                    h2Node.descendants((childNode, childPos) => {
                      if (childNode.type.name === "classIdSpan") {
                        hasCustomNode = true;
                        customNodePos = h2Pos + childPos;
                      }
                      // debugger;
                    });
                  console.log("h2Node", h2Node, node);

                  if (
                    hasCustomNode &&
                    typeof customNodePos !== "undefined" &&
                    h2Node.content.firstChild.textContent
                  ) {
                    let artcleIndex = h2Node?.content?.firstChild?.textContent
                      ?.split(" ")[1]
                      ?.split(":")[0];

                    if (Number(artcleIndex) !== articleOccurance) {
                      const slice = new Slice(Fragment.from(newNode), 0, 0);

                      tr.replace(
                        h2Pos + 1,
                        h2Pos + 1 + h2Node.content.firstChild.nodeSize,
                        slice,
                      );
                      tr.setMeta("addToHistory", true);
                    }
                  } else {
                    h2Node.type.name === "heading" &&
                      tr.insert(h2Pos + 1, newNode);
                    tr.setMeta("addToHistory", true);
                  }
                  node.forEach((child) => {
                    if (
                      child.type.name === "bulletList" ||
                      child.type.name === "orderedList"
                    ) {
                      setIndexForListItems(child, [articleIndex]);
                    }
                  });
                  articleOccurance++;
                } else {
                  articleOccurance = 1;
                }
              });
              if (tr.docChanged) {
                dispatch(tr);
              }
            },
          };
        },
      }),
    ];
  },
});

export default ArticleExtention;
