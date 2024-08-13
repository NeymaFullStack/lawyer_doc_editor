import { modalType } from "@/components/dashboard/Navigation/FolderDocCreation";
import { documentIndexingAction } from "@/redux/editor/documentIndexingSlice";
import { folderNavigationAction } from "@/redux/folderNavigationSlice";
import { Snowburst_One } from "next/font/google";

export const findNodePosFromNode = (doc, node) => {
  let nodePos = null;

  doc.descendants((descendant, pos) => {
    if (descendant === node) {
      nodePos = pos;
      return false; // Stop the traversal
    }
    return true; // Continue the traversal
  });

  return nodePos;
};

export const findNodePosFromId = (doc, id) => {
  let foundPos = null;
  let foundNode = null;

  doc.descendants((node, pos) => {
    if (node.attrs.id === id) {
      foundPos = pos;
      foundNode = node;
      return false; // Stop the traversal
    }
  });

  if (foundPos !== null && foundNode !== null) {
    // The end position is the starting position + node size
    return foundPos + foundNode.nodeSize;
  }

  // If the node is not found, return the last position of the document
  return doc.content.size;
};

export const findOutermostNode = (node, state) => {
  let { $from } = state.selection;
  let depth = $from.depth;

  // Traverse up the ancestors until you reach the top-level node
  while (depth > 0) {
    node = $from.node(depth);
    depth--;
  }
  return node;
};

export const manipulateItems = (
  dispatch,
  items,
  actionType,
  id,
  level,
  articleInputValue,
) => {
  const uuid = () => crypto.randomUUID();

  let updateditems = recursiveManipulation(
    items,
    id,
    actionType,
    level,
    articleInputValue,
  );
  if (level > 0 && (actionType === "addNew" || actionType === "delete")) {
    dispatch(documentIndexingAction.setArticlesList(updateditems));
  }

  function recursiveManipulation(
    items,
    id,
    actionType,
    level,
    articleInputValue,
  ) {
    let tempItems = [...items];
    for (let i = 0; i < tempItems.length; i++) {
      const item = { ...tempItems[i] };
      if (item.id === id) {
        switch (actionType) {
          case "addNew":
            if (level === 0) {
              dispatch(
                folderNavigationAction.setOpenModalType(
                  modalType.DOCUMENT_TEMPLATE_TYPE_SELECTION,
                ),
              );
              dispatch(
                documentIndexingAction.setNewAppendixState({
                  id: id,
                }),
              );
            } else {
              tempItems.splice(i + 1, 0, {
                input: true,
                children: [],
                id: uuid(),
              });
            }
            return tempItems;

          case "saveNew":
            if (tempItems[i + 1] && tempItems[i + 1].input) {
              const newIndex = parseInt(item.index) + 1;
              tempItems[i + 1] = {
                title: articleInputValue,
                children: [],
                id: uuid(),
                index: newIndex,
                type: level > 0 && (level === 1 ? "Article" : "SubArticle"),
              };
            }
            return true;

          case "delete":
            tempItems.splice(i, 1);
            return tempItems;
        }
      } else if (item.children) {
        const result = recursiveManipulation(
          item.children,
          id,
          actionType,
          level,
          articleInputValue,
        );
        tempItems[i] = { ...item, children: result };
      }
    }
    return tempItems;
  }
};
