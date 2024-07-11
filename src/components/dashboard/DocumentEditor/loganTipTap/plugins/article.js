import { tagInsertionType } from "@/constants/enums";
import { findNodePos } from "@/utils/dashboard/editor-utils";
import { Extension } from "@tiptap/core";
import { Fragment, Slice } from "@tiptap/pm/model";
import { Plugin, TextSelection } from "@tiptap/pm/state";

const ArticleExtention = Extension.create({
  name: "article",
  // addOptions() {
  //   return {
  //     updateArticles: () => {},
  //   };
  // },
  addProseMirrorPlugins() {
    let updateArticles = this.options.updateArticles;
    return [
      new Plugin({
        props: {
          handleKeyDown: (view, event) => {
            const { state, dispatch } = view;
            const { selection, tr, doc } = state;
            const { $from, $to, from, $anchor, node } = selection;
            // Check if the selection is within your classIdDiv wrapper
            // const parentNode = $from.node(-1); // -1 to get the parent node
            const currentNode = $from.node();
            const parentNode = $from.node($from.depth - 1);
            const grandParentNode = $from.node($from.depth - 2);
            const greatGrandParentNode = $from.node($from.depth - 3);

            // debugger;
            let newTr = tr;
            let ifCursorRightBeforeArticleHeading = false;
            if (
              currentNode.type.name === "heading" &&
              currentNode.attrs.id &&
              currentNode?.attrs?.level == 2 &&
              parentNode.type.name === "classIdDiv" &&
              $anchor?.nodeAfter?.type.name === "classIdSpan" &&
              $anchor?.nodeAfter?.attrs.class === "doc-article-title"
            ) {
              ifCursorRightBeforeArticleHeading = true;
            }

            if (event.key === "Enter") {
              if (ifCursorRightBeforeArticleHeading) {
                //Behaviour when user pressed "Enter" when cursor is right before Article heading"
                const newParagraphNode = state.schema.nodes.paragraph.create();
                newTr = newTr.insert(
                  $from.before($from.depth - 1),
                  newParagraphNode,
                );
                newTr = newTr.setMeta("addToHistory", true);
                dispatch(
                  newTr.setSelection(
                    TextSelection.near(newTr.doc.resolve(from)),
                  ),
                );
                return true;
              }
              return false;
            } else if (event.key === " ") {
              if (ifCursorRightBeforeArticleHeading) {
                //Behaviour when user pressed "Space" when cursor is right before Article heading"
                return true;
              }
            } else if (event.key === "Backspace") {
              if (ifCursorRightBeforeArticleHeading) {
                //Behaviour when user pressed "Backspace" when cursor is right before Article heading"
                let nodeBeforeDivArticle = doc.resolve(
                  $from.before($from.depth - 1),
                ).nodeBefore;
                if (nodeBeforeDivArticle.type.name === "paragraph") {
                  let paragraphPos = findNodePos(doc, nodeBeforeDivArticle);
                  newTr = newTr.deleteRange(
                    paragraphPos,
                    paragraphPos + nodeBeforeDivArticle.nodeSize,
                  );
                  dispatch(newTr);
                  return true;
                } else if (
                  nodeBeforeDivArticle.type.name === "classIdDiv" &&
                  nodeBeforeDivArticle.attrs.class === "doc-article"
                ) {
                  return true;
                }
              }
            }
          },
        },
        view(view) {
          console.log("this", this.options);
          return {
            update(view, prevState) {
              //Below Code maintain Article structure and dynamic article numbering
              const { state, dispatch } = view;
              if (state.doc.eq(prevState.doc)) {
                return;
              }
              let articleOccurance = 1;
              let tr = state.tr;
              let trMapping = tr.mapping;
              let articlesList = [];
              const setIndexForListItems = (listNode, parentIndex = []) => {
                let index = 1;
                let articleList = [];
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
                    let article = {
                      id: uniqueId,
                      articleName: String(child.textContent)
                        .split(" ")
                        .slice(0, 4)
                        .join(" "),
                      index: dataIndex,
                      type: tagInsertionType.SubArticle,
                    };
                    child.forEach((grandChild) => {
                      if (
                        grandChild.type.name === "bulletList" ||
                        grandChild.type.name === "orderedList"
                      ) {
                        article = {
                          ...article,
                          children: setIndexForListItems(grandChild, [
                            ...parentIndex,
                            index,
                          ]),
                        };
                      }
                    });
                    articleList.push(article);
                    index++;
                  }
                });
                return articleList;
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
                  let h2Node;
                  node.forEach((child) => {
                    if (
                      child.type.name === "heading" &&
                      child.attrs.id &&
                      child.attrs?.level === 2
                    ) {
                      h2Node = child;
                    }
                  });
                  const h2Pos = mappedPos + 1;
                  let hasCustomNode = false;
                  let customNodePos;

                  h2Node?.descendants((childNode, childPos) => {
                    if (childNode.type.name === "classIdSpan") {
                      hasCustomNode = true;
                      customNodePos = h2Pos + childPos;
                    }
                    // debugger;
                  });
                  console.log("h2Node", h2Node, node);

                  if (
                    hasCustomNode &&
                    typeof customNodePos !== undefined &&
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
                    }
                  } else {
                    h2Node?.type.name === "heading" &&
                      tr.insert(h2Pos + 1, newNode);
                    tr.setMeta("addToHistory", true);
                  }
                  let article = {
                    id: h2Node?.attrs?.id,
                    articleName: h2Node?.lastChild?.textContent,
                    index: articleOccurance,
                    type: tagInsertionType.Article,
                  };
                  node.forEach((child) => {
                    if (
                      child.type.name === "bulletList" ||
                      child.type.name === "orderedList"
                    ) {
                      article = {
                        ...article,
                        children: setIndexForListItems(child, [
                          articleOccurance,
                        ]),
                      };
                    }
                  });
                  articlesList.push(article);
                  articleOccurance++;
                } else {
                  articleOccurance = 1;
                }
              });
              updateArticles(articlesList);
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
