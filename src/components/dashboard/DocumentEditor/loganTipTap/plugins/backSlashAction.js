import { tagInsertionType } from "@/constants/enums";
import { Extension } from "@tiptap/core";
import { Plugin, TextSelection } from "@tiptap/pm/state";
import { stubTrue } from "lodash";

const BackSlashAction = Extension.create({
  name: "backSlashAction",
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

            if (event.key === "/") {
              this.options.openBackSlashActionModal(
                view.coordsAtPos(from),
                onClickTag,
              );
              function onClickTag(view, item) {
                const { state, dispatch } = view;
                const { selection, tr, schema, doc } = state;
                let newNode;
                if (item?.type === tagInsertionType.Variable) {
                  newNode = schema.nodes.classIdSpan.create(
                    { class: "doc-variable" },
                    [schema.text(item.tagName)],
                  );
                } else if (item?.type === tagInsertionType.Article) {
                  newNode = schema.nodes.classIdSpan.create(
                    { class: "doc-article-tag" },
                    [schema.text(`Article ${item.index} - ${item.tagName}`)],
                  );
                } else if (item?.type === tagInsertionType.SubArticle) {
                  newNode = schema.nodes.classIdSpan.create(
                    { class: "doc-article-tag" },
                    [schema.text(`${item.index} - ${item.tagName}`)],
                  );
                } else if (item?.type === tagInsertionType.Appendix) {
                  newNode = schema.nodes.classIdSpan.create(
                    { class: "doc-appendix-tag" },
                    [schema.text(`Appendix ${item.index} - ${item.tagName}`)],
                  );
                }
                let newTr = tr;
                if (newNode !== undefined) {
                  newTr = newTr.deleteRange(from, from + 1);
                  newTr = newTr.insert(from, newNode);
                  dispatch(newTr);
                }
              }
              //     menuItems,
              //     view.coordsAtPos(from),
              //   );
              //   this.options.openArticleInsertionMenu(
              //     menuItems,
              //     view.coordsAtPos(from),
              //   );
              // debugger;
              return false;
            }
          },
        },
      }),
    ];
  },
});

export default BackSlashAction;
