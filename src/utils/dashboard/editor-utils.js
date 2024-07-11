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
