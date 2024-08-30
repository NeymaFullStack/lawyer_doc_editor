import { tagInsertionType } from "@/constants/enums";
import { findNodePosFromNode } from "@/utils/dashboard/editor-utils";
import { Extension } from "@tiptap/core";
import { Fragment, Slice } from "@tiptap/pm/model";
import { Plugin, TextSelection } from "@tiptap/pm/state";
import { padStart } from "lodash";

const ArticleExtention = Extension.create({
  name: "article",

  addProseMirrorPlugins() {
    let updateArticles = this.options.updateArticles;
    console.log("this", this.options);
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
                  let paragraphPos = findNodePosFromNode(
                    doc,
                    nodeBeforeDivArticle,
                  );
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
          return {
            update(view, prevState) {
              //Below Code maintain Article structure and dynamic article numbering
              const { state, dispatch } = view;
              if (state.doc.eq(prevState.doc)) {
                return;
              }
              let articleOccurance = 1;
              let appendixOccurance = 1;
              let tr = state.tr;
              let trMapping = tr.mapping;
              let articlesList = [
                {
                  articleType: "document",
                  title: "",
                  children: [],
                  id: "doc",
                },
              ];
              const setIndexForListItems = (listNode, parentIndex = []) => {
                let index = 1;
                let articleList = [];
                listNode.forEach((child, offset) => {
                  if (child.type.name === "listItem") {
                    let uniqueId = child.attrs["id"] || crypto.randomUUID();
                    const dataIndex = [...parentIndex, index].join(".");
                    const pos = findNodePosFromNode(tr.doc, child);
                    tr = tr.setNodeMarkup(pos, undefined, {
                      ...child.attrs,
                      "data-index": dataIndex,
                      id: uniqueId,
                    });
                    let article = {
                      id: uniqueId,
                      title: String(child.textContent)
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
              let newAppendexSeprator = {
                sepratorAppendixHeading: "",
                separatorHeadingStartPos: undefined,
                separatorHeadingEndPos: undefined,
                id: null,
              };
              tr.doc.forEach((node, offset, index) => {
                let pos = offset;

                const mappedPos = trMapping.map(pos);
                // debugger;
                if (node.attrs.class === "appendix-separator") {
                  articleOccurance = 1;
                  newAppendexSeprator.id = node.attrs.id;
                  node.forEach((child, offset) => {
                    if (child.attrs.class === "appendix-index") {
                      let prevAppendixIndex = String(child.textContent);
                      if (
                        prevAppendixIndex.length == 2 &&
                        prevAppendixIndex.charAt(0) === "0"
                      ) {
                        prevAppendixIndex = Number(prevAppendixIndex.charAt(1));
                      } else {
                        prevAppendixIndex = Number(prevAppendixIndex);
                      }
                      if (prevAppendixIndex !== appendixOccurance) {
                        // insert appendix index in that child node
                        tr.insertText(
                          padStart(String(appendixOccurance), 2, "0"),
                          mappedPos + offset + 2,
                          mappedPos + offset + 1 + child.nodeSize - 1,
                        );
                      }
                    }
                    if (child.attrs.class === "sep-heading") {
                      let mappedSepHeadingPos = trMapping.map(pos);
                      newAppendexSeprator.sepratorAppendixHeading =
                        child.textContent;
                      newAppendexSeprator.separatorHeadingStartPos =
                        mappedSepHeadingPos + offset + 2;
                      newAppendexSeprator.separatorHeadingEndPos =
                        mappedSepHeadingPos + offset + 1 + child.nodeSize - 1;
                    }
                  });
                } else if (
                  newAppendexSeprator?.separatorHeadingStartPos &&
                  newAppendexSeprator?.sepratorAppendixHeading &&
                  newAppendexSeprator?.id
                ) {
                  if (node.attrs.class === "annex-tag-para") {
                    let annexTextArray = String(node.textContent).split(" ");
                    let annexIndex =
                      annexTextArray.length > 1 ? annexTextArray[1] : false;
                    if (
                      annexIndex?.length == 2 &&
                      annexIndex?.charAt(0) === "0"
                    ) {
                      annexIndex = Number(annexIndex.charAt(1));
                    } else {
                      annexIndex = Number(annexIndex);
                    }
                    if (annexIndex !== appendixOccurance) {
                      // insert Paragraph with span tag with correct appendix index

                      let anextagPos = trMapping.map(
                        findNodePosFromNode(state.doc, node.firstChild),
                      );
                      tr.insertText(
                        `Annex ${padStart(String(appendixOccurance), 2, "0")}`,
                        anextagPos + 1,
                        anextagPos + node.firstChild.nodeSize - 1,
                      );
                    }
                  }

                  if (
                    node.type.name === "heading" &&
                    node.attrs.level === 1 &&
                    node.attrs.class === "annex-heading"
                  ) {
                    let appendixHeading = node?.textContent;
                    if (
                      newAppendexSeprator.sepratorAppendixHeading !==
                      appendixHeading
                    ) {
                      // insert node.textContent at newAppendexSeprator.separatorHeadingPos
                      tr.insertText(
                        appendixHeading,
                        newAppendexSeprator.separatorHeadingStartPos,
                        newAppendexSeprator.separatorHeadingEndPos,
                      );
                    }
                    articlesList.push({
                      articleType: "appendix",
                      index: appendixOccurance,
                      title: appendixHeading,
                      children: [],
                      id: newAppendexSeprator.id,
                    });
                    newAppendexSeprator = {};
                    appendixOccurance++;
                  }
                } else if (
                  node.type.name === "classIdDiv" &&
                  node.attrs.class === "doc-article"
                ) {
                  const newNode = state.schema.nodes.classIdSpan.create(
                    { class: `doc-article-title` },
                    state.schema.text(`Article ${articleOccurance} - `),
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

                  if (
                    hasCustomNode &&
                    typeof customNodePos !== undefined &&
                    h2Node.content.firstChild.textContent
                  ) {
                    let artcleIndex = h2Node?.content?.firstChild?.textContent
                      ?.split(" ")[1]
                      ?.split(" - ")[0];

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
                    id: node?.attrs?.id,
                    title: h2Node?.lastChild?.textContent,
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
                  let lastArticle = articlesList[articlesList.length - 1];
                  lastArticle = {
                    ...lastArticle,
                    children: [...lastArticle.children, article],
                  };
                  articlesList[articlesList.length - 1] = lastArticle;
                  // console.log("ant", articlesList);
                  articleOccurance++;
                } else {
                  articleOccurance = 1;
                }
              });
              // console.log("articlesList", articlesList);
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
