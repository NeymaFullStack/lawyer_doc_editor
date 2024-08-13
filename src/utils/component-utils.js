import { documentIndexingAction } from "@/redux/editor/documentIndexingSlice";

export function createCollapsibleListOpenState(data, dispatch) {
  let tempItems = JSON.parse(JSON.stringify(data));
  function recursiveOpenStateCreator(items) {
    if (!items || items.length < 1) {
      return [];
    }
    let openState = [];
    items.forEach((item, index) => {
      let itemState = {
        id: item.id,
        isOpen: false,
        children: recursiveOpenStateCreator(item.children),
      };

      openState.push(itemState);
    });
    return openState;
  }
  let openState = recursiveOpenStateCreator(tempItems);
  dispatch(documentIndexingAction.setCollapsibleListOpenState(openState));
}

export function toggleCollapsibleListOpenState(data, targetId, dispatch) {
  // Helper function to recursively update the isOpen property
  const newItems = JSON.parse(JSON.stringify(data));

  function recursiveToggle(items) {
    if (items.length < 1) {
      return false;
    }
    let itemFound = false;
    items.forEach((item) => {
      if (item.id === targetId) {
        item.isOpen = !item.isOpen; // Set isOpen to true for the targetId
        itemFound = true;
      } else if (item.isOpen) {
        if (!recursiveToggle(item.children)) {
          item.isOpen = false;
        }
      }
    });
    return itemFound;
  }
  recursiveToggle(newItems);
  // Call the helper function on the root data object
  dispatch(documentIndexingAction.setCollapsibleListOpenState(newItems));
}
