import { Extension } from "@tiptap/core";

const insertArticleNode = Extension.create({
  name: "insertArticleNode",

  addCommands() {
    return {
      insertArticleNode:
        () =>
        ({ state, tr }) => {
          let articleOccurance = 1;

          // debugger;
          let trMapping = tr.mapping;
          tr.doc.descendants((node, pos) => {
            if (
              node.type.name === "classIdDiv" &&
              node.attrs.class === "doc-article"
            ) {
              const h2Node = node.child(0); // Assuming h2 is the first child of the div
              const mappedPos = trMapping.map(pos);

              const h2Pos = mappedPos + 1; // Position of h2 inside div
              let hasCustomNode = false;
              let customNodePos;

              // Check if the custom node is already present
              h2Node.descendants((childNode, childPos) => {
                if (childNode.type.name === "classIdSpan") {
                  hasCustomNode = true;
                  customNodePos = h2Pos + childPos;
                }
              });
              const newNode = state.schema.nodes.classIdSpan.create(
                { class: `doc-article-title` },
                state.schema.text(`Article ${articleOccurance}: `),
              );
              // Remove existing custom node if found
              if (
                hasCustomNode &&
                typeof customNodePos !== "undefined" &&
                h2Node.content.firstChild.textContent
              ) {
                let artcleIndex = h2Node.content.firstChild.textContent
                  .split(" ")[1]
                  .split(":")[0];
                console.log("articleIndex", artcleIndex, articleOccurance);

                if (Number(artcleIndex) !== articleOccurance) {
                  // tr = tr.delete(
                  //   customNodePos,
                  //   customNodePos + h2Node.content.firstChild.nodeSize,
                  // );
                  tr = tr.insert(h2Pos + 1, newNode);
                  console.log("reinsert");
                }
              } else {
                h2Node.type.name === "heading" && tr.insert(h2Pos + 1, newNode);
              }
              articleOccurance++;

              // Insert the new custom node with text content
            }
          });

          if (tr.docChanged) {
            state.applyTransaction(tr);
          }
        },
    };
  },
});

export default insertArticleNode;
