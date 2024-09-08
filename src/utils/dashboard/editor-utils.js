import { modalType } from "@/components/dashboard/Navigation/FolderDocCreation";
import { indexingManipulationTypes, tagInsertionType } from "@/constants/enums";
import { documentIndexingAction } from "@/redux/editor/documentIndexingSlice";
import { folderNavigationAction } from "@/redux/folderNavigationSlice";
import { nanoid } from "nanoid";

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
  if (actionType) {
  }
  if (
    (level > 0 && actionType === indexingManipulationTypes.ADDITEM) ||
    actionType === indexingManipulationTypes.DELETEINPUT
  ) {
    let updateditems = recursiveManipulation(items, id);
    dispatch(documentIndexingAction.setArticlesList(updateditems));
  } else if (level === 0 && actionType === indexingManipulationTypes.ADDITEM) {
    dispatch(
      folderNavigationAction.setOpenModalType(
        modalType.DOCUMENT_TEMPLATE_TYPE_SELECTION,
      ),
    );
    dispatch(
      documentIndexingAction.setNewAppendixState({
        id: id,
        additionItemType: tagInsertionType.Appendix,
      }),
    );
  } else if (actionType === indexingManipulationTypes.ADDARTICLE) {
    let additionItemType = null;
    if (level === 1) {
      additionItemType = tagInsertionType.Article;
    } else if (level > 1) {
      additionItemType = tagInsertionType.SubArticle;
    }
    dispatch(
      documentIndexingAction.setNewAppendixState({
        additionItemType: additionItemType,
        content: articleInputValue,
      }),
    );
  } else if (actionType === indexingManipulationTypes.DELETE) {
    let deletionItemType = null;
    if (level === 0) {
      deletionItemType = tagInsertionType.Appendix;
    } else if (level === 1) {
      deletionItemType = tagInsertionType.Article;
    } else if (level > 1) {
      deletionItemType = tagInsertionType.SubArticle;
    }
    dispatch(
      documentIndexingAction.setDeleteAppendixState({
        id: id,
        deletionItemType: deletionItemType,
      }),
    );
  }

  function recursiveManipulation(items, id) {
    let tempItems = [...items];
    for (let i = 0; i < tempItems.length; i++) {
      const item = { ...tempItems[i] };
      if (item.id === id) {
        if (actionType === indexingManipulationTypes.ADDITEM) {
          let uid = nanoid();
          console.log("uid", uid);
          tempItems.splice(i + 1, 0, {
            input: true,
            children: [],
            id: uid,
          });
          dispatch(
            documentIndexingAction.setNewAppendixState({
              id: id,
            }),
          );
        }
        if (actionType === indexingManipulationTypes.DELETEINPUT) {
          tempItems.splice(i, 1);
        }
        return tempItems;
      } else if (item.children) {
        const result = recursiveManipulation(item.children, id);
        tempItems[i] = { ...item, children: result };
      }
    }
    return tempItems;
  }
};
