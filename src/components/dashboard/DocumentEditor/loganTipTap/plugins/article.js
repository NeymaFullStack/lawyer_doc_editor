import { tagInsertionType } from "@/constants/enums";
import { findNodePosFromNode } from "@/utils/dashboard/editor-utils";
import { Extension } from "@tiptap/core";
import { Fragment, Slice } from "@tiptap/pm/model";
import { Plugin, TextSelection } from "@tiptap/pm/state";
import { padStart, uniqueId } from "lodash";
const navigationKeys = ["ArrowDown", "ArrowLeft", "ArrowRight", "ArrowUp"];

const ArticleExtention = Extension.create({
  name: "article",

  addProseMirrorPlugins() {
    let updateArticles = this.options.updateArticles;
    const editor = this.editor;
    return [
      new Plugin({
        props: {
          handleClick: (view, event) => {
            // updateArticles([])
          },
          handleKeyDown: (view, event) => {
            const { state, dispatch } = view;
            const { selection, tr, doc } = state;
            const { $from, $to, from, $anchor } = selection;
            // Check if the selection is within your classIdDiv wrapper
            // const parentNode = $from.node(-1); // -1 to get the parent node
            const currentNode = $from.node();
            const parentNode = $from.node($from.depth - 1);

            if (navigationKeys.includes(event.key)) {
              return false;
            }
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
            if (ifCursorRightBeforeArticleHeading) {
              if (event.key === "Backspace") {
                const nodeBeforeDivArticle = doc.resolve(
                  $from.before($from.depth - 1),
                ).nodeBefore;

                if (nodeBeforeDivArticle?.type.name === "paragraph") {
                  editor
                    .chain()
                    .focus()
                    .deleteRange({
                      from: findNodePosFromNode(doc, nodeBeforeDivArticle),
                      to:
                        findNodePosFromNode(doc, nodeBeforeDivArticle) +
                        nodeBeforeDivArticle.nodeSize,
                    })
                    .run();
                  return true;
                } else if (
                  nodeBeforeDivArticle?.type.name === "classIdDiv" &&
                  nodeBeforeDivArticle?.attrs.class === "doc-article"
                ) {
                  return true;
                } else {
                  return true;
                }
              } else {
                //Behaviour when user pressed "Space" when cursor is right before Article heading"
                return true;
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

              let newAppendexSeprator = {
                sepratorAppendixHeading: "",
                separatorHeadingStartPos: undefined,
                separatorHeadingEndPos: undefined,
                id: null,
              };
              state.doc.forEach((node, offset, index) => {
                let pos = offset;
                const mappedPos = trMapping.map(pos);
                // handling insertion and manipulation of appendix
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
                  // handling insertion of doc-article-title tag (eg : Article 1)
                  let h2Node = null;
                  node.forEach((child, childPos) => {
                    if (
                      child.type.name === "heading" &&
                      child.attrs?.level === 2 &&
                      child.attrs?.class === "article-heading"
                    ) {
                      const h2Pos = trMapping.map(
                        findNodePosFromNode(state.doc, child),
                      );
                      if (h2Node !== null) {
                        // const slice = tr.doc.slice(
                        //   h2Pos,
                        //   mappedPos + node.nodeSize - 2,
                        // );
                        // const docArticleNode =
                        //   tr.doc.type.schema.nodes.classIdDiv.create(
                        //     { class: "doc-article", id: nanoid() },
                        //     slice.content,
                        //   );
                        // debugger;
                        // tr.insert(
                        //   mappedPos + node.nodeSize,
                        //   Fragment.from(docArticleNode),
                        // );
                        // tr.delete(h2Pos, mappedPos + node.nodeSize - 2);
                        // debugger;
                        // editor.commands.cut(
                        //   {
                        //     from: h2Pos,
                        //     to: mappedPos + node.nodeSize - 2,
                        //   },
                        //   mappedPos + node.nodeSize,
                        // );
                      } else {
                        h2Node = child;
                        let docArticleTitleFound = false;
                        const newarticleTagNode =
                          state.schema.nodes.classIdSpan.create(
                            { class: `doc-article-title` },
                            state.schema.text(`Article ${articleOccurance} - `),
                          );
                        const docArticleTitleSlice = new Slice(
                          Fragment.from(newarticleTagNode),
                          0,
                          0,
                        );

                        h2Node?.forEach((childNode, childPos) => {
                          if (
                            childNode.type.name === "classIdSpan" &&
                            childNode.attrs.class === "doc-article-title"
                          ) {
                            const docArticleTitlePos = trMapping.map(
                              findNodePosFromNode(state.doc, childNode),
                            );

                            let artcleIndex = Number(
                              childNode.textContent
                                ?.split(" ")[1]
                                ?.split(" - ")[0],
                            );
                            docArticleTitleFound = true;
                            if (artcleIndex !== articleOccurance) {
                              tr.replace(
                                docArticleTitlePos,
                                docArticleTitlePos + childNode.nodeSize,
                                docArticleTitleSlice,
                              );
                            }
                          }
                        });
                        !docArticleTitleFound &&
                          tr.insert(h2Pos + 1, docArticleTitleSlice.content);
                      }
                    }
                  });
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
                        children: setIndexForListItems(
                          child,
                          [articleOccurance],
                          tr,
                        ),
                      };
                    }
                  });

                  let lastArticle = articlesList[articlesList.length - 1];
                  lastArticle = {
                    ...lastArticle,
                    children: [...lastArticle.children, article],
                  };
                  articlesList[articlesList.length - 1] = lastArticle;
                  articleOccurance++;
                } else {
                  articleOccurance = 1;
                }
              });
              tr.docChanged && dispatch(tr);

              updateArticles(articlesList);

              // recursive function for handinliong articles and subarticles
              function setIndexForListItems(listNode, parentIndex = []) {
                let index = 1;
                let articleList = [];
                listNode.forEach((child, offset) => {
                  if (child.type.name === "listItem") {
                    let uid = child.attrs["id"] || nanoid();
                    const dataIndex = [...parentIndex, index].join(".");
                    const pos = findNodePosFromNode(tr.doc, child);
                    tr = tr.setNodeMarkup(pos, undefined, {
                      ...child.attrs,
                      "data-index": dataIndex,
                      id: uid,
                    });
                    let article = {
                      id: uid,
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
              }
            },
          };
        },
      }),
    ];
  },
});

export default ArticleExtention;
