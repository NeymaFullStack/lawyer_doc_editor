import { findNodePos } from "@/utils/dashboard/editor-utils";
import { Extension } from "@tiptap/core";
import { Plugin, TextSelection } from "@tiptap/pm/state";

const ArticleInsertion = Extension.create({
  name: "articleInsertion",
  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleKeyDown: (view, event) => {
            const { state, dispatch } = view;
            const { selection, tr, schema, doc } = state;
            const { $from, $to, from } = selection;
            const currentNode = $from.node();
            const parentNode = $from.node($from.depth - 1);
            // const grandParentNode = $from.node($from.depth - 2);
            // const greatGrandParentNode = $from.node($from.depth - 3);
            console.log("key", event.key);
            if (event.key === "&") {
              let menuItems = [];
              // debugger;
              if (
                $from.depth == 2 &&
                currentNode.type.name === "paragraph" &&
                parentNode.attrs.class === "doc-article"
              ) {
                let artcleIndex =
                  parentNode?.content?.firstChild?.content?.firstChild?.textContent
                    ?.split(" ")[1]
                    ?.split(":")[0];

                let item = createArticleInsertionItem(
                  $from.after($from.depth - 1) + 1,
                  Number(artcleIndex) + 1,
                  "article",
                  from,
                );
                menuItems.push(item);
                if (parentNode.lastChild.type.name === "paragraph") {
                  let item = createArticleInsertionItem(
                    $from.after(),
                    Number(artcleIndex) + ".1",
                    "nestedList",
                    from,
                  );
                  menuItems.push(item);
                } else if (parentNode.lastChild.type.name === "bulletList") {
                  let listPos = findNodePos(doc, parentNode.lastChild);

                  let item = createArticleInsertionItem(
                    listPos + 2,
                    Number(artcleIndex) + ".1",
                    "subArticle",
                    from,
                  );
                  menuItems.push(item);
                }
                // debugger;
              } else if (
                $from.depth == 1 &&
                currentNode.type.name === "paragraph"
              ) {
                let artcleIndex = 1;
                if (currentNode.textContent.length == 0) {
                  if (
                    doc.resolve($from.before()).nodeBefore.attrs.class ===
                    "doc-article"
                  ) {
                    artcleIndex = doc
                      .resolve($from.before())
                      .nodeBefore?.content?.firstChild?.content?.firstChild?.textContent?.split(
                        " ",
                      )[1]
                      ?.split(":")[0];
                    let item = createArticleInsertionItem(
                      $from.after(),
                      Number(artcleIndex) + 1,
                      "article",
                      from,
                      { from: $from.before(), to: $from.after() + 1 }, //+1 for when & keyword will aslos be added
                    );
                    menuItems.push(item);
                  } else if (
                    doc.resolve($from.before()).nodeBefore.type.name ===
                      "paragraph" ||
                    doc.resolve($from.before()).nodeBefore.attrs.class !==
                      "doc-article"
                  ) {
                    let item = createArticleInsertionItem(
                      $from.after() + 1,
                      1,
                      "article",
                      from,
                      { from: $from.before(), to: $from.after() + 1 }, //+1 for when & keyword will aslos be added
                    );
                    menuItems.push(item);
                  }
                } else if (currentNode.textContent.length > 0) {
                  let item = createArticleInsertionItem(
                    $from.after() + 1,
                    1,
                    "article",
                    from,
                  );
                  menuItems.push(item);
                }
              } else if (
                currentNode.type.name === "paragraph" &&
                parentNode.type.name === "listItem" &&
                parentNode.attrs["data-index"]
              ) {
                let currentArticleDataIndex = parentNode.attrs["data-index"];
                const mainArticleIndex = Number(
                  String(currentArticleDataIndex).charAt(0),
                );

                menuItems.push(
                  createArticleInsertionItem(
                    $from.after(1) + 1,
                    mainArticleIndex + 1,
                    "article",
                    from,
                  ),
                );
                let subArticleIndex =
                  String(currentArticleDataIndex).substring(
                    0,
                    currentArticleDataIndex.length - 1,
                  ) +
                  (Number(
                    String(currentArticleDataIndex).charAt(
                      currentArticleDataIndex.length - 1,
                    ),
                  ) +
                    1);
                menuItems.push(
                  createArticleInsertionItem(
                    $from.after($from.depth - 1) + 1,
                    subArticleIndex,
                    "subArticle",
                    from,
                  ),
                );
                let nestedSubArticleIndex = currentArticleDataIndex + ".1";

                menuItems.push(
                  createArticleInsertionItem(
                    $from.after() + 1,
                    nestedSubArticleIndex,
                    "nestedList",
                    from,
                  ),
                );
              }
              // console.log("event",event.getBoundingClientRect())
              this.options.openArticleInsertionMenu(
                menuItems,
                view.coordsAtPos(from),
              );
              // debugger;
              return false;
            }
          },
        },
      }),
    ];
  },
});

function createArticleInsertionItem(
  articleInsertPos,
  articleIndex,
  articleInsertionType,
  andPos,
  delRange = null,
) {
  let item = {
    type: articleInsertionType,
    index: articleIndex,
    onClick: (text, view) => {
      const { dispatch, state } = view;
      const { tr, schema } = state;
      const boldMark = schema.marks.bold.create();

      let newArticle = null;
      if (articleInsertionType === "article") {
        newArticle = schema.nodes.classIdDiv.create({ class: "doc-article" }, [
          schema.nodes.heading.create(
            { level: 2, id: crypto.randomUUID() },
            schema.text(text),
          ),
        ]);
      } else if (articleInsertionType === "subArticle") {
        newArticle = state.schema.nodes.listItem.create(
          {
            id: crypto.randomUUID(),
          },
          state.schema.nodes.paragraph.create(
            {},
            schema.text(text + ": ", [boldMark]),
          ),
        );
      } else if (articleInsertionType === "nestedList") {
        newArticle = state.schema.nodes.bulletList.create(
          {},
          state.schema.nodes.listItem.create(
            {
              id: crypto.randomUUID(),
            },
            state.schema.nodes.paragraph.create(
              {},
              schema.text(text + ": ", [boldMark]),
            ),
          ),
        );
      }

      let newTr = tr;
      console.log("docSize", tr.doc.nodeSize);
      newTr = newTr.deleteRange(andPos, andPos + 1);

      if (newArticle) {
        newTr = newTr.insert(articleInsertPos - 1, newArticle);
      }
      if (delRange !== null && delRange.from && delRange.to) {
        newTr = newTr.deleteRange(delRange.from, delRange.to);
      }
      let resolvePosDeletion = delRange !== null ? 2 : 0;
      const resolvedPos = newTr.doc.resolve(
        articleInsertPos + newArticle.nodeSize - 2 - resolvePosDeletion,
      );
      const selection = TextSelection.create(newTr.doc, resolvedPos.pos);
      // debugger;
      view.focus();
      newTr.setSelection(selection);
      console.log("view", view);
      dispatch(newTr);
    },
  };
  return item;
}

export default ArticleInsertion;
