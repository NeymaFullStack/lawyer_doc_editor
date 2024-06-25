import { findNodePos } from "@/utils/dashboard/editor-utils";
import { Extension } from "@tiptap/core";
import { NodeSelection, Plugin } from "@tiptap/pm/state";
import { doc } from "prettier";

const ArticleInsertion = Extension.create({
  name: "articleInsertion",
  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleKeyDown: (view, event) => {
            console.log("key", event.key);
            if (event.key === "&") {
              const { state, dispatch } = view;
              const { selection, tr, schema } = state;
              const { $from, $to } = selection;
              const currentNode = $from.node();
              const parentNode = $from.node($from.depth - 1);
              const grandParentNode = $from.node($from.depth - 2);
              const greatGrandParentNode = $from.node($from.depth - 3);
              let menuItems = [];
              if (
                $from.depth == 2 &&
                currentNode.type.name === "paragraph" &&
                parentNode.attrs.class === "doc-article"
              ) {
                let artcleIndex =
                  parentNode?.content?.firstChild?.content?.firstChild?.textContent
                    ?.split(" ")[1]
                    ?.split(":")[0];
                let item = {
                  type: "Article",
                  index: artcleIndex + 1,
                  onClick: (text) => {
                    let newArticle = schema.nodes.classIdDiv.create(
                      { class: "doc-article" },
                      [
                        schema.nodes.heading.create(
                          { level: 2, id: crypto.randomUUID() },
                          schema.text(text),
                        ),
                      ],
                    );
                    const pos = $from.after($from.depth - 1);
                    const tr = state.tr.insert(pos, newArticle);
                    dispatch(
                      tr.setSelection(
                        NodeSelection.near(tr.doc.resolve(pos + 2)),
                      ),
                    );
                  },
                };
                menuItems.push(item);
                // debugger;
              } else if (
                $from.depth == 1 &&
                currentNode.type.name === "paragraph"
              ) {
                let artcleIndex = 1;
                if (currentNode.textContent.length == 0) {
                  console.log("node", state.doc.resolve($from.before()));
                }
                // let item = {
                //   type: "Article",
                //   index: currentNode.textContent ? 1 : artcleIndex + 1,
                //   onClick: (text) => {
                //     let newArticle = schema.nodes.classIdDiv.create(
                //       { class: "doc-article" },
                //       [
                //         schema.nodes.heading.create(
                //           { level: 2, id: crypto.randomUUID() },
                //           schema.text(text),
                //         ),
                //       ],
                //     );
                //     const pos = $from.after($from.depth - 1);
                //     const tr = state.tr.insert(pos, newArticle);
                //     dispatch(
                //       tr.setSelection(
                //         NodeSelection.near(tr.doc.resolve(pos + 2)),
                //       ),
                //     );
                //   },
                // };
                // menuItems.push(item);
                // debugger;
              } else if (
                currentNode.type.name === "paragraph" &&
                parentNode.type.name === "listItem" &&
                parentNode.attrs["data-index"]
              )
                return false;
            }
          },
        },
      }),
    ];
  },
});

export default ArticleInsertion;
