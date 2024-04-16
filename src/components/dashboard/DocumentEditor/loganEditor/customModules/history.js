function undoChange() {
  this.quill.history.undo();
}
function redoChange() {
  this.quill.history.redo();
}

export { undoChange, redoChange };
