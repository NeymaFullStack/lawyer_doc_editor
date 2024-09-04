import { documentIndexingAction } from "@/redux/editor/documentIndexingSlice";
import { cloneDeep } from "lodash";

// export function createCollapsibleListOpenState(
//   data,
//   dispatch,
//   existingOpenStateList,
// ) {
//   let tempItems = JSON.parse(JSON.stringify(data));
//   const flattenedState = flattenStateMap(existingOpenStateList, "id", "isOpen");

//   function flattenStateMap(list, key, value) {
//     const map = new Map();
//     if (!list || list.length < 1) {
//       return map;
//     }

//     function recursiveFlatten(items) {
//       items.forEach((item) => {
//         map.set(item[key], item[value]);

//         if (item.children && item.children.length > 0) {
//           recursiveFlatten(item.children);
//         }
//       });
//     }

//     recursiveFlatten(list);
//     return map;
//   }

//   function recursiveOpenStateCreator(items) {
//     if (!items || items.length < 1) {
//       return [];
//     }
//     let openState = [];
//     items.forEach((item, index) => {
//       let itemState = {
//         id: item.id,
//         isOpen: flattenedState.get(item.id) || false,
//         children: recursiveOpenStateCreator(item.children),
//       };

//       openState.push(itemState);
//     });
//     return openState;
//   }
//   let openState = recursiveOpenStateCreator(tempItems);
//   dispatch(documentIndexingAction.setCollapsibleListOpenState(openState));
// }

// collapsible component
export function createCollapsibleListOpenState(
  data,
  dispatch,
  existingOpenStateList,
) {
  let tempItems = JSON.parse(JSON.stringify(data));
  const flattenedNewOpenState = flattenStateMap(data, "id", "isOpen");
  function flattenStateMap(list, key, value) {
    const map = new Map();
    if (!list || list.length < 1) {
      return map;
    }

    function recursiveFlatten(items) {
      items.forEach((item) => {
        map.set(item[key], item[value] || false);

        if (item.children && item.children.length > 0) {
          recursiveFlatten(item.children);
        }
      });
    }
    recursiveFlatten(list);
    return map;
  }
  if (existingOpenStateList === null) {
    dispatch(
      documentIndexingAction.setCollapsibleListOpenState(flattenedNewOpenState),
    );
    return;
  }
  existingOpenStateList.size > 0 &&
    dispatch(
      documentIndexingAction.setCollapsibleListOpenState(
        new Map([...flattenedNewOpenState, ...existingOpenStateList]),
      ),
    );
}

export function toggleCollapsibleListOpenState(
  data,
  openStateData,
  targetId,
  dispatch,
) {
  let resetOpenstate = new Map(
    Array.from(cloneDeep(openStateData), ([key, value]) => {
      if (key === targetId) {
        return [key, !value];
      }
      return [key, false];
    }),
  );
  let targetIdOpenStateHierarchy = createHierarchyMap(data, targetId);
  console.log("maps", targetIdOpenStateHierarchy, resetOpenstate);
  function createHierarchyMap(list, targetId) {
    function findPathToTarget(items, targetId, map = new Map()) {
      for (let item of items) {
        // Set the current ID to true
        if (item.id === targetId) {
          map.set(item.id, !!resetOpenstate.get(item.id));
          return map;
        }
        map.set(item.id, true);
        if (item.children && item.children.length > 0) {
          const result = findPathToTarget(item.children, targetId, map);
          if (result.has(targetId)) {
            return result;
          }
        }

        map.delete(item.id); // Remove the ID if it wasn't part of the correct path
      }

      return map;
    }
    return findPathToTarget(list, targetId);
  }
  const updatedCollapsibleListOpenState = new Map([
    ...resetOpenstate,
    ...targetIdOpenStateHierarchy,
  ]);

  // function recursiveToggle(items) {
  //   if (items.length < 1) {
  //     return false;
  //   }
  //   let itemFound = false;
  //   items.forEach((item) => {
  //     if (item.id === targetId) {
  //       item.isOpen = !item.isOpen; // Set isOpen to true for the targetId
  //       itemFound = true;
  //     } else if (item.isOpen) {
  //       if (!recursiveToggle(item.children)) {
  //         item.isOpen = false;
  //       }
  //     }
  //   });
  //   return itemFound;
  // }
  // recursiveToggle(newItems);
  // Call the helper function on the root data object
  dispatch(
    documentIndexingAction.setCollapsibleListOpenState(
      updatedCollapsibleListOpenState,
    ),
  );
}
