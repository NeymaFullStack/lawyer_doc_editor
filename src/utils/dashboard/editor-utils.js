export const findNodePos = (doc, node) => {
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
