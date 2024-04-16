import Image from "next/image";

import { Quill } from "react-quill";
import { useDispatch } from "react-redux";
var Parchment = Quill.import("parchment");
class HighlighterAttributor extends Parchment.Attributor.Class {
  add(node, value) {
    if (value === false) {
      debugger;
      this.remove(node);
      return true;
    }
    return super.add(node, value);
  }
}

const highlighter = new HighlighterAttributor("highlighter", "ql-highlighter", {
  scope: Parchment.Scope.INLINE,
  whitelist: ["active"],
});

export function handleHighlighterChange() {
  let range = this.editor.getSelection();
  let formats = this.editor.getFormat(range);
  let text = formats.highlighter ? false : "active";
  this?.editor.format("highlighter", text, Quill.sources.USER);
}

export { highlighter };
